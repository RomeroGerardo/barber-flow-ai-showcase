"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Phone, AlertTriangle, Zap } from "lucide-react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Appointment {
    id: number;
    client_name: string;
    client_phone: string | null;
    appointment_date: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    service_type: string | null;
}

interface UpcomingAppointmentsProps {
    appointments: Appointment[];
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
    // Filter upcoming appointments (not completed/cancelled) and take first 3
    const upcoming = appointments
        .filter((a) => a.status !== "completed" && a.status !== "cancelled")
        .slice(0, 3);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Confirmado</Badge>;
            case "pending":
                return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = parseISO(dateStr);
        if (isToday(date)) return "Hoy";
        if (isTomorrow(date)) return "Mañana";
        return format(date, "EEE d", { locale: es });
    };

    return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Próximas Citas
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {upcoming.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>No hay citas próximas</p>
                    </div>
                ) : (
                    upcoming.map((apt) => (
                        <div
                            key={apt.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors"
                        >
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <User className="h-6 w-6 text-primary" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-foreground truncate">
                                        {apt.client_name}
                                    </span>
                                    {getStatusBadge(apt.status)}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span className="font-medium text-primary">
                                        {formatDate(apt.appointment_date)} - {format(parseISO(apt.appointment_date), "HH:mm")}
                                    </span>
                                    {apt.service_type && (
                                        <>
                                            <span>•</span>
                                            <span>{apt.service_type}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            {apt.client_phone && (
                                <Button size="icon" variant="ghost" className="flex-shrink-0" asChild>
                                    <a href={`tel:${apt.client_phone}`}>
                                        <Phone className="h-4 w-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
