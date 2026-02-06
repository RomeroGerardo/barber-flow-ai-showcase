"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Upload, Trash2, User } from "lucide-react";

interface Client {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    avatar_url: string | null;
    notes: string | null;
}

interface EditClientDialogProps {
    client: Client;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClientUpdated?: () => void;
}

export function EditClientDialog({ client, open, onOpenChange, onClientUpdated }: EditClientDialogProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: client.name,
        phone: client.phone || "",
        email: client.email || "",
        avatar_url: client.avatar_url || "",
        notes: client.notes || "",
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const supabase = createClient();

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `client-${client.id}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });

        if (error) {
            console.error('Upload error:', error);
            alert('Error al subir imagen');
            setUploading(false);
            return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        setFormData({ ...formData, avatar_url: publicUrl });
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();

        const { error } = await supabase
            .from("clients")
            .update({
                name: formData.name,
                phone: formData.phone || null,
                email: formData.email || null,
                avatar_url: formData.avatar_url || null,
                notes: formData.notes || null,
            })
            .eq("id", client.id);

        setLoading(false);

        if (!error) {
            onOpenChange(false);
            onClientUpdated?.();
            window.location.reload();
        } else {
            alert("Error al actualizar cliente: " + error.message);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        const supabase = createClient();

        const { error } = await supabase
            .from("clients")
            .delete()
            .eq("id", client.id);

        setLoading(false);

        if (!error) {
            setShowDeleteDialog(false);
            onOpenChange(false);
            window.location.reload();
        } else {
            alert("Error al eliminar cliente: " + error.message);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Cliente</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                {formData.avatar_url ? (
                                    <img
                                        src={formData.avatar_url}
                                        alt={formData.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="h-8 w-8 text-primary" />
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="avatar" className="cursor-pointer">
                                    <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                                        <Upload className="h-4 w-4" />
                                        {formData.avatar_url ? "Cambiar foto" : "Subir foto"}
                                    </div>
                                </Label>
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Máx 2MB</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notas</Label>
                            <Textarea
                                id="notes"
                                placeholder="Preferencias, alergias, etc."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                                className="w-full sm:w-auto"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                            </Button>
                            <div className="flex gap-2 flex-1 justify-end">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading || !formData.name}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Guardar
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente a{" "}
                            <strong>{client.name}</strong> y su historial.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Sí, eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
