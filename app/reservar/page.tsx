"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, CheckCircle2, ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

const SERVICES = [
  { id: "corte", name: "Corte de Cabello", duration: "45 min", price: "$15" },
  { id: "barba", name: "Perfilado de Barba", duration: "30 min", price: "$10" },
  { id: "completo", name: "Corte + Barba", duration: "1h 15m", price: "$22" },
];

const TIME_SLOTS = ["09:00", "10:00", "11:30", "15:00", "16:30", "18:00"];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 relative">
      {/* Estilos de fondo similares a la landing */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      <div className="fixed top-0 right-0 w-full p-4 flex justify-end z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Encabezado de la Barbería (Simulado) */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo size="lg" showText={false} className="justify-center" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Romero's Barbershop</h1>
          <p className="text-muted-foreground text-sm">Reserva tu turno en segundos</p>
        </div>

        <Card className="border-primary/20 shadow-xl bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              {step > 1 && step < 4 && (
                <Button variant="ghost" size="icon" className="w-8 h-8 -ml-2 text-muted-foreground" onClick={handleBack}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <div>
                <CardTitle>
                  {step === 1 && "1. Selecciona un Servicio"}
                  {step === 2 && "2. Elige Fecha y Hora"}
                  {step === 3 && "3. Tus Datos"}
                  {step === 4 && "¡Reserva Confirmada!"}
                </CardTitle>
                <CardDescription>
                  {step === 4 ? "Te esperamos en la barbería." : "Sigue los pasos para agendar."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* PASO 1: Servicios */}
            {step === 1 && (
              <div className="space-y-3">
                {SERVICES.map((service) => (
                  <div 
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedService === service.id 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50 bg-background/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedService === service.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <Scissors className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.duration}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-primary">{service.price}</span>
                  </div>
                ))}
              </div>
            )}

            {/* PASO 2: Fecha y Hora */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex justify-center bg-background/50 rounded-xl p-2 border border-border">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </div>
                
                <div>
                  <Label className="mb-3 block text-muted-foreground">Horarios disponibles</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`w-full ${selectedTime === time ? "shadow-md shadow-primary/30" : "bg-background/50"}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: Datos */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" placeholder="Ej. Juan Pérez" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (WhatsApp)</Label>
                  <Input id="phone" placeholder="Ej. +54 9 11 1234-5678" type="tel" className="bg-background/50" />
                </div>
                <div className="p-4 bg-muted/30 rounded-xl border border-border mt-4">
                  <h4 className="text-sm font-medium mb-2">Resumen de tu turno:</h4>
                  <p className="text-sm text-muted-foreground">Servicio: {SERVICES.find(s => s.id === selectedService)?.name}</p>
                  <p className="text-sm text-muted-foreground">Fecha: {date?.toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Hora: {selectedTime}</p>
                </div>
              </div>
            )}

            {/* PASO 4: Confirmación */}
            {step === 4 && (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">¡Todo listo!</h3>
                <p className="text-muted-foreground text-sm max-w-[250px]">
                  Te hemos enviado un mensaje por WhatsApp con los detalles de tu turno.
                </p>
                <div className="pt-4">
                  <Button asChild variant="outline">
                    <Link href="/">Volver a BarberFlow AI</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          {step < 4 && (
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleNext}
                disabled={
                  (step === 1 && !selectedService) || 
                  (step === 2 && (!date || !selectedTime))
                }
              >
                {step === 3 ? "Confirmar Turno" : "Continuar"}
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {/* Watermark simulado */}
        <div className="mt-8 text-center flex items-center justify-center">
           <p className="text-xs text-muted-foreground opacity-50 flex items-center gap-1.5">
             Powered by <Logo size="sm" showText={false} className="scale-[0.4] -mx-2 opacity-50 grayscale" /> BarberFlow AI
           </p>
        </div>
      </div>
    </div>
  );
}
