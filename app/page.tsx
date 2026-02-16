'use client'

import { BarberFlowLogo } from "@/components/barber-flow-logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth/auth-modal"
import {
  User,
  Scissors,
  CalendarClock,
  ShieldCheck,
  Sparkles
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header / Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <BarberFlowLogo className="w-24 h-24 relative z-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Barber<span className="text-primary">Flow</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            La experiencia premium para tu estilo. Gestiona tus citas o reserva al instante.
          </p>
        </div>

        {/* 3 Entry Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Option 1: Reserva Express (Guest) */}
          <Card className="group relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between gap-6 pt-10">
              <div className="p-4 rounded-full bg-primary/10 text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                <CalendarClock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Reserva Express</h3>
                <p className="text-sm text-muted-foreground">
                  ¿Tienes prisa? Agenda tu turno rápido sin crear cuenta.
                </p>
                <div className="text-xs font-medium text-amber-500 bg-amber-500/10 py-1 px-2 rounded-full inline-block mt-2">
                  Requiere pago 100% online
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => router.push('/reservar?mode=guest')}
              >
                Quiero un turno rápido
              </Button>
            </CardContent>
          </Card>

          {/* Option 2: Cliente Habitual (Auth) */}
          <Card className="group relative overflow-hidden border-teal-500/20 hover:border-teal-500/50 transition-all hover:shadow-lg hover:shadow-teal-500/10 bg-card/50 backdrop-blur-sm scale-105 z-10 shadow-xl">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-teal-500 to-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
              RECOMENDADO
            </div>
            <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between gap-6 pt-10 main-card-content">
              <div className="p-4 rounded-full bg-teal-500/10 text-teal-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-teal-500">Soy Cliente Habitual</h3>
                <p className="text-sm text-muted-foreground">
                  Accede a tu historial, suma puntos de fidelidad y paga en el local.
                </p>
                <div className="flex gap-2 justify-center mt-2">
                  <span className="text-[10px] bg-teal-500/10 text-teal-600 px-2 py-0.5 rounded-full border border-teal-500/20">Pago Flex</span>
                  <span className="text-[10px] bg-teal-500/10 text-teal-600 px-2 py-0.5 rounded-full border border-teal-500/20">Beneficios</span>
                </div>
              </div>

              <AuthModal>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" size="lg">
                  Ingresar / Registrarme
                </Button>
              </AuthModal>

            </CardContent>
          </Card>

          {/* Option 3: Barbero / Dueño (Admin) */}
          <Card className="group relative overflow-hidden border-slate-700 hover:border-slate-500 transition-all hover:bg-slate-900/5 bg-transparent">
            <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between gap-6 pt-10">
              <div className="p-4 rounded-full bg-slate-800 text-slate-400 mb-2 group-hover:text-white transition-colors duration-300">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Soy Barbero / Dueño</h3>
                <p className="text-sm text-muted-foreground">
                  Acceso administrativo para gestionar la agenda y el negocio.
                </p>
              </div>
              <Button variant="ghost" className="w-full border border-slate-700 hover:bg-slate-800 hover:text-white" onClick={() => router.push('/dashboard')}>
                Acceso Admin
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground pt-8">
          Powered by Romero Labs © 2026
        </p>

      </div>
    </main>
  )
}
