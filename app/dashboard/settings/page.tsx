import { WorkingHoursForm } from "@/components/dashboard/working-hours-form"

// Forzar renderizado dinámico para evitar errores de prerendering con Supabase
export const dynamic = 'force-dynamic'

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <WorkingHoursForm />
            </div>
        </div>
    )
}
