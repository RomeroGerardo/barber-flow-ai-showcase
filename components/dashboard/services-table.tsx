'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { ServiceDialog } from './service-dialog'
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Service = {
    id: number
    name: string
    price: number
    duration_minutes: number
    image_url: string | null
}

interface ServicesTableProps {
    initialServices: Service[]
}

export function ServicesTable({ initialServices }: ServicesTableProps) {
    const [services, setServices] = useState<Service[]>(initialServices)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const router = useRouter()
    const supabase = createClient()

    // Update local state when dialog saves success (optional if we rely purely on router.refresh)
    // For simplicity we rely on router.refresh() in the dialog, but we could also update state here.
    // Actually, router.refresh() re-renders the Server Component, but this is a Client Component.
    // We should probably pass the new data down or refetch. 
    // However, simpler approach: The Dialog calls router.refresh(), which updates the page props. 
    // Wait, initialServices won't update automatically in this client component unless the parent passes new props.
    // WE NEED: to listen to props updates.

    // Actually, better design: 
    // Let this component just receive props. When router.refresh() happens in Dialog, the parent (Server Component) re-renders, 
    // passing new initialServices to this component.
    // So we should sync state with props.
    if (initialServices !== services) {
        setServices(initialServices);
    }

    const handleDelete = async (id: number) => {
        setDeletingId(id)
        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id)

            if (error) throw error

            setServices(prev => prev.filter(s => s.id !== id))
            router.refresh()
        } catch (error) {
            console.error('Error deleting service:', error)
            alert('Error al eliminar el servicio')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {services.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                            No hay servicios registrados.
                        </TableCell>
                    </TableRow>
                ) : (
                    services.map((service) => (
                        <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell>{service.duration_minutes} min</TableCell>
                            <TableCell className="text-right">${service.price}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <ServiceDialog
                                    serviceToEdit={service}
                                    trigger={
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    }
                                />

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90">
                                            {deletingId === service.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Esto eliminará permanentemente el servicio "{service.name}".
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(service.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Eliminar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
