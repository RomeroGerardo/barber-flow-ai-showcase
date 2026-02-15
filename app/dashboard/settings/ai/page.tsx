"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AIConfigPage() {
    const [contexto, setContexto] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/config/ai");
            if (res.ok) {
                const data = await res.json();
                setContexto(data.contexto || "");
            }
        } catch (error) {
            console.error("Error fetching config:", error);
            toast({
                title: "Error",
                description: "No se pudo cargar la configuración.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/config/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contexto }),
            });

            if (res.ok) {
                toast({
                    title: "Guardado",
                    description: "La configuración de la IA ha sido actualizada.",
                });
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Error saving config:", error);
            toast({
                title: "Error",
                description: "No se pudo guardar los cambios.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container max-w-4xl py-6">
            <div className="mb-6 flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Configuración de IA</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Instrucciones del Sistema (Prompt)</CardTitle>
                    <CardDescription>
                        Define la personalidad y las reglas de comportamiento de tu asistente virtual.
                        Estas instrucciones serán enviadas a la IA cada vez que responda un mensaje.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        value={contexto}
                        onChange={(e) => setContexto(e.target.value)}
                        placeholder="Eres un asistente virtual..."
                        className="min-h-[400px] font-mono text-sm leading-relaxed"
                    />

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={saving} className="gap-2">
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Guardar Cambios
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
