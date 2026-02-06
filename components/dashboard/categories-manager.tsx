"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Loader2,
    Tag,
    Trash2,
    Pencil,
} from "lucide-react";

interface Category {
    id: number;
    type: string;
    name: string;
    icon: string | null;
    color: string | null;
    is_active: boolean;
}

const categoryTypes = [
    { value: "product", label: "Productos" },
    { value: "expense", label: "Gastos" },
    { value: "income", label: "Ingresos" },
    { value: "service", label: "Servicios" },
];

const defaultColors = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"
];

export function CategoriesManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [selectedType, setSelectedType] = useState("product");
    const [formData, setFormData] = useState({
        name: "",
        color: "#3b82f6",
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("custom_categories")
            .select("*")
            .order("type")
            .order("display_order");

        if (!error && data) {
            setCategories(data);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return;
        setSaving(true);

        const supabase = createClient();

        if (editingCategory) {
            await supabase
                .from("custom_categories")
                .update({
                    name: formData.name,
                    color: formData.color,
                })
                .eq("id", editingCategory.id);
        } else {
            await supabase.from("custom_categories").insert({
                type: selectedType,
                name: formData.name,
                color: formData.color,
            });
        }

        setSaving(false);
        setDialogOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", color: "#3b82f6" });
        fetchCategories();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar esta categoría?")) return;

        const supabase = createClient();
        await supabase.from("custom_categories").delete().eq("id", id);
        fetchCategories();
    };

    const openEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            color: category.color || "#3b82f6",
        });
        setDialogOpen(true);
    };

    const openAdd = () => {
        setEditingCategory(null);
        setFormData({ name: "", color: "#3b82f6" });
        setDialogOpen(true);
    };

    const filteredCategories = categories.filter(c => c.type === selectedType);

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            Categorías
                        </CardTitle>
                        <CardDescription>
                            Gestiona las categorías personalizadas
                        </CardDescription>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={openAdd}>
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                {!editingCategory && (
                                    <div className="space-y-2">
                                        <Label>Tipo</Label>
                                        <Select value={selectedType} onValueChange={setSelectedType}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryTypes.map((t) => (
                                                    <SelectItem key={t.value} value={t.value}>
                                                        {t.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>Nombre</Label>
                                    <Input
                                        placeholder="Nombre de la categoría"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Color</Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {defaultColors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-white ring-2 ring-primary' : 'border-transparent'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setFormData({ ...formData, color })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleSave} disabled={saving || !formData.name.trim()}>
                                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    Guardar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {/* Type Filter */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {categoryTypes.map((t) => (
                        <Button
                            key={t.value}
                            variant={selectedType === t.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedType(t.value)}
                        >
                            {t.label}
                        </Button>
                    ))}
                </div>

                {/* Categories List */}
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No hay categorías de este tipo</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: category.color || "#3b82f6" }}
                                    />
                                    <span>{category.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEdit(category)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
