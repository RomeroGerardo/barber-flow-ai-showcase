"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Bell,
    Calendar,
    AlertTriangle,
    Package,
    X,
    Check,
    Clock,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Notification {
    id: string;
    type: "appointment" | "low_stock" | "no_show" | "reminder";
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    link?: string;
}

interface NotificationsPanelProps {
    appointments?: Array<{
        id: number;
        client_name: string;
        date: string;
        time: string;
    }>;
    lowStockProducts?: Array<{
        id: number;
        name: string;
        stock: number;
    }>;
}

export function NotificationsPanel({ appointments = [], lowStockProducts = [] }: NotificationsPanelProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Generate notifications from props
    useEffect(() => {
        const newNotifications: Notification[] = [];

        // Add upcoming appointment notifications (within next 2 hours)
        const now = new Date();
        appointments.forEach((apt) => {
            const aptDate = new Date(`${apt.date}T${apt.time}`);
            const diffHours = (aptDate.getTime() - now.getTime()) / (1000 * 60 * 60);

            if (diffHours > 0 && diffHours <= 2) {
                newNotifications.push({
                    id: `apt-${apt.id}`,
                    type: "appointment",
                    title: "Cita próxima",
                    message: `${apt.client_name} a las ${apt.time}`,
                    timestamp: aptDate,
                    read: false,
                    link: "/dashboard/agenda",
                });
            }
        });

        // Add low stock notifications
        lowStockProducts.forEach((product) => {
            newNotifications.push({
                id: `stock-${product.id}`,
                type: "low_stock",
                title: "Stock bajo",
                message: `${product.name}: ${product.stock} unidades`,
                timestamp: new Date(),
                read: false,
                link: "/dashboard/inventario",
            });
        });

        setNotifications(newNotifications);
    }, [appointments, lowStockProducts]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "appointment":
                return <Calendar className="h-4 w-4 text-blue-500" />;
            case "low_stock":
                return <Package className="h-4 w-4 text-orange-500" />;
            case "no_show":
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case "reminder":
                return <Clock className="h-4 w-4 text-purple-500" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <Card className="absolute right-0 top-12 w-80 z-50 shadow-lg">
                    <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                                <Check className="h-4 w-4 mr-1" />
                                Marcar todo
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        {notifications.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No hay notificaciones</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-64">
                                <div className="divide-y">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-3 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5' : ''
                                                }`}
                                            onClick={() => {
                                                markAsRead(notification.id);
                                                if (notification.link) {
                                                    window.location.href = notification.link;
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium truncate">
                                                            {notification.title}
                                                        </p>
                                                        {!notification.read && (
                                                            <Badge className="h-2 w-2 p-0 rounded-full bg-primary" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
