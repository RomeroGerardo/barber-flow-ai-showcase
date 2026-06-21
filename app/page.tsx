import { HeroSection } from "@/components/hero-section";
import { ProblemSolution } from "@/components/problem-solution";
import { FeaturesGrid } from "@/components/features-grid";
import { TechStack } from "@/components/tech-stack";
import { DemoSection } from "@/components/demo-section";
import { PricingSection } from "@/components/pricing-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Ver Demo
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <HeroSection />
        <ProblemSolution />
        <FeaturesGrid />
        <DemoSection />
        <PricingSection />
        <TechStack />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo size="lg" />
            <p className="text-muted-foreground text-sm">
              Un proyecto de Romero Labs © 2026
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contacto
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacidad
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Términos
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
