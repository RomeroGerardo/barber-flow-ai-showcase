import { createClient } from '@/lib/supabase/server'
import { AppointmentList } from "@/components/dashboard/appointment-list"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { GapAlert } from "@/components/dashboard/gap-alert"
import { redirect } from "next/navigation"
import { isToday, parseISO, differenceInHours, format } from "date-fns"

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

    // Fetch daily goal from settings
    const { data: goalSetting } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'daily_goal')
        .single()

    const dailyGoal = goalSetting?.value?.amount || 300;

    // Today's appointments
    const todayAppointments = appointments?.filter(a =>
        isToday(parseISO(a.appointment_date))
    ) || [];

    // Calculate Stats
    const totalAppointments = todayAppointments.length;
    const completedAppointments = todayAppointments.filter(a => a.status === 'completed').length;
    const pendingAppointments = todayAppointments.filter(a => a.status === 'pending').length;

    // Revenue calculation (use price from appointment or default)
    const todayRevenue = todayAppointments
        .filter(a => a.status === 'completed' || a.status === 'confirmed')
        .reduce((sum, a) => sum + (a.price || 15), 0);

    // Average ticket
    const avgTicket = completedAppointments > 0
        ? todayRevenue / completedAppointments
        : 0;

    // Calculate free hours today (simplified: assume 8 hours workday, subtract booked)
    const bookedHours = todayAppointments.filter(a =>
        a.status !== 'cancelled'
    ).length * 0.5; // Assume 30min per appointment
    const freeHoursToday = Math.max(0, 8 - bookedHours);

    // Find next gap time
    const now = new Date();
    const upcomingToday = todayAppointments
        .filter(a => a.status !== 'cancelled' && parseISO(a.appointment_date) > now)
        .sort((a, b) => parseISO(a.appointment_date).getTime() - parseISO(b.appointment_date).getTime());

    const nextGapTime = upcomingToday.length > 0
        ? format(parseISO(upcomingToday[0].appointment_date), "HH:mm")
        : undefined;

    // Graph Data (Last 7 days)
    const today = new Date();
    const graphData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
        return {
            name: dayName,
            total: Math.floor(Math.random() * 100) + 20
        };
    });

    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    ¡Hola! 👋
                </h1>
                <p className="text-muted-foreground">
                    Resumen de tu día en BarberFlow
                </p>
            </div>

            {/* Gap Alert */}
            {freeHoursToday > 0 && (
                <GapAlert
                    freeHoursToday={freeHoursToday}
                    nextGapTime={nextGapTime}
                />
            )}

            {/* Stats Cards */}
            <StatsCards
                totalAppointments={totalAppointments}
                completedAppointments={completedAppointments}
                estimatedRevenue={todayRevenue}
                pendingAppointments={pendingAppointments}
                dailyGoal={dailyGoal}
                averageTicket={avgTicket}
            />

            {/* Main Grid */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Chart */}
                <RevenueChart data={graphData} />

                {/* Upcoming Appointments */}
                <UpcomingAppointments appointments={appointments || []} />
            </div>

            {/* All Appointments */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Gestión de Citas</h2>
                <AppointmentList initialAppointments={appointments || []} />
            </div>
        </div>
    )
}

