import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TerminosPage() {
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
                    <h1 className="text-4xl font-bold text-foreground mb-6">Términos y Condiciones</h1>
                    <p className="text-sm text-muted-foreground mb-8">Última actualización: Febrero 2026</p>

                    <div className="prose prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceptación de los Términos</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Al acceder y utilizar BarberFlow AI, aceptas estos términos y condiciones en su totalidad.
                                Si no estás de acuerdo con alguna parte de estos términos, no deberías usar nuestro servicio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descripción del Servicio</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                BarberFlow AI es una plataforma de gestión de citas para barberías que utiliza inteligencia
                                artificial para automatizar reservas a través de WhatsApp. El servicio incluye:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                                <li>Bot de WhatsApp para gestión de citas</li>
                                <li>Calendario inteligente para barberías</li>
                                <li>Sistema de recordatorios automáticos</li>
                                <li>Panel de analíticas y reportes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Responsabilidades del Usuario</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Como usuario del servicio, te comprometes a:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                                <li>Proporcionar información precisa y actualizada</li>
                                <li>Mantener la confidencialidad de tus credenciales de acceso</li>
                                <li>No usar el servicio para fines ilegales o no autorizados</li>
                                <li>Respetar las citas reservadas o cancelarlas con anticipación</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Política de Cancelación</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Las citas pueden ser canceladas o modificadas hasta 2 horas antes del horario reservado.
                                Cancelaciones tardías o no-shows repetidos pueden resultar en restricciones del servicio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Propiedad Intelectual</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Todo el contenido, diseño, código y tecnología de BarberFlow AI son propiedad de
                                Romero Labs. No está permitido copiar, modificar o distribuir ningún elemento del
                                servicio sin autorización expresa.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitación de Responsabilidad</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                BarberFlow AI se proporciona &quot;tal cual&quot; sin garantías de ningún tipo. No somos
                                responsables por daños directos, indirectos o consecuentes derivados del uso del servicio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Modificaciones</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                                Los cambios serán notificados a través del servicio y entrarán en vigencia
                                inmediatamente después de su publicación.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contacto</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Para consultas sobre estos términos, contactanos en{" "}
                                <a href="mailto:romero.gerardo.ds@gmail.com" className="text-primary hover:underline">
                                    romero.gerardo.ds@gmail.com
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
