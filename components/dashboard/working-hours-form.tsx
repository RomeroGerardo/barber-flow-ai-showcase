"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner" // Assuming sonner or useToast is available, I'll use a generic alert if not sure, but sonner is common in shadcn. I'll fallback to console/alert if needed or check package.json. Actually I'll use standard alert for safety or check for toast component.
// checking components/ui list earlier: I saw 'toast' not explicitly. I saw 'alert'. 
// I'll use simple state for now.

export function WorkingHoursForm() {
    const [startTime, setStartTime] = useState("09:00")
    const [endTime, setEndTime] = useState("20:00")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Using client-side supabase for this admin form
    // In a real app we'd use useSupabaseClient or similar context
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        async function loadSettings() {
            setLoading(true)
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'working_hours')
                .single()

            if (data && data.value) {
                setStartTime(data.value.start)
                setEndTime(data.value.end)
            }
            setLoading(false)
        }
        loadSettings()
    }, [])

    const handleSave = async () => {
        setLoading(true)
        setSuccess(false)

        const { error } = await supabase
            .from('settings')
            .upsert({
                key: 'working_hours',
                value: { start: startTime, end: endTime }
            })

        setLoading(false)
        if (error) {
            console.error(error)
            alert("Error al guardar: " + error.message)
        } else {
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Horarios de Atención</CardTitle>
                <CardDescription>Configura el horario en que el chatbot puede agendar citas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="start-time">Hora de Inicio</Label>
                    <Input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end-time">Hora de Cierre</Label>
                    <Input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
                {success && <p className="text-green-600 text-sm font-medium">¡Configuración guardada!</p>}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={loading} className="w-full">
                    {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </CardFooter>
        </Card>
    )
}
