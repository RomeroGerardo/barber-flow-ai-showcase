"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { UserPlus, Loader2, Upload, User } from "lucide-react";

interface AddClientDialogProps {
    onClientAdded?: () => void;
}

export function AddClientDialog({ onClientAdded }: AddClientDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        avatar_url: "",
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const supabase = createClient();

        const fileExt = file.name.split('.').pop();
        const fileName = `client-new-${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });

        if (error) {
            console.error('Upload error:', error);
            alert('Error al subir imagen. Asegúrate de tener el bucket "avatars" creado en Supabase.');
            setUploading(false);
            return;
        }

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

        const { error } = await supabase.from("clients").insert({
            name: formData.name,
            phone: formData.phone || null,
            email: formData.email || null,
            avatar_url: formData.avatar_url || null,
        });

        setLoading(false);

        if (!error) {
            setFormData({ name: "", phone: "", email: "", avatar_url: "" });
            setOpen(false);
            onClientAdded?.();
            window.location.reload();
        } else {
            alert("Error al agregar cliente: " + error.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Agregar Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nuevo Cliente</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* Avatar Upload */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {formData.avatar_url ? (
                                <img
                                    src={formData.avatar_url}
                                    alt="Avatar"
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
                            <Label htmlFor="new-avatar" className="cursor-pointer">
                                <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                                    <Upload className="h-4 w-4" />
                                    Subir foto (opcional)
                                </div>
                            </Label>
                            <Input
                                id="new-avatar"
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
                            placeholder="Juan Pérez"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+54 9 351 123 4567"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="juan@ejemplo.com"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || uploading || !formData.name}>
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Agregar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

