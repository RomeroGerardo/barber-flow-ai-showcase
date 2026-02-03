import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ServicesTable } from '@/components/dashboard/services-table'
import { ServiceDialog } from '@/components/dashboard/service-dialog'

// Forzar renderizado dinámico para evitar errores de prerendering con Supabase
export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch services
    const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true })

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Servicios y Precios</h1>
                    <p className="text-muted-foreground">Administra lo que ofreces a tus clientes.</p>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5">
                        <CardTitle>Catálogo de Servicios</CardTitle>
                        <CardDescription>Estos son los servicios visibles en el formulario de reserva.</CardDescription>
                    </div>
                    <ServiceDialog />
                </CardHeader>
                <CardContent>
                    <ServicesTable initialServices={services || []} />
                </CardContent>
            </Card>
        </div>
    )
}
