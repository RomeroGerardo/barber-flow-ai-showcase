"use client";

import { MOCK_CLIENTS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Phone, History, Star } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground mt-1">CRM inteligente de tus clientes frecuentes.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Nuevo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Directorio de Clientes</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o teléfono..." className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
              <div className="col-span-4">Cliente</div>
              <div className="col-span-3 hidden sm:block">Contacto</div>
              <div className="col-span-2 hidden md:block">Última Visita</div>
              <div className="col-span-3">Preferencias AI</div>
            </div>
            
            <div className="divide-y divide-border">
              {MOCK_CLIENTS.map((client) => (
                <div key={client.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                  <div className="col-span-8 sm:col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <History className="w-3 h-3" /> {client.totalVisits} visitas
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-span-3 hidden sm:flex items-center text-sm text-muted-foreground">
                    <Phone className="w-3 h-3 mr-2" />
                    {client.phone}
                  </div>
                  
                  <div className="col-span-2 hidden md:block text-sm text-muted-foreground">
                    {client.lastVisit}
                  </div>
                  
                  <div className="col-span-4 sm:col-span-3 flex items-start sm:items-center justify-between gap-2">
                    <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md line-clamp-2">
                      {client.preferences}
                    </p>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
