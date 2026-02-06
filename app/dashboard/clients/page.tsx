import { createClient } from '@/lib/supabase/server'
import { ClientsList } from "@/components/dashboard/clients-list"
import { AddClientDialog } from "@/components/dashboard/add-client-dialog"
import { redirect } from "next/navigation"

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch clients
    const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_visit', { ascending: false, nullsFirst: false })

    if (error) {
        // If table doesn't exist yet, show empty state with instructions
        return (
            <div className="p-6 md:p-8 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Clientes
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona tu base de clientes
                    </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-yellow-500 mb-2">
                        ⚠️ Tabla de clientes no encontrada
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Debes ejecutar la migración SQL para crear la tabla de clientes.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Archivo: <code className="bg-muted px-2 py-1 rounded">supabase/clients_migration.sql</code>
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
                        Clientes
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona tu base de clientes y programa de lealtad
                    </p>
                </div>
                <AddClientDialog />
            </div>

            <ClientsList initialClients={clients || []} />
        </div>
    )
}
