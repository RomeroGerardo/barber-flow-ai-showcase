"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_METRICS, MOCK_APPOINTMENTS } from "@/lib/mock-data";
import { Clock, TrendingUp, CalendarCheck, CalendarX2, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "09:00", citas: 1 },
  { time: "10:00", citas: 2 },
  { time: "11:00", citas: 1 },
  { time: "12:00", citas: 4 },
  { time: "13:00", citas: 2 },
  { time: "14:00", citas: 3 },
  { time: "15:00", citas: 5 },
  { time: "16:00", citas: 2 },
  { time: "17:00", citas: 4 },
];

export default function DemoDashboard() {
  const todayAppointments = MOCK_APPOINTMENTS.filter(a => a.date === "Hoy");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resumen de Hoy</h1>
        <p className="text-muted-foreground mt-1">
          Así es como BarberFlow AI está simplificando tu día.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Ahorrado</CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{MOCK_METRICS.hoursSavedByAI}</div>
            <p className="text-xs text-muted-foreground mt-1">Gestionando chats y agenda</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <CalendarCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_METRICS.appointmentsToday}</div>
            <p className="text-xs text-muted-foreground mt-1">+2 confirmadas por IA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Estimados</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${MOCK_METRICS.revenueToday}</div>
            <p className="text-xs text-muted-foreground mt-1">+15% respecto a ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">No-Shows Evitados</CardTitle>
            <CalendarX2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_METRICS.noShowsPrevented}</div>
            <p className="text-xs text-muted-foreground mt-1">Gracias a recordatorios auto</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Actividad del Día</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="citas" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.slice(0, 4).map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                  <div className="w-12 text-center">
                    <span className="text-sm font-bold text-primary">{appointment.time}</span>
                  </div>
                  <div className="w-px h-10 bg-border"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{appointment.clientName}</p>
                    <p className="text-xs text-muted-foreground">{appointment.service} • {appointment.barber}</p>
                  </div>
                  {appointment.status === "confirmed" && (
                    <div className="bg-primary/20 p-1.5 rounded-full" title="Confirmada por IA">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
