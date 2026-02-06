import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MessageCircle, MapPin } from "lucide-react";

export default function ContactoPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <div className="py-8 px-4 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-foreground mb-6">Contacto</h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-muted-foreground mb-8">
                            ¿Tenés preguntas sobre BarberFlow AI? Estamos acá para ayudarte.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-card/50 border border-border rounded-xl p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                                <a href="mailto:romero.gerardo.ds@gmail.com" className="text-primary hover:underline">
                                    romero.gerardo.ds@gmail.com
                                </a>
                            </div>

                            <div className="bg-card/50 border border-border rounded-xl p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                                <a href="https://wa.me/543573402221" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                    +54 3573 402221
                                </a>
                            </div>

                            <div className="bg-card/50 border border-border rounded-xl p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Ubicación</h3>
                                <p className="text-muted-foreground">
                                    Matorrales, Córdoba (Argentina)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
