"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, CheckCircle2, Bell, User, ArrowRight, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

// Animation states for the chat flow
const chatMessages = [
  { type: "user", text: "Hola! Quiero reservar un corte para mañana", delay: 0 },
  { type: "ai", text: "¡Hola! 👋 Claro, tenemos horarios disponibles. ¿Prefieres mañana o tarde?", delay: 1500 },
  { type: "user", text: "Por la tarde, después de las 4pm", delay: 3500 },
  { type: "ai", text: "Perfecto! Tenemos 4:30pm y 5:15pm. ¿Cuál te queda mejor?", delay: 5000 },
  { type: "user", text: "4:30 está perfecto", delay: 7000 },
  { type: "ai", text: "✅ Listo! Tu cita está confirmada para mañana a las 4:30pm. Te enviaré un recordatorio.", delay: 8500 },
];

export function DemoSection() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [showNotification, setShowNotification] = useState(false);
  const [appointmentCount, setAppointmentCount] = useState(23);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    // Reset animation
    setVisibleMessages(0);
    setShowNotification(false);
    setAppointmentCount(23);

    const timers: NodeJS.Timeout[] = [];

    // Show messages progressively
    chatMessages.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleMessages(index + 1);

        // Show notification and update count when booking is confirmed
        if (index === chatMessages.length - 1) {
          setTimeout(() => {
            setShowNotification(true);
            setAppointmentCount(24);
          }, 500);
        }
      }, chatMessages[index].delay);
      timers.push(timer);
    });

    // Restart animation after completion
    const restartTimer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => setIsAnimating(true), 2000);
    }, 12000);
    timers.push(restartTimer);

    return () => timers.forEach(clearTimeout);
  }, [isAnimating]);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl opacity-30" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Demo Interactiva
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mira BarberFlow AI en Acción
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubre cómo la inteligencia artificial puede transformar la gestión de tu barbería
          </p>
        </div>

        {/* Interactive Demo - Split Screen */}
        <div className="relative group">
          {/* Animated border glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-3xl blur-lg opacity-50 group-hover:opacity-100 transition-all duration-500" />

          {/* Main container */}
          <div className="relative bg-card rounded-2xl overflow-hidden border border-primary/30">
            <div className="grid md:grid-cols-2 gap-0">

              {/* WhatsApp Chat Side */}
              <div className="bg-gradient-to-br from-[#075e54]/20 to-[#128c7e]/10 p-6 border-r border-border/50">
                {/* WhatsApp Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/30">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">BarberFlow AI</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      En línea
                    </p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-[300px] overflow-hidden space-y-3">
                  {chatMessages.slice(0, visibleMessages).map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-fadeInUp`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${message.type === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card/80 border border-border text-foreground rounded-bl-md"
                          }`}
                      >
                        {message.text}
                        <span className="text-[10px] opacity-60 ml-2">
                          {message.type === "user" ? "✓✓" : ""}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {visibleMessages > 0 && visibleMessages < chatMessages.length && visibleMessages % 2 === 1 && (
                    <div className="flex justify-start">
                      <div className="bg-card/80 border border-border px-4 py-3 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dashboard Side */}
              <div className="bg-gradient-to-br from-card via-background to-card p-6">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">Panel de Control</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border transition-all duration-500 ${showNotification ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}>
                    <p className="text-xs text-muted-foreground">Citas hoy</p>
                    <p className={`text-2xl font-bold transition-all duration-300 ${showNotification ? "text-primary scale-110" : "text-foreground"}`}>
                      {appointmentCount}
                    </p>
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground">Ingresos</p>
                    <p className="text-2xl font-bold text-foreground">$2,840</p>
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground">No-shows</p>
                    <p className="text-2xl font-bold text-green-400">-67%</p>
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground">Tiempo ahorrado</p>
                    <p className="text-2xl font-bold text-foreground">4h/día</p>
                  </div>
                </div>

                {/* Notification popup */}
                <div className={`transform transition-all duration-500 ${showNotification ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Nueva reserva confirmada</p>
                      <p className="text-xs text-muted-foreground">Mañana 4:30pm - Corte clásico</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                </div>

                {/* Mini calendar preview */}
                <div className="mt-4 bg-card/50 rounded-lg p-3 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">Próximas citas</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">10:00 - Carlos M.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">11:30 - Juan P.</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs transition-all duration-500 ${showNotification ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      <User className={`w-3 h-3 ${showNotification ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{showNotification ? "16:30 - Nueva reserva ✨" : "..."}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA button */}
        <div className="flex justify-center mt-10">
          <Link href="/dashboard">
            <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              Comenzar Ahora
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
