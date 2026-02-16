import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, Trophy } from "lucide-react"
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function ClientDashboard() {
    const supabase = await createClient()

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/')
    }

    // 2. Fetch Profile Stats (Assuming the trigger created the profile)
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // 3. Fetch User Appointments
    const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false })

    const totalAppointments = appointments?.length || 0
    const upcomingAppointments = appointments?.filter(a => new Date(a.appointment_date) > new Date()) || []
    const pastAppointments = appointments?.filter(a => new Date(a.appointment_date) <= new Date()) || []

    // Calculate total spent manually just in case profile isn't updated yet
    const totalSpent = appointments
        ?.filter(a => a.status === 'completed')
        .reduce((acc, curr) => acc + (curr.price || 0), 0) || 0

    const loyaltyLevel = totalAppointments > 10 ? 'Oro' : totalAppointments > 5 ? 'Plata' : 'Bronce'
    const loyaltyColor = loyaltyLevel === 'Oro' ? 'text-yellow-500 bg-yellow-500/10' : loyaltyLevel === 'Plata' ? 'text-slate-400 bg-slate-400/10' : 'text-amber-700 bg-amber-700/10'

    return (
        <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Hola, {profile?.full_name || 'Cliente'}</h1>
                    <p className="text-muted-foreground">Bienvenido a tu panel personal.</p>
                </div>
                <Link href="/">
                    <Button variant="outline">Ir al Inicio</Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Loyalty Card */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Nivel de Fidelidad</CardTitle>
                        <Trophy className={`h-4 w-4 ${loyaltyLevel === 'Oro' ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold inline-flex items-center gap-2 px-3 py-1 rounded-full ${loyaltyColor}`}>
                            {loyaltyLevel}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {10 - totalAppointments > 0
                                ? `${10 - totalAppointments} cortes más para nivel Oro`
                                : '¡Eres un cliente VIP!'}
                        </p>
                    </CardContent>
                </Card>

                {/* Total Spent */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Inversión Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            En servicios de barbería premium
                        </p>
                    </CardContent>
                </Card>

                {/* Total Appointments */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Cortes Realizados</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAppointments}</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Visitas registradas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Appointments List */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight">Tu Historial</h2>

                    {upcomingAppointments.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Próximos Turnos</h3>
                            {upcomingAppointments.map((apt) => (
                                <Card key={apt.id} className="border-l-4 border-l-primary">
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{apt.service_type}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(parseISO(apt.appointment_date), "EEEE d 'de' MMMM, HH:mm", { locale: es })} hs
                                            </p>
                                            <Badge variant="secondary" className="mt-2">{apt.status === 'pending' ? 'Pendiente de Pago' : 'Confirmado'}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Turnos Anteriores</h3>
                        {pastAppointments.length > 0 ? (
                            pastAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                                    <div>
                                        <p className="font-medium">{apt.service_type}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(parseISO(apt.appointment_date), "dd/MM/yyyy")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${apt.price}</p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            {apt.status === 'completed' ? 'Completado' : apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm">No tienes cortes anteriores registrados.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Reservar Nuevo Turno</CardTitle>
                            <CardDescription>Elige tu próximo estilo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/reservar">
                                <Button className="w-full" size="lg">
                                    Reservar Ahora
                                </Button>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-4 text-center">
                                Como cliente registrado, puedes elegir pagar en el local.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}
