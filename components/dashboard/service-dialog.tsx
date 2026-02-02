'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Pencil } from "lucide-react"
import { useRouter } from 'next/navigation'

type Service = {
    id: number
    name: string
    price: number
    duration_minutes: number
    image_url?: string | null
}

interface ServiceDialogProps {
    serviceToEdit?: Service
    trigger?: React.ReactNode
    onSuccess?: () => void
}

export function ServiceDialog({ serviceToEdit, trigger, onSuccess }: ServiceDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            price: parseFloat(formData.get('price') as string),
            duration_minutes: parseInt(formData.get('duration') as string),
        }

        try {
            if (serviceToEdit) {
                const { error } = await supabase
                    .from('services')
                    .update(data)
                    .eq('id', serviceToEdit.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('services')
                    .insert([data])
                if (error) throw error
            }

            setOpen(false)
            router.refresh()
            if (onSuccess) onSuccess()
        } catch (error: any) {
            console.error('Error saving service:', error)
            alert(`Error al guardar el servicio: ${error.message || error.error_description || 'Desconocido'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Servicio
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{serviceToEdit ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
                    <DialogDescription>
                        {serviceToEdit ? 'Modifica los detalles del servicio.' : 'Agrega un nuevo servicio a tu catálogo.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={serviceToEdit?.name}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Precio ($)
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={serviceToEdit?.price}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration" className="text-right">
                                Duración (min)
                            </Label>
                            <Input
                                id="duration"
                                name="duration"
                                type="number"
                                defaultValue={serviceToEdit?.duration_minutes || 30}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
