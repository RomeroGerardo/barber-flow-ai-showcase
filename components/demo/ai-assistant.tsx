"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
  action?: "calendar" | "booking_success";
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "¡Hola! Soy el asistente IA de BarberFlow. ¿Quieres ver cómo ayudo a gestionar tu barbería? Prueba decirme 'agendar un turno' o 'ver mi agenda'.", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiMsg: Message = { id: Date.now() + 1, text: "No entendí muy bien. Prueba diciendo 'agendar un turno'.", sender: "ai" };
      
      const lowerInput = userMsg.text.toLowerCase();
      if (lowerInput.includes("agendar") || lowerInput.includes("turno")) {
        aiMsg = { 
          id: Date.now() + 1, 
          text: "¡Perfecto! Acabo de procesar un mensaje de WhatsApp de 'Juan Pérez' pidiendo un corte para mañana a las 15:00. He reservado el espacio en tu calendario y le he enviado la confirmación automáticamente.", 
          sender: "ai",
          action: "booking_success"
        };
      } else if (lowerInput.includes("agenda") || lowerInput.includes("calendario")) {
        aiMsg = { 
          id: Date.now() + 1, 
          text: "Tienes 12 turnos agendados para hoy. El próximo es a las 14:00 con Javier Silva (Perfilado de Barba). Tienes un hueco libre a las 16:30, ¿quieres que envíe una promoción por WhatsApp a clientes frecuentes?", 
          sender: "ai",
          action: "calendar"
        };
      }

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl shadow-primary/40 bg-primary hover:bg-primary/90 p-0 z-50 flex items-center justify-center animate-bounce"
        >
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary-foreground">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Asistente IA BarberFlow</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/20" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 h-96 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${
                    msg.sender === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                  
                  {/* Action Widgets */}
                  {msg.action === "booking_success" && (
                    <div className="mt-2 p-3 rounded-xl border border-green-500/30 bg-green-500/10 flex items-center gap-3 w-full max-w-[85%]">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-xs font-semibold text-green-500">Turno Confirmado (IA)</p>
                        <p className="text-xs text-muted-foreground">Juan Pérez - Mañana 15:00</p>
                      </div>
                    </div>
                  )}
                  {msg.action === "calendar" && (
                    <div className="mt-2 p-3 rounded-xl border border-primary/30 bg-primary/10 flex items-center gap-3 w-full max-w-[85%]">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs font-semibold text-primary">Próximo Turno</p>
                        <p className="text-xs text-muted-foreground">Javier Silva - 14:00</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start">
                  <div className="px-4 py-3 rounded-2xl bg-muted rounded-tl-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border bg-card flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe aquí..." 
              className="flex-1 bg-background"
            />
            <Button onClick={handleSend} size="icon" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
