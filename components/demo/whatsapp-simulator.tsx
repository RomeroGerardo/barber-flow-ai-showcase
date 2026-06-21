"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  time: string;
  status?: "sent" | "delivered" | "read";
};

export function WhatsappSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy el asistente virtual de Romero's Barbershop ✂️. ¿En qué te puedo ayudar hoy?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "read",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simple AI logic simulation
    setTimeout(() => {
      let botResponse = "";
      const lowerInput = userMessage.text.toLowerCase();

      if (lowerInput.includes("turno") || lowerInput.includes("corte") || lowerInput.includes("reservar")) {
        botResponse = "¡Perfecto! Tengo disponibilidad hoy a las 17:00 o a las 18:30. ¿Qué horario prefieres?";
      } else if (lowerInput.includes("17") || lowerInput.includes("18")) {
        botResponse = "¡Excelente elección! Agendado para hoy a esa hora. Te enviaré un recordatorio 1 hora antes. ¡Nos vemos! 💈";
      } else {
        botResponse = "Para agendar un turno dime 'quiero un turno'. También puedes ver nuestros servicios o cancelar un turno existente.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: botResponse,
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-[350px] mx-auto bg-[#efeae2] dark:bg-[#0b141a] rounded-[30px] border-[8px] border-zinc-800 dark:border-zinc-900 shadow-2xl overflow-hidden relative">
      {/* Header tipo WhatsApp */}
      <div className="bg-[#00a884] dark:bg-[#202c33] text-white p-3 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 overflow-hidden">
            <img src="/barber_flow_logo.png" className="w-6 h-6 object-contain" alt="Barber" />
          </div>
          <div>
            <h3 className="font-medium text-sm">BarberFlow IA</h3>
            <p className="text-[11px] opacity-80">{isTyping ? "escribiendo..." : "en línea"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Video className="w-5 h-5 opacity-80" />
          <Phone className="w-5 h-5 opacity-80" />
          <MoreVertical className="w-5 h-5 opacity-80" />
        </div>
      </div>

      {/* Background WhatsApp Pattern (Simulated with simple CSS) */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-10 pointer-events-none bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-repeat bg-center" style={{ backgroundSize: '300px' }} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 z-10">
        <div className="text-center mb-4">
          <span className="bg-[#e1f3fb] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-xs px-3 py-1 rounded-lg inline-block shadow-sm">
            HOY
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div
              className={`p-2 px-3 rounded-xl shadow-sm relative text-[15px] ${
                msg.sender === "user"
                  ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-none"
                  : "bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-none"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] opacity-60">{msg.time}</span>
                {msg.sender === "user" && (
                  <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col max-w-[85%] mr-auto items-start">
            <div className="p-3 px-4 rounded-xl shadow-sm bg-white dark:bg-[#202c33] rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f2f5] dark:bg-[#202c33] p-2 flex items-center gap-2 z-10">
        <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-full px-4 py-1.5 flex items-center shadow-sm">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe un mensaje"
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-8"
          />
        </div>
        <Button
          onClick={handleSend}
          size="icon"
          className="rounded-full w-10 h-10 bg-[#00a884] hover:bg-[#00a884]/90 shrink-0"
        >
          <Send className="w-5 h-5 text-white ml-1" />
        </Button>
      </div>
    </div>
  );
}
