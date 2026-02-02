"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Potenciado por IA</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              <span className="text-foreground">BarberFlow AI:</span>{" "}
              <span className="text-primary">Gestión de Citas con Inteligencia Artificial</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Automatización total para barberías: desde el primer mensaje en WhatsApp hasta el recordatorio de la cita.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/dashboard">
                <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 bg-transparent">
                Ver Demo
              </Button>
            </div>
          </div>

          {/* Right visual - Phone mockups */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* WhatsApp Phone */}
              <div className="relative z-10 bg-card rounded-3xl p-2 shadow-2xl shadow-primary/20 border border-primary/20 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="w-56 md:w-64 h-[400px] md:h-[480px] bg-background rounded-2xl overflow-hidden">
                  {/* Phone header */}
                  <div className="bg-[#128C7E] p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">BarberFlow Bot</p>
                      <p className="text-xs text-foreground/70">En línea</p>
                    </div>
                  </div>
                  {/* Chat messages */}
                  <div className="p-3 space-y-3 bg-[#0B141A]">
                    <div className="bg-[#202C33] rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm text-foreground">¡Hola! 👋 Soy el asistente de BarberFlow. ¿En qué puedo ayudarte?</p>
                    </div>
                    <div className="bg-[#005C4B] rounded-lg p-3 max-w-[80%] ml-auto">
                      <p className="text-sm text-foreground">Quiero agendar un corte para mañana</p>
                    </div>
                    <div className="bg-[#202C33] rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm text-foreground">¡Perfecto! 📅 Tenemos disponibilidad a las 10:00, 14:00 y 17:00. ¿Cuál prefieres?</p>
                    </div>
                    <div className="bg-[#005C4B] rounded-lg p-3 max-w-[80%] ml-auto">
                      <p className="text-sm text-foreground">Las 14:00 está bien</p>
                    </div>
                    <div className="bg-[#202C33] rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm text-foreground">✅ ¡Listo! Tu cita está confirmada para mañana a las 14:00. Te enviaré un recordatorio.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Dashboard Phone */}
              <div className="absolute top-10 -right-20 md:-right-32 z-20 bg-card rounded-3xl p-2 shadow-2xl shadow-primary/20 border border-primary/20 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="w-56 md:w-64 h-[400px] md:h-[480px] bg-background rounded-2xl overflow-hidden">
                  {/* Dashboard header */}
                  <div className="bg-card p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">Dashboard</span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  </div>
                  {/* Mini calendar */}
                  <div className="p-4 space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Enero 2026</p>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
                        <div key={day} className="text-muted-foreground py-1">{day}</div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => (
                        <div
                          key={i}
                          className={`py-1 rounded text-foreground ${[5, 12, 19, 26].includes(i + 1)
                            ? "bg-primary text-primary-foreground"
                            : [8, 15, 22].includes(i + 1)
                              ? "bg-primary/20"
                              : ""
                            }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    {/* Upcoming appointments */}
                    <div className="space-y-2 pt-4 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground">Próximas citas</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-foreground">Carlos M.</p>
                            <p className="text-xs text-muted-foreground">10:00 - Corte</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-foreground">Miguel R.</p>
                            <p className="text-xs text-muted-foreground">11:30 - Barba</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
