"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Loader2, Check } from "lucide-react";

export function DailyGoalForm() {
    const [dailyGoal, setDailyGoal] = useState<number>(300);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadGoal();
    }, []);

    const loadGoal = async () => {
        const supabase = createClient();
        const { data } = await supabase
            .from("settings")
            .select("value")
            .eq("key", "daily_goal")
            .single();

        if (data?.value?.amount) {
            setDailyGoal(data.value.amount);
        }
        setLoading(false);
    };

    const saveGoal = async () => {
        setSaving(true);
        setSaved(false);

        const supabase = createClient();

        // Upsert the daily goal
        const { error } = await supabase
            .from("settings")
            .upsert({
                key: "daily_goal",
                value: { amount: dailyGoal }
            }, { onConflict: "key" });

        setSaving(false);

        if (!error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Meta Diaria
                </CardTitle>
                <CardDescription>
                    Define tu objetivo de ingresos diarios
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="dailyGoal">Meta de ingresos ($)</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                            </span>
                            <Input
                                id="dailyGoal"
                                type="number"
                                value={dailyGoal}
                                onChange={(e) => setDailyGoal(Number(e.target.value))}
                                className="pl-7"
                                min={0}
                                step={10}
                            />
                        </div>
                        <Button
                            onClick={saveGoal}
                            disabled={saving}
                            className="min-w-[100px]"
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : saved ? (
                                <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Guardado
                                </>
                            ) : (
                                "Guardar"
                            )}
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">
                    Esta meta se mostrará en el dashboard como barra de progreso
                </p>
            </CardContent>
        </Card>
    );
}
