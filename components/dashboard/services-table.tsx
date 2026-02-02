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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner' // Asumiendo que usas sonner o similar para notificaciones

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
    const supabase = createClient()
    const queryClient = useQueryClient()
    const router = useRouter() // Mantenemos router para sincronizar servidor si es necesario
    const [deletingId, setDeletingId] = useState<number | null>(null) // Mantenemos estado local solo para UI inmediata si mutation.isPending no es suficiente granularidad por fila

    // 1. Fetcher para React Query
    const fetchServices = async () => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('name', { ascending: true })
        if (error) throw error
        return data as Service[]
    }

    // 2. useQuery hook
    const { data: services, isLoading, isError } = useQuery({
        queryKey: ['services'],
        queryFn: fetchServices,
        initialData: initialServices, // Hidratación con datos del servidor
    })

    // 3. Mutation para Eliminar
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from('services').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            toast.success("Servicio eliminado correctamente")
            queryClient.invalidateQueries({ queryKey: ['services'] })
            router.refresh() // Refrescar componentes de servidor también por si acaso
        },
        onError: (error) => {
            console.error('Error deleting service:', error)
            toast.error("Error al eliminar el servicio")
        }
    })

    const handleDelete = async (id: number) => {
        setDeletingId(id)
        try {
            await deleteMutation.mutateAsync(id)
        } finally {
            setDeletingId(null)
        }
    }

    if (isLoading) return <div className="p-4 text-center">Cargando servicios...</div>
    if (isError) return <div className="p-4 text-center text-red-500">Error al cargar servicios.</div>

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
                {services && services.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                            No hay servicios registrados.
                        </TableCell>
                    </TableRow>
                ) : (
                    services?.map((service) => (
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
                                            {deletingId === service.id || (deleteMutation.isPending && deletingId === service.id) ?
                                                <Loader2 className="h-4 w-4 animate-spin" /> :
                                                <Trash2 className="h-4 w-4" />
                                            }
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
                                            <AlertDialogAction
                                                onClick={(e) => {
                                                    e.preventDefault(); // Evitar cierre inmediato si queremos esperar
                                                    handleDelete(service.id)
                                                }}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                disabled={deleteMutation.isPending}
                                            >
                                                {deleteMutation.isPending && deletingId === service.id ? "Eliminando..." : "Eliminar"}
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
