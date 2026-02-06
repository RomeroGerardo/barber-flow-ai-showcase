"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, MessageCircle } from "lucide-react";

interface GapAlertProps {
    freeHoursToday: number;
    nextGapTime?: string;
}

export function GapAlert({ freeHoursToday, nextGapTime }: GapAlertProps) {
    if (freeHoursToday === 0) {
        return null;
    }

    const handleFillGap = () => {
        // TODO: Integrate with WhatsApp API to send flash discount
        alert("🚀 Próximamente: Enviar promoción flash por WhatsApp a clientes frecuentes");
    };

    return (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    </div>

                    <div className="flex-1">
                        <p className="font-semibold text-foreground">
                            Tienes {freeHoursToday} {freeHoursToday === 1 ? "hora libre" : "horas libres"} hoy
                        </p>
                        {nextGapTime && (
                            <p className="text-sm text-muted-foreground">
                                Próximo hueco disponible: <span className="text-yellow-500 font-medium">{nextGapTime}</span>
                            </p>
                        )}
                    </div>

                    <Button
                        onClick={handleFillGap}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/25 gap-2"
                    >
                        <Zap className="h-4 w-4" />
                        <span className="hidden sm:inline">Llenar Hueco</span>
                        <MessageCircle className="h-4 w-4 sm:hidden" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
