/**
 * WhatsApp Webhook - Twilio Integration
 * 
 * Recibe mensajes de WhatsApp via Twilio, procesa con Cerebro AI,
 * y responde con TwiML.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Cerebro } from '@/lib/ai/cerebro';
import { createClient } from "@supabase/supabase-js";

// Respuesta TwiML para Twilio
function twimlResponse(message: string): Response {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${escapeXml(message)}</Message>
</Response>`;
    return new Response(xml, {
        headers: { 'Content-Type': 'application/xml' }
    });
}

// Escapar caracteres especiales para XML
function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Parsear form data de Twilio
        const formData = await req.formData();
        const from = formData.get('From') as string || '';
        const body = formData.get('Body') as string || '';

        console.log(`WhatsApp de ${from}: ${body}`);

        if (!from || !body) {
            return twimlResponse("No entendí tu mensaje. Por favor intenta de nuevo.");
        }

        // Limpiar número de teléfono (quitar "whatsapp:")
        const phoneNumber = from.replace('whatsapp:', '');

        // Cargar sesión existente o crear nueva
        let session = await loadSession(supabase, phoneNumber);
        const history = session?.history || [];

        // Crear Cerebro con estado previo si existe
        const cerebro = new Cerebro({
            businessId: 'default',
            initialState: session?.current_step ? {
                step: session.current_step,
                collectedData: session.collected_data || {}
            } : undefined
        });

        // Agregar mensaje del usuario al historial
        history.push(`User: ${body}`);

        // Procesar mensaje con Cerebro
        const response = await cerebro.processMessage(body, history);

        // Agregar respuesta al historial
        history.push(`Model: ${response}`);

        // Guardar estado actualizado
        const newState = cerebro.getState();
        await saveSession(supabase, phoneNumber, newState, history);

        // Verificar si hay acción de reserva
        const action = cerebro.parseAction(response);
        if (action && action.action === 'book_appointment' && action.data.date && action.data.time) {
            // Verificar disponibilidad antes de reservar
            const isOverlap = await cerebro.checkOverlap(action.data.date, action.data.time);

            if (!isOverlap) {
                const isoDate = `${action.data.date}T${action.data.time}:00-03:00`;

                await supabase.from('appointments').insert([{
                    client_name: action.data.client_name || 'Cliente WhatsApp',
                    client_phone: phoneNumber,
                    service_type: action.data.service_name,
                    appointment_date: isoDate,
                    status: 'pending',
                    notes: 'Agendado vía WhatsApp - Cerebro AI'
                }]);

                console.log("Cita agendada vía WhatsApp:", action.data);
            }
        }

        return twimlResponse(response);

    } catch (error) {
        console.error('Error en WhatsApp webhook:', error);
        return twimlResponse("Lo siento, tuve un problema técnico. Por favor intenta de nuevo.");
    }
}

// Cargar sesión del usuario desde la base de datos
async function loadSession(supabase: any, phoneNumber: string) {
    const { data } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();
    return data;
}

// Guardar sesión actualizada
async function saveSession(
    supabase: any,
    phoneNumber: string,
    state: { step: string, collectedData: any },
    history: string[]
) {
    // Mantener solo los últimos 20 mensajes en historial
    const trimmedHistory = history.slice(-20);

    await supabase
        .from('chat_sessions')
        .upsert({
            phone_number: phoneNumber,
            current_step: state.step,
            collected_data: state.collectedData,
            history: trimmedHistory,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'phone_number'
        });
}

// GET para verificación de Twilio (opcional)
export async function GET() {
    return NextResponse.json({ status: 'WhatsApp webhook ready' });
}
