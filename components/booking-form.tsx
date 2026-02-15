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
import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

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

export function BookingForm() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [date, setDate] = useState<Date>()
    const [services, setServices] = useState<Service[]>([])
    const [selectedServiceId, setSelectedServiceId] = useState<string>('')
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [busySlots, setBusySlots] = useState<string[]>([])
    const [loadingAvailability, setLoadingAvailability] = useState(false)
    const [wantsToDeposit, setWantsToDeposit] = useState(false)

    const supabase = createClient()

    // Fetch Services
    useEffect(() => {
        const fetchServices = async () => {
            const { data } = await supabase.from('services').select('*').order('price', { ascending: true })
            if (data) setServices(data)
        }
        fetchServices()
    }, [])

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
                    console.log('Booked Slots (ISO):', data.busySlots)
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

                // Filter past times if it's today
                if (isToday && slotDate < now) continue;

                // Check against busy slots
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
        const form = e.currentTarget // Capture form reference

        if (!date || !selectedTime) return

        const formData = new FormData(form) // Use captured form

        // Construct Appointment Date
        const [hours, minutes] = selectedTime.split(':')
        const appointmentDate = new Date(date)
        appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

        const price = selectedService?.price || 0
        const depositAmount = Math.round(price * 0.30)

        const appointmentData = {
            client_name: formData.get('name'),
            client_phone: formData.get('phone'),
            client_email: formData.get('email'),
            service_type: selectedService?.name || 'Servicio Personalizado',
            notes: formData.get('notes'),
            appointment_date: appointmentDate.toISOString(),
            status: wantsToDeposit ? 'pending' : 'confirmed',
            price: price,
            payment_status: wantsToDeposit ? 'pending' : 'none',
            deposit_amount: wantsToDeposit ? depositAmount : 0
        }

        try {
            // 1. Create Appointment
            const { data: newAppointment, error } = await supabase
                .from('appointments')
                .insert([appointmentData])
                .select()
                .single()

            if (error) throw error

            if (wantsToDeposit && newAppointment) {
                // 2. Create Payment Preference
                const response = await fetch('/api/mercadopago/create-preference', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        appointment_id: newAppointment.id,
                        service_name: appointmentData.service_type,
                        price: appointmentData.price,
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
                    console.error('Error creating preference', preference)
                    // Mostrar error específico del servidor si existe
                    const errorMessage = preference.error
                        ? `Error: ${preference.message || preference.error}`
                        : 'Hubo un error al generar el pago. La cita se guardó pero no se pudo iniciar el pago.';

                    alert(errorMessage);
                    setSuccess(true)
                }
            } else {
                setSuccess(true)
                form.reset()
                setDate(undefined)
                setSelectedServiceId('')
                setSelectedTime(null)
                setWantsToDeposit(false)
            }
        } catch (error: any) {
            console.error('Error booking:', JSON.stringify(error, null, 2))
            alert(`Error al agendar: ${error.message || JSON.stringify(error) || 'Error desconocido'}`)
        } finally {
            if (!wantsToDeposit) setLoading(false)
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
                        Tu cita ha sido registrada correctamente. Te esperamos.
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
                <CardTitle>Reserva tu Cita</CardTitle>
                <CardDescription>
                    Completa el formulario para agendar tu próxima visita.
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
                            <Input id="phone" name="phone" type="tel" required placeholder="+54 9 11..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="juan@ejemplo.com" />
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
                                                !available && "opacity-50 cursor-not-allowed bg-red-100 text-red-900 border-red-200 hover:bg-red-100 hover:text-red-900 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50"
                                            )}
                                            disabled={!available}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                    {timeSlots.length === 0 && (
                                        <p className="col-span-4 text-center text-sm text-muted-foreground">
                                            No hay horarios hoy (o ya pasaron).
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notas Adicionales</Label>
                        <Textarea id="notes" name="notes" placeholder="¿Algún detalle especial?" />
                    </div>

                    {selectedService && (
                        <div className="flex items-center space-x-2 border p-4 rounded-md bg-muted/50">
                            <Checkbox
                                id="deposit"
                                checked={wantsToDeposit}
                                onCheckedChange={(checked) => setWantsToDeposit(checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="deposit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Pagar seña del 30% ahora (${Math.round(selectedService.price * 0.3)})
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    (Opcional) Asegura tu turno congelando el precio.
                                </p>
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading || !date || !selectedServiceId || !selectedTime}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {wantsToDeposit ? 'Procesando Pago...' : 'Agendando...'}
                            </>
                        ) : (
                            wantsToDeposit ? 'Ir a Pagar y Reservar' : 'Confirmar Reserva'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
