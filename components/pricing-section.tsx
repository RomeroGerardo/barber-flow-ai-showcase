import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Planes Simples y Transparentes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tu barbería y empieza a ahorrar tiempo hoy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Básico */}
          <div className="bg-card border border-border rounded-3xl p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Básico</h3>
            <p className="text-muted-foreground mb-6">Para barberos independientes</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>1 Barbero</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Gestión de citas básica</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Recordatorios por email</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline">Comenzar</Button>
          </div>

          {/* Pro */}
          <div className="bg-card border-2 border-primary rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-xl shadow-primary/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
              Más Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-muted-foreground mb-6">El poder completo de la IA</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$79</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Hasta 5 Barberos</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Asistente IA en WhatsApp</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Recordatorios automáticos</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Analíticas avanzadas</span>
              </li>
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Comenzar Prueba Gratis
            </Button>
          </div>

          {/* Enterprise */}
          <div className="bg-card border border-border rounded-3xl p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Cadena</h3>
            <p className="text-muted-foreground mb-6">Múltiples sucursales</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$199</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Barberos ilimitados</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Gestión multi-sucursal</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Soporte prioritario 24/7</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline">Contactar Ventas</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
