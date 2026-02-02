import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { MockBarberAssistant } from '@/lib/ai/mock-assistant';

// Supabase Admin Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        // 1. Parse Twilio Form Data
        const formData = await req.formData();
        const incomingMsg = formData.get('Body')?.toString() || '';
        const fromNumber = formData.get('From')?.toString() || '';

        console.log(`WhatsApp Msg from ${fromNumber}: ${incomingMsg}`);

        if (!incomingMsg || !fromNumber) {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
        }

        // 2. Load Session from DB
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

        // 3. Update History (Append User Msg)
        sessionData.history.push(`User: ${incomingMsg}`);

        // 4. Instantiate Assistant with State
        const assistant = new MockBarberAssistant({
            step: sessionData.step,
            collectedData: sessionData.collected_data
        });

        // 5. Process Message
        const responseText = await assistant.processMessage(incomingMsg, sessionData.history);

        // 6. Execute Action (if Booking)
        const action = assistant.parseAction(responseText);
        let finalResponse = responseText.replace(/```json[\s\S]*```/, '').trim();

        if (action && action.action === 'book_appointment') {
            console.log("WhatsApp Booking Action:", action.data);
            const isoDate = `${action.data.date}T${action.data.time}:00-03:00`;

            const { error } = await supabase.from('appointments').insert([{
                client_name: `WhatsApp User (${fromNumber})`,
                service_type: action.data.service_name,
                appointment_date: isoDate,
                status: 'pending',
                notes: `Agendado vía WhatsApp ${fromNumber}` // sanitize if needed
            }]);

            if (error) {
                console.error("Booking Error:", error);
                finalResponse += "\n\n(Error sistema: No se pudo guardar la cita.)";
            }
        }

        // 7. Update History (Append Bot Msg)
        sessionData.history.push(`assistant: ${finalResponse}`);

        // 8. Get New State & Persist
        const newState = assistant.getState();
        const { error: saveError } = await supabase
            .from('chat_sessions')
            .upsert({
                phone_number: fromNumber,
                current_step: newState.step, // Type assertion might be needed if TS complains
                collected_data: newState.collectedData,
                history: sessionData.history,
                updated_at: new Date().toISOString()
            });

        if (saveError) console.error("Session Save Error:", saveError);

        // 9. Send XML Response to Twilio
        // Twilio expects TwiML response
        const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${finalResponse}</Message>
</Response>`;

        return new NextResponse(xmlResponse, {
            headers: { 'Content-Type': 'text/xml' }
        });

    } catch (error) {
        console.error('WhatsApp Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
