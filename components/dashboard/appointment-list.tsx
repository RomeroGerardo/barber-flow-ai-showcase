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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Loader2, CheckCircle2, XCircle, Clock, CheckSquare } from "lucide-react"

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
    const supabase = createClient()

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
                <CardTitle>Citas Programadas</CardTitle>
                <CardDescription>
                    Gestiona las próximas citas de tus clientes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
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
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No hay citas programadas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                appointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
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
                                            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                                <div className="flex justify-end gap-2">
                                                    {appointment.status === 'pending' && (
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
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
                                                            variant="outline"
                                                            onClick={() => updateStatus(appointment.id, 'completed')}
                                                            disabled={loadingId === appointment.id}
                                                            title="Completar"
                                                        >
                                                            <CheckSquare className="h-4 w-4 text-blue-600" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={() => updateStatus(appointment.id, 'cancelled')}
                                                        disabled={loadingId === appointment.id}
                                                        title="Cancelar"
                                                    >
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            )}
                                            {loadingId === appointment.id && (
                                                <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                                            )}
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
