"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    TrendingUp,
    TrendingDown,
    Calendar,
    Search,
    Receipt,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CashMovement {
    id: number;
    type: "income" | "expense";
    category: string;
    amount: number;
    description: string | null;
    movement_date: string;
    created_at: string;
}

interface CashMovementsListProps {
    initialMovements: CashMovement[];
}

const categoryLabels: Record<string, string> = {
    appointment: "Cita",
    tip: "Propina",
    product_sale: "Venta Producto",
    rent: "Alquiler",
    supplies: "Insumos",
    utilities: "Servicios",
    salary: "Salarios",
    marketing: "Marketing",
    maintenance: "Mantenimiento",
    other: "Otro",
};

export function CashMovementsList({ initialMovements }: CashMovementsListProps) {
    const [movements] = useState<CashMovement[]>(initialMovements);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

    const filteredMovements = movements.filter((movement) => {
        const matchesSearch = movement.description?.toLowerCase().includes(search.toLowerCase()) ||
            categoryLabels[movement.category]?.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === "all" || movement.type === typeFilter;
        const matchesDate = !dateFilter || movement.movement_date === dateFilter;
        return matchesSearch && matchesType && matchesDate;
    });

    const totalIncome = filteredMovements
        .filter(m => m.type === "income")
        .reduce((sum, m) => sum + m.amount, 0);

    const totalExpense = filteredMovements
        .filter(m => m.type === "expense")
        .reduce((sum, m) => sum + m.amount, 0);

    const balance = totalIncome - totalExpense;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <Card className="bg-green-500/10 border-green-500/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            <span className="text-sm text-muted-foreground">Ingresos</span>
                        </div>
                        <p className="text-2xl font-bold text-green-500 mt-2">
                            ${totalIncome.toFixed(0)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-red-500/10 border-red-500/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-muted-foreground">Gastos</span>
                        </div>
                        <p className="text-2xl font-bold text-red-500 mt-2">
                            ${totalExpense.toFixed(0)}
                        </p>
                    </CardContent>
                </Card>

                <Card className={balance >= 0
                    ? "bg-primary/10 border-primary/30"
                    : "bg-orange-500/10 border-orange-500/30"
                }>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            <span className="text-sm text-muted-foreground">Balance</span>
                        </div>
                        <p className={`text-2xl font-bold mt-2 ${balance >= 0 ? 'text-primary' : 'text-orange-500'}`}>
                            ${balance.toFixed(0)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Movimientos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar movimiento..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="income">Ingresos</SelectItem>
                                    <SelectItem value="expense">Gastos</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-[160px]"
                            />
                        </div>
                    </div>

                    {filteredMovements.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay movimientos para mostrar</p>
                            <p className="text-sm">Registra tu primer ingreso o gasto</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead className="text-right">Monto</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMovements.map((movement) => (
                                        <TableRow key={movement.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {movement.type === "income" ? (
                                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                                    )}
                                                    <Badge
                                                        className={movement.type === "income"
                                                            ? "bg-green-500/20 text-green-500 border-green-500/30"
                                                            : "bg-red-500/20 text-red-500 border-red-500/30"
                                                        }
                                                    >
                                                        {movement.type === "income" ? "Ingreso" : "Gasto"}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {categoryLabels[movement.category] || movement.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {movement.description || "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={`font-semibold ${movement.type === "income" ? 'text-green-500' : 'text-red-500'
                                                    }`}>
                                                    {movement.type === "income" ? '+' : '-'}${movement.amount.toFixed(0)}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
