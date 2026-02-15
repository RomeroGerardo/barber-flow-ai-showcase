import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingFailurePage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-lg border-red-500/50 bg-red-500/10 shadow-xl">
                <CardContent className="pt-12 pb-12 text-center space-y-6">
                    <div className="flex justify-center">
                        <XCircle className="w-20 h-20 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-red-700 dark:text-red-400">Hubo un problema</h1>
                    <p className="text-muted-foreground text-lg">
                        No pudimos procesar el pago de tu seña.
                        <br />
                        Sin embargo, tu cita ha sido registrada como pendiente.
                    </p>
                    <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link href="/">
                            <Button variant="outline" size="lg">
                                Ir al Inicio
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
