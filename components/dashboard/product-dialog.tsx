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
import { Plus, Loader2, Package } from "lucide-react";

interface ProductDialogProps {
    product?: {
        id: number;
        name: string;
        description: string | null;
        cost_price: number;
        sale_price: number;
        stock: number;
        min_stock: number;
        category: string;
    };
    mode: "add" | "edit";
    trigger?: React.ReactNode;
    onProductSaved?: () => void;
}

const categories = [
    { value: "hair_product", label: "Producto Cabello" },
    { value: "beard_product", label: "Producto Barba" },
    { value: "tools", label: "Herramientas" },
    { value: "consumables", label: "Consumibles" },
    { value: "other", label: "Otro" },
];

export function ProductDialog({ product, mode, trigger, onProductSaved }: ProductDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        cost_price: product?.cost_price?.toString() || "",
        sale_price: product?.sale_price?.toString() || "",
        stock: product?.stock?.toString() || "0",
        min_stock: product?.min_stock?.toString() || "5",
        category: product?.category || "other",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();

        const productData = {
            name: formData.name,
            description: formData.description || null,
            cost_price: parseFloat(formData.cost_price) || 0,
            sale_price: parseFloat(formData.sale_price) || 0,
            stock: parseInt(formData.stock) || 0,
            min_stock: parseInt(formData.min_stock) || 5,
            category: formData.category,
        };

        let error;
        if (mode === "add") {
            const result = await supabase.from("products").insert(productData);
            error = result.error;
        } else {
            const result = await supabase.from("products").update(productData).eq("id", product!.id);
            error = result.error;
        }

        setLoading(false);

        if (!error) {
            setOpen(false);
            onProductSaved?.();
            window.location.reload();
        } else {
            alert("Error al guardar producto: " + error.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar Producto
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {mode === "add" ? "Nuevo Producto" : "Editar Producto"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                            id="name"
                            placeholder="Pomada para cabello"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cost_price">Precio Costo</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    id="cost_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="pl-8"
                                    value={formData.cost_price}
                                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sale_price">Precio Venta</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    id="sale_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="pl-8"
                                    value={formData.sale_price}
                                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Actual</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="min_stock">Stock Mínimo</Label>
                            <Input
                                id="min_stock"
                                type="number"
                                min="0"
                                value={formData.min_stock}
                                onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            placeholder="Descripción del producto..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !formData.name}>
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {mode === "add" ? "Agregar" : "Guardar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
