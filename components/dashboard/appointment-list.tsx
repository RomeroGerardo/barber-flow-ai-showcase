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
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Loader2, CheckCircle2, XCircle, Clock, CheckSquare, Trash2 } from "lucide-react"

export type Appointment = {
    id: number
    created_at: string
    client_name: string
    client_phone: string | null
    client_email: string | null
    appointment_date: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    service_type: string | null
    notes: string | null
}

interface AppointmentListProps {
    initialAppointments: Appointment[]
}

export function AppointmentList({ initialAppointments }: AppointmentListProps) {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
    const [loadingId, setLoadingId] = useState<number | null>(null)
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [bulkDeleting, setBulkDeleting] = useState(false)
    const supabase = createClient()

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === appointments.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(appointments.map(a => a.id)))
        }
    }

    const deleteSelected = async () => {
        if (selectedIds.size === 0) return
        if (!confirm(`¿Eliminar ${selectedIds.size} cita(s)? Esta acción no se puede deshacer.`)) return

        setBulkDeleting(true)
        try {
            const { error } = await supabase
                .from('appointments')
                .delete()
                .in('id', Array.from(selectedIds))

            if (error) throw error

            setAppointments(prev => prev.filter(a => !selectedIds.has(a.id)))
            setSelectedIds(new Set())
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Error al eliminar las citas')
        } finally {
            setBulkDeleting(false)
        }
    }

    const updateStatus = async (id: number, newStatus: Appointment['status']) => {
        setLoadingId(id)
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) {
                throw error
            }

            setAppointments(prev =>
                prev.map(app => (app.id === id ? { ...app, status: newStatus } : app))
            )
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Error al actualizar el estado')
        } finally {
            setLoadingId(null)
        }
    }

    const deleteAppointment = async (id: number) => {
        if (!confirm('¿Eliminar esta cita? Esta acción no se puede deshacer.')) return

        setLoadingId(id)
        try {
            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', id)

            if (error) throw error

            setAppointments(prev => prev.filter(app => app.id !== id))
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Error al eliminar la cita')
        } finally {
            setLoadingId(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge variant="default" className="bg-green-600">Confirmada</Badge>
            case 'completed':
                return <Badge variant="secondary" className="bg-blue-600 text-white">Completada</Badge>
            case 'cancelled':
                return <Badge variant="destructive">Cancelada</Badge>
            default:
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pendiente</Badge>
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Citas Programadas</CardTitle>
                        <CardDescription>
                            Gestiona las próximas citas de tus clientes.
                        </CardDescription>
                    </div>
                    {selectedIds.size > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={deleteSelected}
                            disabled={bulkDeleting}
                        >
                            {bulkDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Eliminar ({selectedIds.size})
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={appointments.length > 0 && selectedIds.size === appointments.length}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Fecha y Hora</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Servicio</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Notas</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No hay citas programadas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                appointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.has(appointment.id)}
                                                onCheckedChange={() => toggleSelect(appointment.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {format(new Date(appointment.appointment_date), "dd/MM/yyyy HH:mm", { locale: es })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{appointment.client_name}</span>
                                                <span className="text-xs text-muted-foreground">{appointment.client_phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{appointment.service_type || '-'}</TableCell>
                                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={appointment.notes || ''}>
                                            {appointment.notes || '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {appointment.status === 'pending' && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => updateStatus(appointment.id, 'confirmed')}
                                                        disabled={loadingId === appointment.id}
                                                        title="Confirmar"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                )}
                                                {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => updateStatus(appointment.id, 'completed')}
                                                        disabled={loadingId === appointment.id}
                                                        title="Completar"
                                                    >
                                                        <CheckSquare className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                )}
                                                {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => updateStatus(appointment.id, 'cancelled')}
                                                        disabled={loadingId === appointment.id}
                                                        title="Cancelar"
                                                    >
                                                        <XCircle className="h-4 w-4 text-orange-500" />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => deleteAppointment(appointment.id)}
                                                    disabled={loadingId === appointment.id}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                                {loadingId === appointment.id && (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
