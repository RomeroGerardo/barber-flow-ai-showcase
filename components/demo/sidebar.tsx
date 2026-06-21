"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, Settings, LogOut, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const navigation = [
  { name: "Dashboard", href: "/demo", icon: LayoutDashboard },
  { name: "Agenda", href: "/demo/appointments", icon: Calendar },
  { name: "Simulador IA", href: "/demo/whatsapp", icon: MessageSquare, isHighlight: true },
  { name: "Clientes", href: "/demo/clients", icon: Users },
  { name: "Ajustes AI", href: "/demo/settings", icon: Settings },
];

export function DemoSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border h-full">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <Logo size="sm" showText={false} />
          <span className="font-semibold text-lg">BarberFlow AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isHighlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#00a884] text-white shadow-md"
                    : "text-muted-foreground hover:bg-[#00a884]/20 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground")} />
                {item.name}
              </Link>
            )
          }
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Salir de la Demo
        </Link>
      </div>
    </div>
  );
}
