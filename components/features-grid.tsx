"use client";

import { MessageCircle, Calendar, Bell, BarChart3 } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: MessageCircle,
      title: "Bot de WhatsApp",
      description: "Potenciado por Inteligencia Artificial para conversaciones naturales. Atiende a tus clientes 24/7 con respuestas inteligentes y personalizadas.",
      gradient: "from-green-500/20 to-emerald-500/10"
    },
    {
      icon: Calendar,
      title: "Calendario Inteligente",
      description: "Sistema de calendario integrado con Supabase. Gestiona disponibilidad automáticamente y evita doble reservas.",
      gradient: "from-blue-500/20 to-cyan-500/10"
    },
    {
      icon: Bell,
      title: "Recordatorios Automáticos",
      description: "Próximamente: Notificaciones por SMS y WhatsApp para reducir no-shows. Configura tiempos y mensajes personalizados.",
      gradient: "from-amber-500/20 to-orange-500/10"
    },
    {
      icon: BarChart3,
      title: "Panel de Analíticas",
      description: "Visualiza ingresos, horas pico y rendimiento. Toma decisiones basadas en datos reales de tu negocio.",
      gradient: "from-purple-500/20 to-violet-500/10"
    }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Características
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Herramientas poderosas diseñadas específicamente para barberías modernas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />

              {/* Card */}
              <div className="relative h-full bg-card/80 backdrop-blur-xl rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-50`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
