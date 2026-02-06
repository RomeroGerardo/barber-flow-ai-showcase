"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Search,
    User,
    Phone,
    Mail,
    Star,
    AlertTriangle,
    DollarSign,
    Calendar,
    Crown,
    Eye,
    Pencil,
    MessageCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EditClientDialog } from "@/components/dashboard/edit-client-dialog";
import { WhatsAppDialog } from "@/components/dashboard/whatsapp-dialog";

interface Client {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    avatar_url: string | null;
    total_visits: number;
    total_spent: number;
    loyalty_points: number;
    no_show_count: number;
    last_visit: string | null;
    notes: string | null;
    created_at: string;
}

interface ClientsListProps {
    initialClients: Client[];
}

export function ClientsList({ initialClients }: ClientsListProps) {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [search, setSearch] = useState("");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const filteredClients = clients.filter(
        (client) =>
            client.name.toLowerCase().includes(search.toLowerCase()) ||
            client.phone?.includes(search) ||
            client.email?.toLowerCase().includes(search.toLowerCase())
    );

    const getLoyaltyBadge = (points: number) => {
        if (points >= 50) return { label: "VIP Platinum", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: "💎" };
        if (points >= 30) return { label: "VIP Gold", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30", icon: "🥇" };
        if (points >= 20) return { label: "VIP Silver", color: "bg-slate-400/20 text-slate-300 border-slate-400/30", icon: "🥈" };
        if (points >= 10) return { label: "VIP Bronze", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: "🥉" };
        if (points >= 5) return { label: "Frecuente", color: "bg-blue-500/20 text-blue-500 border-blue-500/30", icon: "⭐" };
        return { label: "Nuevo", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: "" };
    };

    const getNextMilestone = (points: number) => {
        if (points >= 50) return { next: null, remaining: 0, label: "¡Nivel máximo alcanzado!" };
        if (points >= 30) return { next: 50, remaining: 50 - points, label: "VIP Platinum" };
        if (points >= 20) return { next: 30, remaining: 30 - points, label: "VIP Gold" };
        if (points >= 10) return { next: 20, remaining: 20 - points, label: "VIP Silver" };
        if (points >= 5) return { next: 10, remaining: 10 - points, label: "VIP Bronze" };
        return { next: 5, remaining: 5 - points, label: "Frecuente" };
    };

    const getNoShowBadge = (count: number) => {
        if (count >= 3) return { label: `${count} ausencias`, color: "bg-red-500/20 text-red-500 border-red-500/30" };
        if (count >= 1) return { label: `${count} ausencia${count > 1 ? 's' : ''}`, color: "bg-orange-500/20 text-orange-500 border-orange-500/30" };
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Clientes ({filteredClients.length})
                    </CardTitle>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar cliente..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {filteredClients.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No se encontraron clientes</p>
                        {search && <p className="text-sm mt-1">Intenta con otra búsqueda</p>}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Contacto</TableHead>
                                    <TableHead className="text-center">Visitas</TableHead>
                                    <TableHead className="text-center">Gastado</TableHead>
                                    <TableHead className="text-center">Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((client) => {
                                    const loyalty = getLoyaltyBadge(client.loyalty_points);
                                    const noShow = getNoShowBadge(client.no_show_count);

                                    return (
                                        <TableRow key={client.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {client.avatar_url ? (
                                                        <img
                                                            src={client.avatar_url}
                                                            alt={client.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                            {loyalty.label.includes("VIP") ? (
                                                                <Crown className="h-5 w-5 text-yellow-500" />
                                                            ) : (
                                                                <User className="h-5 w-5 text-primary" />
                                                            )}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{client.name}</p>
                                                        {client.last_visit && (
                                                            <p className="text-xs text-muted-foreground">
                                                                Última visita: {format(new Date(client.last_visit), "d MMM", { locale: es })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {client.phone && (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Phone className="h-3 w-3" />
                                                            {client.phone}
                                                        </div>
                                                    )}
                                                    {client.email && (
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Mail className="h-3 w-3" />
                                                            {client.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="font-semibold">{client.total_visits}</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="font-semibold text-green-500">${client.total_spent.toFixed(0)}</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <Badge className={loyalty.color}>{loyalty.label}</Badge>
                                                    {noShow && (
                                                        <Badge className={noShow.color}>
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            {noShow.label}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {client.phone && (
                                                        <WhatsAppDialog
                                                            phone={client.phone}
                                                            clientName={client.name}
                                                            trigger={
                                                                <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
                                                                    <MessageCircle className="h-4 w-4" />
                                                                </Button>
                                                            }
                                                        />
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditingClient(client)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setSelectedClient(client)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle className="flex items-center gap-3">
                                                                    {client.avatar_url ? (
                                                                        <img
                                                                            src={client.avatar_url}
                                                                            alt={client.name}
                                                                            className="w-12 h-12 rounded-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                                                            <User className="h-6 w-6 text-primary" />
                                                                        </div>
                                                                    )}
                                                                    {client.name}
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 pt-4">
                                                                {/* Contact Info */}
                                                                <div className="space-y-2">
                                                                    {client.phone && (
                                                                        <div className="flex items-center gap-2 text-sm">
                                                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                                                            <a href={`tel:${client.phone}`} className="hover:text-primary">
                                                                                {client.phone}
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                    {client.email && (
                                                                        <div className="flex items-center gap-2 text-sm">
                                                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                                                            <a href={`mailto:${client.email}`} className="hover:text-primary">
                                                                                {client.email}
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Stats Grid */}
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                                                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                                                            <Calendar className="h-3 w-3" />
                                                                            Visitas Totales
                                                                        </div>
                                                                        <p className="text-xl font-bold">{client.total_visits}</p>
                                                                    </div>
                                                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                                                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                                                            <DollarSign className="h-3 w-3" />
                                                                            Total Gastado
                                                                        </div>
                                                                        <p className="text-xl font-bold text-green-500">${client.total_spent.toFixed(0)}</p>
                                                                    </div>
                                                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                                                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                                                            <Star className="h-3 w-3" />
                                                                            Puntos de Lealtad
                                                                        </div>
                                                                        <p className="text-xl font-bold">{client.loyalty_points}</p>
                                                                    </div>
                                                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                                                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                                                            <AlertTriangle className="h-3 w-3" />
                                                                            Ausencias
                                                                        </div>
                                                                        <p className={`text-xl font-bold ${client.no_show_count >= 3 ? 'text-red-500' : ''}`}>
                                                                            {client.no_show_count}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Loyalty Progress */}
                                                                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-sm font-medium">Nivel de Lealtad</span>
                                                                        <Badge className={getLoyaltyBadge(client.loyalty_points).color}>
                                                                            {getLoyaltyBadge(client.loyalty_points).icon} {getLoyaltyBadge(client.loyalty_points).label}
                                                                        </Badge>
                                                                    </div>

                                                                    {/* Tier Progress */}
                                                                    <div className="space-y-2 mt-3">
                                                                        <div className="flex justify-between text-xs">
                                                                            <span className="text-muted-foreground">
                                                                                {client.loyalty_points} visitas
                                                                            </span>
                                                                            <span className="text-muted-foreground">
                                                                                {getNextMilestone(client.loyalty_points).next
                                                                                    ? `Próximo: ${getNextMilestone(client.loyalty_points).label}`
                                                                                    : "Nivel máximo"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                                                            <div
                                                                                className="h-full bg-primary transition-all duration-500"
                                                                                style={{
                                                                                    width: getNextMilestone(client.loyalty_points).next
                                                                                        ? `${((client.loyalty_points % 10) / 10) * 100}%`
                                                                                        : '100%'
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <p className="text-xs text-muted-foreground mt-2">
                                                                        {getNextMilestone(client.loyalty_points).next
                                                                            ? `${getNextMilestone(client.loyalty_points).remaining} visitas más para ${getNextMilestone(client.loyalty_points).label}`
                                                                            : "💎 ¡Nivel máximo! Cliente preferencial"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            {/* Edit Client Dialog */}
            {editingClient && (
                <EditClientDialog
                    client={editingClient}
                    open={!!editingClient}
                    onOpenChange={(open) => !open && setEditingClient(null)}
                />
            )}
        </Card>
    );
}

