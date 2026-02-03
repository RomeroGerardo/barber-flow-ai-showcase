import { NextRequest, NextResponse } from 'next/server';
import { MockBarberAssistant } from '@/lib/ai/mock-assistant';
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    try {
        // Inicializar Cliente de Administración de Supabase dentro del handler
        // Esto evita errores durante el build si las variables de entorno no están disponibles estáticamente
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

        const assistant = new MockBarberAssistant();

        // Pasar historial al asistente
        const response = await assistant.processMessage(message, history || []);

        const action = assistant.parseAction(response);
        let finalText = response.replace(/```json[\s\S]*```/, '').trim();

        // EJECUTAR ACCIÓN SI EXISTE
        if (action && action.action === 'book_appointment') {
            console.log("Ejecutando Acción de Reserva:", action.data);

            // Convertir fecha/hora a ISO con offset fijo de -03:00 para hora local de Argentina
            // Esto asegura que las 10:00 AM local se guarden como 13:00 UTC (o 10:00-03), evitando desfase de -3h en el dashboard
            const isoDate = `${action.data.date}T${action.data.time}:00-03:00`;

            const { data, error } = await supabase.from('appointments').insert([{
                client_name: action.data.client_name || 'Cliente Chat',
                service_type: action.data.service_name,
                appointment_date: isoDate,
                status: 'pending',
                notes: 'Agendado vía BarberFlow AI'
            }]);

            if (error) {
                console.error("Error al Reservar:", error);
                finalText += "\n\n(Error interno: No se pudo guardar en la base de datos real. Por favor avisa al barbero.)";
            } else {
                console.log("Reserva Exitosa:", data);
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
