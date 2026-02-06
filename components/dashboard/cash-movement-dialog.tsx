"use client";

import { useState, useId } from "react";
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
import { Plus, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

interface CashMovementDialogProps {
    defaultType?: "income" | "expense";
    onMovementAdded?: () => void;
}

const incomeCategories = [
    { value: "appointment", label: "Cita" },
    { value: "tip", label: "Propina" },
    { value: "product_sale", label: "Venta de Producto" },
    { value: "other", label: "Otro" },
];

const expenseCategories = [
    { value: "rent", label: "Alquiler" },
    { value: "supplies", label: "Insumos" },
    { value: "utilities", label: "Servicios (luz, agua, etc)" },
    { value: "salary", label: "Salarios" },
    { value: "marketing", label: "Marketing/Publicidad" },
    { value: "maintenance", label: "Mantenimiento" },
    { value: "other", label: "Otro" },
];

export function CashMovementDialog({ defaultType = "income", onMovementAdded }: CashMovementDialogProps) {
    const dialogId = useId();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: defaultType,
        category: "",
        amount: "",
        description: "",
        movement_date: new Date().toISOString().split('T')[0],
    });

    const categories = formData.type === "income" ? incomeCategories : expenseCategories;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();

        const { error } = await supabase.from("cash_movements").insert({
            type: formData.type,
            category: formData.category,
            amount: parseFloat(formData.amount),
            description: formData.description || null,
            movement_date: formData.movement_date,
        });

        setLoading(false);

        if (!error) {
            setFormData({
                type: defaultType,
                category: "",
                amount: "",
                description: "",
                movement_date: new Date().toISOString().split('T')[0],
            });
            setOpen(false);
            onMovementAdded?.();
            window.location.reload();
        } else {
            alert("Error al registrar movimiento: " + error.message);
        }
    };

    const isIncome = formData.type === "income";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="gap-2"
                    variant={isIncome ? "default" : "destructive"}
                    id={`trigger-${dialogId}`}
                >
                    {isIncome ? (
                        <>
                            <TrendingUp className="h-4 w-4" />
                            Agregar Ingreso
                        </>
                    ) : (
                        <>
                            <TrendingDown className="h-4 w-4" />
                            Agregar Gasto
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isIncome ? (
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                            <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        {isIncome ? "Nuevo Ingreso" : "Nuevo Gasto"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* Type Toggle */}
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={formData.type === "income" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                        >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Ingreso
                        </Button>
                        <Button
                            type="button"
                            variant={formData.type === "expense" ? "destructive" : "outline"}
                            className="flex-1"
                            onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                        >
                            <TrendingDown className="h-4 w-4 mr-2" />
                            Gasto
                        </Button>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">Monto *</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                className="pl-8"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Categoría *</Label>
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

                    {/* Date */}
                    <div className="space-y-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.movement_date}
                            onChange={(e) => setFormData({ ...formData, movement_date: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            placeholder="Descripción del movimiento..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.amount || !formData.category}
                            variant={isIncome ? "default" : "destructive"}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Registrar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
