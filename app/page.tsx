import { HeroSection } from "@/components/hero-section";
import { ProblemSolution } from "@/components/problem-solution";
import { FeaturesGrid } from "@/components/features-grid";
import { TechStack } from "@/components/tech-stack";
import { DemoSection } from "@/components/demo-section";
import { BookingForm } from "@/components/booking-form";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ProblemSolution />
      <FeaturesGrid />
      <TechStack />
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Agenda tu Cita</h2>
          <p className="text-muted-foreground">Reserva tu turno en segundos. Sin llamadas ni esperas.</p>
        </div>
        <div className="flex justify-center">
          <BookingForm />
        </div>
      </section>
      <DemoSection />

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">B</span>
              </div>
              <span className="font-semibold text-foreground">BarberFlow AI</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Un proyecto de Romero Labs © 2026
            </p>
            <div className="flex gap-6">
              <Link href="/contacto" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contacto
              </Link>
              <Link href="/privacidad" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacidad
              </Link>
              <Link href="/terminos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

