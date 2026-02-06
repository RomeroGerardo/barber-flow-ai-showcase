"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarberFlowLogo } from "@/components/barber-flow-logo";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Scissors,
    Settings,
    LogOut,
    Menu,
    X,
    Wallet,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Agenda",
        href: "/dashboard/agenda",
        icon: Calendar,
    },
    {
        title: "Clientes",
        href: "/dashboard/clients",
        icon: Users,
    },
    {
        title: "Caja",
        href: "/dashboard/caja",
        icon: Wallet,
    },
    {
        title: "Inventario",
        href: "/dashboard/inventario",
        icon: Package,
    },
    {
        title: "Servicios",
        href: "/dashboard/services",
        icon: Scissors,
    },
    {
        title: "Configuración",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile toggle button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out",
                    "md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
                        <BarberFlowLogo className="w-10 h-10" />
                        <span className="font-semibold text-lg">BarberFlow</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="px-4 py-6 border-t border-border">
                        <form action="/api/auth/signout" method="POST">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                                type="submit"
                            >
                                <LogOut className="h-5 w-5" />
                                Cerrar Sesión
                            </Button>
                        </form>
                    </div>
                </div>
            </aside>
        </>
    );
}
