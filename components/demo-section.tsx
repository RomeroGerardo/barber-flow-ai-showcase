"use client";

import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Sparkles } from "lucide-react";
import { useState } from "react";

export function DemoSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl opacity-30" />
      
      <div className="max-w-4xl mx-auto relative z-10">
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

        {/* Video placeholder / Demo card */}
        <div
          className="relative group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated border glow */}
          <div 
            className={`absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-3xl blur-lg transition-all duration-500 ${
              isHovered ? "opacity-100" : "opacity-50"
            }`}
          />
          
          {/* Main card */}
          <div className="relative bg-card rounded-2xl overflow-hidden border border-primary/30">
            {/* Video thumbnail area */}
            <div className="aspect-video relative bg-gradient-to-br from-card via-background to-card">
              {/* Decorative grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
              
              {/* Central play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`relative transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"}`}>
                  {/* Pulsing ring */}
                  <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                  <div className="absolute -inset-2 bg-primary/30 rounded-full" />
                  
                  {/* Play button */}
                  <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/50">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>

              {/* Decorative UI elements */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              {/* Floating stats */}
              <div className="absolute top-6 right-6 bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border">
                <p className="text-xs text-muted-foreground">Citas hoy</p>
                <p className="text-2xl font-bold text-primary">24</p>
              </div>

              <div className="absolute bottom-6 left-6 bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border">
                <p className="text-xs text-muted-foreground">Reducción no-shows</p>
                <p className="text-2xl font-bold text-primary">-67%</p>
              </div>

              <div className="absolute bottom-6 right-6 bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border">
                <p className="text-xs text-muted-foreground">Tiempo ahorrado</p>
                <p className="text-2xl font-bold text-primary">4h/día</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90 px-8">
            <Play className="w-5 h-5 mr-2" />
            Ver Demo Completa
          </Button>
          <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 bg-transparent">
            <ExternalLink className="w-5 h-5 mr-2" />
            Probar Ahora
          </Button>
        </div>
      </div>
    </section>
  );
}
