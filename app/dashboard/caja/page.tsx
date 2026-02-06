import { createClient } from '@/lib/supabase/server'
import { CashMovementsList } from "@/components/dashboard/cash-movements-list"
import { CashMovementDialog } from "@/components/dashboard/cash-movement-dialog"
import { redirect } from "next/navigation"

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

export default async function CajaPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch movements for today by default
    const today = new Date().toISOString().split('T')[0]
    const { data: movements, error } = await supabase
        .from('cash_movements')
        .select('*')
        .eq('movement_date', today)
        .order('created_at', { ascending: false })

    if (error) {
        // If table doesn't exist yet, show empty state with instructions
        return (
            <div className="p-6 md:p-8 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Caja
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona tus ingresos y gastos
                    </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-yellow-500 mb-2">
                        ⚠️ Tabla de movimientos no encontrada
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Debes ejecutar la migración SQL para crear la tabla de movimientos.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Archivo: <code className="bg-muted px-2 py-1 rounded">supabase/cash_register_migration.sql</code>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Caja
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona tus ingresos y gastos del día
                    </p>
                </div>
                <div className="flex gap-2">
                    <CashMovementDialog defaultType="income" />
                    <CashMovementDialog defaultType="expense" />
                </div>
            </div>

            <CashMovementsList initialMovements={movements || []} />
        </div>
    )
}
