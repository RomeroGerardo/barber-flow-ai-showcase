import { createClient } from '@/lib/supabase/server'
import { AppointmentList } from "@/components/dashboard/appointment-list"
import { redirect } from "next/navigation"

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

export default async function AgendaPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch all appointments ordered by date 
    const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false })

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Agenda
                </h1>
                <p className="text-muted-foreground">
                    Gestiona las citas de tus clientes
                </p>
            </div>

            <AppointmentList initialAppointments={appointments || []} />
        </div>
    )
}
