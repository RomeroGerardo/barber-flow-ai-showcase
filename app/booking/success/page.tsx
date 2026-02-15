import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingSuccessPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-lg border-green-500/50 bg-green-500/10 shadow-xl">
                <CardContent className="pt-12 pb-12 text-center space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-20 h-20 text-green-500 animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">¡Pago Recibido!</h1>
                    <p className="text-muted-foreground text-lg">
                        Tu seña ha sido acreditada correctamente y tu cita está confirmada.
                        <br />
                        ¡Gracias por confiar en nosotros!
                    </p>
                    <div className="pt-4">
                        <Link href="/">
                            <Button size="lg" className="w-full sm:w-auto">
                                Volver al Inicio
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
