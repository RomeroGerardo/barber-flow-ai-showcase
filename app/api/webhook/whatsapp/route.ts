import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { MockBarberAssistant } from '@/lib/ai/mock-assistant';

// Cliente Admin de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        // 1. Analizar Datos del Formulario de Twilio
        const formData = await req.formData();
        const incomingMsg = formData.get('Body')?.toString() || '';
        const fromNumber = formData.get('From')?.toString() || '';

        console.log(`Mensaje WhatsApp de ${fromNumber}: ${incomingMsg}`);

        if (!incomingMsg || !fromNumber) {
            return NextResponse.json({ error: 'Petición Inválida' }, { status: 400 });
        }

        // 2. Cargar Sesión desde DB
        let sessionData = {
            step: 'GREETING',
            collected_data: {},
            history: [] as string[]
        };

        const { data: existingSession } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('phone_number', fromNumber)
            .single();

        if (existingSession) {
            sessionData = {
                step: existingSession.current_step,
                collected_data: existingSession.collected_data || {},
                history: existingSession.history || []
            };
        }

        // 3. Actualizar Historial (Agregar Mensaje Usuario)
        sessionData.history.push(`User: ${incomingMsg}`);

        // 4. Instanciar Asistente con Estado
        const assistant = new MockBarberAssistant({
            step: sessionData.step,
            collectedData: sessionData.collected_data
        });

        // 5. Procesar Mensaje
        const responseText = await assistant.processMessage(incomingMsg, sessionData.history);

        // 6. Ejecutar Acción (si es Reserva)
        const action = assistant.parseAction(responseText);
        let finalResponse = responseText.replace(/```json[\s\S]*```/, '').trim();

        if (action && action.action === 'book_appointment') {
            console.log("Acción de Reserva WhatsApp:", action.data);
            const isoDate = `${action.data.date}T${action.data.time}:00-03:00`;

            const { error } = await supabase.from('appointments').insert([{
                client_name: `Usuario WhatsApp (${fromNumber})`,
                service_type: action.data.service_name,
                appointment_date: isoDate,
                status: 'pending',
                notes: `Agendado vía WhatsApp ${fromNumber}` // sanitizar si es necesario
            }]);

            if (error) {
                console.error("Error al Reservar:", error);
                finalResponse += "\n\n(Error sistema: No se pudo guardar la cita.)";
            }
        }

        // 7. Actualizar Historial (Agregar Mensaje Bot)
        sessionData.history.push(`assistant: ${finalResponse}`);

        // 8. Obtener Nuevo Estado y Persistir
        const newState = assistant.getState();
        const { error: saveError } = await supabase
            .from('chat_sessions')
            .upsert({
                phone_number: fromNumber,
                current_step: newState.step, // Aserción de tipo si TS se queja
                collected_data: newState.collectedData,
                history: sessionData.history,
                updated_at: new Date().toISOString()
            });

        if (saveError) console.error("Error al Guardar Sesión:", saveError);

        // 9. Enviar Respuesta XML a Twilio
        // Twilio espera respuesta TwiML
        const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${finalResponse}</Message>
</Response>`;

        return new NextResponse(xmlResponse, {
            headers: { 'Content-Type': 'text/xml' }
        });

    } catch (error) {
        console.error('Error Webhook WhatsApp:', error);
        return NextResponse.json({ error: 'Error Interno del Servidor' }, { status: 500 });
    }
}
