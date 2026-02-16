'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type Service = {
    id: number
    name: string
    price: number
    duration_minutes: number
}

// Configuration
const OPENING_HOUR = 9; // 9 AM
const CLOSING_HOUR = 20; // 8 PM
const TIME_INTERVAL = 30; // 30 minutes

interface BookingFormProps {
    mode?: 'guest' | 'authenticated'
}

export function BookingForm({ mode = 'authenticated' }: BookingFormProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [date, setDate] = useState<Date>()
    const [services, setServices] = useState<Service[]>([])
    const [selectedServiceId, setSelectedServiceId] = useState<string>('')
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [busySlots, setBusySlots] = useState<string[]>([])
    const [loadingAvailability, setLoadingAvailability] = useState(false)

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'full' | 'deposit' | 'local'>('full')

    // Auth State (for user_id)
    const [userId, setUserId] = useState<string | null>(null)

    const supabase = createClient()

    // Fetch Services & User
    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: servicesData } = await supabase.from('services').select('*').order('price', { ascending: true })
            if (servicesData) setServices(servicesData)

            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
        }
        fetchInitialData()
    }, [])

    // Set default payment method based on mode
    useEffect(() => {
        if (mode === 'guest') {
            setPaymentMethod('full')
        } else {
            setPaymentMethod('local')
        }
    }, [mode])

    // Fetch Availability when date changes
    useEffect(() => {
        if (!date) return;

        const fetchAvailability = async () => {
            setLoadingAvailability(true)
            setSelectedTime(null) // Reset selection
            try {
                // Format date as YYYY-MM-DD for the API (local time)
                const dateString = format(date, 'yyyy-MM-dd')
                const response = await fetch(`/api/availability?date=${dateString}`)
                const data = await response.json()
                if (data.busySlots) {
                    setBusySlots(data.busySlots)
                }
            } catch (error) {
                console.error('Error fetching availability:', error)
            } finally {
                setLoadingAvailability(false)
            }
        }
        fetchAvailability()
    }, [date])

    const selectedService = services.find(s => s.id.toString() === selectedServiceId)

    // Generate Time Slots
    const generateTimeSlots = () => {
        if (!date) return [];

        const slots = [];
        const now = new Date();
        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

        for (let hour = OPENING_HOUR; hour < CLOSING_HOUR; hour++) {
            for (let minute = 0; minute < 60; minute += TIME_INTERVAL) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const slotDate = new Date(date);
                slotDate.setHours(hour, minute, 0, 0);

                if (isToday && slotDate < now) continue;

                const isBusy = busySlots.some(busyIso => {
                    const busyDate = new Date(busyIso);
                    return busyDate.getHours() === hour && busyDate.getMinutes() === minute;
                });

                slots.push({
                    time: timeString,
                    available: !isBusy
                });
            }
        }
        return slots;
    }

    const timeSlots = generateTimeSlots();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const form = e.currentTarget
        if (!date || !selectedTime) return

        const formData = new FormData(form)

        // Construct Appointment Date
        const [hours, minutes] = selectedTime.split(':')
        const appointmentDate = new Date(date)
        appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

        const price = selectedService?.price || 0

        let depositAmount = 0
        if (paymentMethod === 'deposit') {
            depositAmount = Math.round(price * 0.30)
        } else if (paymentMethod === 'full') {
            depositAmount = price
        }

        const wantsToPayOnline = paymentMethod === 'deposit' || paymentMethod === 'full'

        const appointmentData = {
            client_name: formData.get('name'),
            client_phone: formData.get('phone'),
            client_email: formData.get('email'),
            service_type: selectedService?.name || 'Servicio Personalizado',
            notes: formData.get('notes'),
            appointment_date: appointmentDate.toISOString(),
            status: wantsToPayOnline ? 'pending' : 'confirmed',
            price: price,
            payment_status: wantsToPayOnline ? 'pending' : 'none',
            deposit_amount: depositAmount,
            user_id: userId // Link to user if logged in
        }

        try {
            // 1. Create Appointment
            const { data: newAppointment, error } = await supabase
                .from('appointments')
                .insert([appointmentData])
                .select()
                .single()

            if (error) throw error

            if (wantsToPayOnline && newAppointment) {
                // 2. Create Payment Preference
                const response = await fetch('/api/mercadopago/create-preference', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        appointment_id: newAppointment.id,
                        service_name: appointmentData.service_type,
                        price: depositAmount, // Charge the deposit or full amount
                        client_email: appointmentData.client_email,
                        client_name: appointmentData.client_name
                    })
                })

                const preference = await response.json()

                if (preference.sandbox_init_point || preference.init_point) {
                    // Redirect to MercadoPago
                    window.location.href = preference.sandbox_init_point || preference.init_point
                    return // Stop execution to allow redirect
                } else {
                    alert('Error al generar el pago. Intenta de nuevo.')
                    setSuccess(true) // Fallback behavior
                }
            } else {
                setSuccess(true)
                form.reset()
                setDate(undefined)
                setSelectedServiceId('')
                setSelectedTime(null)
            }
        } catch (error: any) {
            console.error('Error booking:', error)
            alert(`Error al agendar: ${error.message || 'Intente nuevamente'}`)
        } finally {
            if (!wantsToPayOnline) setLoading(false)
        }
    }

    if (success) {
        return (
            <Card className="w-full max-w-lg mx-auto border-green-500/50 bg-green-500/10">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">¡Cita Solicitada!</h3>
                    <p className="text-muted-foreground">
                        Tu cita ha sido registrada. {paymentMethod === 'local' ? ' Te esperamos en el local.' : ' Pago procesado correctamente.'}
                    </p>
                    <Button onClick={() => setSuccess(false)} variant="outline">
                        Agendar otra cita
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>{mode === 'guest' ? 'Reserva Express' : 'Reserva tu Cita'}</CardTitle>
                <CardDescription>
                    {mode === 'guest'
                        ? 'Completa tus datos para una reserva rápida. Se requiere pago total.'
                        : 'Completa el formulario para agendar tu próxima visita.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" name="name" required placeholder="Juan Pérez" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input id="phone" name="phone" type="tel" required placeholder="+54 9..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="juan@ejemplo.com" required={mode === 'guest'} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="service">Servicio</Label>
                        <Select
                            name="service"
                            required
                            value={selectedServiceId}
                            onValueChange={setSelectedServiceId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un servicio" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.length > 0 ? (
                                    services.map(service => (
                                        <SelectItem key={service.id} value={service.id.toString()}>
                                            {service.name} - ${service.price}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="loading" disabled>Cargando servicios...</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {selectedService && (
                            <p className="text-sm text-muted-foreground mt-1">
                                Duración estimada: {selectedService.duration_minutes} min
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Fecha</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP", { locale: es }) : <span>Elegir fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {date && (
                        <div className="space-y-2">
                            <Label>Horarios Disponibles</Label>
                            {loadingAvailability ? (
                                <div className="flex items-center text-muted-foreground text-sm">
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Buscando disponibilidad...
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map(({ time, available }) => (
                                        <Button
                                            key={time}
                                            type="button"
                                            variant={selectedTime === time ? "default" : "outline"}
                                            className={cn(
                                                "text-xs",
                                                !available && "opacity-50 cursor-not-allowed bg-red-100 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50"
                                            )}
                                            disabled={!available}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                    {timeSlots.length === 0 && (
                                        <p className="col-span-4 text-center text-sm text-muted-foreground">
                                            No hay horarios hoy.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {selectedService && (
                        <div className="space-y-3 pt-2">
                            <Label className="text-base">Método de Pago</Label>

                            {mode === 'guest' ? (
                                <div className="border p-4 rounded-md bg-amber-500/10 border-amber-500/20 flex gap-3 items-start">
                                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-amber-700 text-sm">Pago Total Requerido</p>
                                        <p className="text-xs text-amber-600/80">
                                            Al ser una reserva express sin cuenta, necesitamos el pago del 100% (${selectedService.price}) para confirmar el turno.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(val: 'full' | 'deposit' | 'local') => setPaymentMethod(val)}
                                    className="grid grid-cols-1 gap-3"
                                >
                                    <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem value="local" id="r-local" />
                                        <Label htmlFor="r-local" className="flex-1 cursor-pointer">
                                            Pagar en el Local
                                            <span className="block text-xs text-muted-foreground font-normal">Efectivo o transferencia al llegar</span>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem value="deposit" id="r-deposit" />
                                        <Label htmlFor="r-deposit" className="flex-1 cursor-pointer">
                                            Seña del 30% (${Math.round(selectedService.price * 0.3)})
                                            <span className="block text-xs text-muted-foreground font-normal">Congela el precio y asegura tu lugar</span>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem value="full" id="r-full" />
                                        <Label htmlFor="r-full" className="flex-1 cursor-pointer">
                                            Pago Total Online (${selectedService.price})
                                            <span className="block text-xs text-muted-foreground font-normal">Despreocúpate de pagar después</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading || !date || !selectedServiceId || !selectedTime}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            mode === 'guest' || paymentMethod !== 'local'
                                ? `Ir a Pagar $${paymentMethod === 'deposit' ? Math.round((selectedService?.price || 0) * 0.3) : (selectedService?.price || 0)}`
                                : 'Confirmar Reserva'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
