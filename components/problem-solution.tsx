"use client";

import { XCircle, CheckCircle, Clock, UserX, CalendarX, Bot, Bell, LayoutDashboard } from "lucide-react";

export function ProblemSolution() {
  const problems = [
    {
      icon: Clock,
      title: "Reservas Manuales",
      description: "Perder tiempo contestando llamadas y mensajes para agendar citas."
    },
    {
      icon: UserX,
      title: "No-Shows",
      description: "Clientes que no se presentan sin avisar, perdiendo dinero."
    },
    {
      icon: CalendarX,
      title: "Tiempo Perdido",
      description: "Horas vacías que podrían haberse llenado con otros clientes."
    }
  ];

  const solutions = [
    {
      icon: Bot,
      title: "Bot de IA 24/7",
      description: "Atiende clientes automáticamente a cualquier hora del día."
    },
    {
      icon: Bell,
      title: "Recordatorios Automáticos",
      description: "Reduce no-shows con notificaciones inteligentes."
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard Inteligente",
      description: "Visualiza y gestiona todas tus citas en un solo lugar."
    }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Transforma tu Barbería
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            De la gestión manual al control total automatizado
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Problem Side */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-destructive/20 to-transparent rounded-3xl blur-xl opacity-50" />
            <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-destructive/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-full bg-destructive/10">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">El Problema</h3>
              </div>
              
              <div className="space-y-6">
                {problems.map((problem, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                      <problem.icon className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{problem.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Solution Side */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-xl opacity-50" />
            <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/20 shadow-lg shadow-primary/10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-full bg-primary/10">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">La Solución</h3>
              </div>
              
              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <solution.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{solution.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{solution.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
