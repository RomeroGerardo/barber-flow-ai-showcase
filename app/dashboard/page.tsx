import { createClient } from '@/lib/supabase/server'
import { AppointmentList } from "@/components/dashboard/appointment-list"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import Link from 'next/link'

// Forzar renderizado dinámico para evitar errores de prerendering con Supabase
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch appointments
    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })

    if (error) {
        return <div>Error al cargar citas</div>
    }

    // Calculate Stats
    const totalAppointments = appointments?.length || 0;
    // Note: Since price was just added, we use a fallback for old records or dynamic calculation if we had services
    const completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0;
    const pendingAppointments = appointments?.filter(a => a.status === 'pending').length || 0;

    // Mock Revenue calculation (in a real app, join with services or use price column)
    // For now, assume average ticket of $15
    const estimatedRevenue = (appointments?.filter(a => a.status === 'completed' || a.status === 'confirmed').length || 0) * 15;

    // Mock Graph Data (Last 7 days)
    const today = new Date();
    const graphData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
        // Random mock data for demo visual
        // In production: group appointments by date
        return {
            name: dayName,
            total: Math.floor(Math.random() * 100) + 20
        };
    });


    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard del Barbero</h1>
                    <p className="text-muted-foreground">Bienvenido, {user.email}</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/services">
                        <Button variant="secondary">
                            Gestionar Servicios
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="outline">
                            Configuración
                        </Button>
                    </Link>
                    <form action={async () => {
                        'use server'
                        const supabase = await createClient()
                        await supabase.auth.signOut()
                        redirect('/login')
                    }}>
                        <Button variant="outline" type="submit">
                            Cerrar Sesión
                        </Button>
                    </form>
                </div>
            </div>

            <StatsCards
                totalAppointments={totalAppointments}
                completedAppointments={completedAppointments}
                estimatedRevenue={estimatedRevenue}
                pendingAppointments={pendingAppointments}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RevenueChart data={graphData} />
                <div className="col-span-3">
                    {/* Future: Recent Activity or Top Services */}
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Gestión de Citas</h2>
                <AppointmentList initialAppointments={appointments || []} />
            </div>
        </div>
    )
}
