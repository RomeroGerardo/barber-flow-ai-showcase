"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { MessageCircle, Send, ExternalLink } from "lucide-react";

interface WhatsAppDialogProps {
    phone: string;
    clientName: string;
    trigger?: React.ReactNode;
}

// Mensajes predefinidos
const quickMessages = [
    {
        label: "Recordatorio de Cita",
        message: (name: string) => `Hola ${name}! 👋 Te recordamos que tienes una cita programada con nosotros. ¡Te esperamos! ✂️`,
    },
    {
        label: "Confirmar Cita",
        message: (name: string) => `Hola ${name}! Por favor confirma tu cita respondiendo a este mensaje. Gracias! 📅`,
    },
    {
        label: "Cita Disponible",
        message: (name: string) => `Hola ${name}! Tenemos horarios disponibles esta semana. ¿Te gustaría agendar una cita? 💈`,
    },
    {
        label: "Promoción",
        message: (name: string) => `Hola ${name}! 🎉 Tenemos una promoción especial para ti. Pregúntanos por más detalles!`,
    },
];

export function WhatsAppDialog({ phone, clientName, trigger }: WhatsAppDialogProps) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    // Formatear número de teléfono para WhatsApp (remover espacios, guiones, etc)
    const formatPhone = (phone: string) => {
        // Remover todo excepto números
        let cleaned = phone.replace(/\D/g, "");
        // Si empieza con 0, quitarlo
        if (cleaned.startsWith("0")) {
            cleaned = cleaned.substring(1);
        }
        // Si no tiene código de país, agregar +54 (Argentina)
        if (!cleaned.startsWith("54") && cleaned.length <= 10) {
            cleaned = "54" + cleaned;
        }
        return cleaned;
    };

    const handleSend = () => {
        if (!message.trim()) return;

        const formattedPhone = formatPhone(phone);
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

        window.open(whatsappUrl, "_blank");
        setOpen(false);
    };

    const selectQuickMessage = (msgTemplate: (name: string) => string) => {
        setMessage(msgTemplate(clientName));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-green-500" />
                        Enviar WhatsApp a {clientName}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    {/* Quick Messages */}
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Mensajes rápidos:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickMessages.map((qm, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => selectQuickMessage(qm.message)}
                                >
                                    {qm.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Message */}
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Mensaje personalizado:</p>
                        <Textarea
                            placeholder="Escribe tu mensaje..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Phone Preview */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Número:</span>
                        <code className="bg-muted px-2 py-1 rounded">{phone}</code>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                        <Send className="h-4 w-4" />
                        Enviar
                        <ExternalLink className="h-3 w-3" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Helper function to generate direct WhatsApp link
export function getWhatsAppLink(phone: string, message?: string) {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
        cleaned = cleaned.substring(1);
    }
    if (!cleaned.startsWith("54") && cleaned.length <= 10) {
        cleaned = "54" + cleaned;
    }

    const baseUrl = `https://wa.me/${cleaned}`;
    if (message) {
        return `${baseUrl}?text=${encodeURIComponent(message)}`;
    }
    return baseUrl;
}
