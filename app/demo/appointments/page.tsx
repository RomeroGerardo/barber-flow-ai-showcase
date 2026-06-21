"use client";

import { useState } from "react";
import { MOCK_APPOINTMENTS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Plus, Sparkles, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date>(new Date());
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground mt-1">Gestiona los turnos de tu barbería.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Que IA agende por mí
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Turno
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-primary/20 bg-primary/5 h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Calendario
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Simple static calendar mock for demo purposes */}
            <div className="bg-card p-4 rounded-xl border border-border">
              <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
                <span className="font-medium text-sm">Junio 2026</span>
                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {['L','M','X','J','V','S','D'].map(d => <div key={d} className="text-muted-foreground font-medium">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array.from({length: 30}).map((_, i) => (
                  <div key={i} className={`p-1.5 rounded-md cursor-pointer hover:bg-muted ${i+1 === 20 ? 'bg-primary text-primary-foreground font-bold' : ''}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Días con alta demanda</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span>Días con poca demanda</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Turnos del 20 Junio</CardTitle>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar..." className="pl-9 h-9" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {MOCK_APPOINTMENTS.map((apt) => (
                <div key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-3 w-32 shrink-0">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold text-lg">{apt.time}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base truncate">{apt.clientName}</p>
                    <p className="text-sm text-muted-foreground truncate">{apt.service} • Barbero: {apt.barber}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0 justify-between sm:justify-end">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      apt.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      apt.status === 'completed' ? 'bg-primary/10 text-primary border-primary/20' :
                      'bg-orange-500/10 text-orange-500 border-orange-500/20'
                    }`}>
                      {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </span>
                    <Button variant="secondary" size="sm" className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
