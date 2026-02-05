import { NextRequest, NextResponse } from 'next/server';
import { Cerebro } from '@/lib/ai/cerebro';
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    try {
        // Inicializar Cliente de Administración de Supabase dentro del handler
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const body = await req.json();
        const { message, history } = body;

        console.log("Petición de Chat:", message);

        if (!message) {
            return NextResponse.json({ error: 'El mensaje es obligatorio' }, { status: 400 });
        }

        // Usar Cerebro AI en lugar del Mock Assistant
        const cerebro = new Cerebro({ businessId: 'default' });

        // Pasar historial al asistente
        const response = await cerebro.processMessage(message, history || []);

        const action = cerebro.parseAction(response);
        let finalText = response.replace(/```json[\s\S]*```/, '').trim();

        // EJECUTAR ACCIÓN SI EXISTE
        if (action && action.action === 'book_appointment') {
            console.log("Ejecutando Acción de Reserva:", action.data);

            // Verificar que hay fecha y hora
            if (!action.data.date || !action.data.time) {
                console.error("Datos incompletos para reserva");
            } else {
                // Verificar disponibilidad
                const isOverlap = await cerebro.checkOverlap(action.data.date, action.data.time);
                if (isOverlap) {
                    finalText = "Lo siento, ese horario ya está ocupado. ¿Podrías elegir otro?";
                } else {
                    // Convertir fecha/hora a ISO con offset de Argentina
                    const isoDate = `${action.data.date}T${action.data.time}:00-03:00`;

                    const { data, error } = await supabase.from('appointments').insert([{
                        client_name: action.data.client_name || 'Cliente Chat',
                        service_type: action.data.service_name,
                        appointment_date: isoDate,
                        status: 'pending',
                        notes: 'Agendado vía Cerebro AI'
                    }]);

                    if (error) {
                        console.error("Error al Reservar:", error);
                        finalText += "\n\n(Error interno: No se pudo guardar. Por favor avisa al barbero.)";
                    } else {
                        console.log("Reserva Exitosa:", data);
                    }
                }
            }
        }

        return NextResponse.json({
            response: finalText,
            action: action
        });

    } catch (error) {
        console.error('Error en API de Chat:', error);
        return NextResponse.json({ error: 'Error Interno del Servidor' }, { status: 500 });
    }
}
