import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacidadPage() {
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
                    <h1 className="text-4xl font-bold text-foreground mb-6">Política de Privacidad</h1>
                    <p className="text-sm text-muted-foreground mb-8">Última actualización: Febrero 2026</p>

                    <div className="prose prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Información que Recopilamos</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Recopilamos información que nos proporcionas directamente, como nombre, número de teléfono,
                                email y preferencias de citas cuando usas nuestros servicios. También recopilamos datos
                                de uso automáticamente para mejorar la experiencia del usuario.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Uso de la Información</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Utilizamos tu información para:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                                <li>Procesar y gestionar tus reservas de citas</li>
                                <li>Enviarte recordatorios y confirmaciones</li>
                                <li>Mejorar nuestros servicios y experiencia de usuario</li>
                                <li>Comunicarnos contigo sobre actualizaciones importantes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Compartir Información</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                No vendemos ni compartimos tu información personal con terceros, excepto cuando sea
                                necesario para proporcionar nuestros servicios (por ejemplo, con la barbería donde
                                reservaste tu cita) o cuando la ley lo requiera.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Seguridad de Datos</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información
                                personal contra acceso no autorizado, pérdida o alteración. Utilizamos encriptación
                                y servidores seguros para almacenar tus datos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Tus Derechos</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Tenés derecho a acceder, corregir o eliminar tu información personal. También podés
                                optar por no recibir comunicaciones de marketing. Para ejercer estos derechos,
                                contactanos a través de nuestra página de contacto.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Utilizamos cookies esenciales para el funcionamiento del sitio y cookies analíticas
                                para entender cómo los usuarios interactúan con nuestra plataforma.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contacto</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Si tenés preguntas sobre esta política de privacidad, podés contactarnos en{" "}
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
