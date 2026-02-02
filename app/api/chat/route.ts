import { NextRequest, NextResponse } from 'next/server';
import { MockBarberAssistant } from '@/lib/ai/mock-assistant';
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history } = body;

        console.log("Chat Request:", message);

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const assistant = new MockBarberAssistant();

        // Pass history to helper
        const response = await assistant.processMessage(message, history || []);

        const action = assistant.parseAction(response);
        let finalText = response.replace(/```json[\s\S]*```/, '').trim();

        // EXECUTE ACTION IF PRESENT
        if (action && action.action === 'book_appointment') {
            console.log("Executing Booking Action:", action.data);

            // Convert date/time to ISO with fixed -03:00 offset for Argentina/User local time
            // This ensures 10:00 AM local is stored as 13:00 UTC (or 10:00-03), preventing -3h shift in dashboard
            const isoDate = `${action.data.date}T${action.data.time}:00-03:00`;

            const { data, error } = await supabase.from('appointments').insert([{
                client_name: action.data.client_name || 'Cliente Chat',
                service_type: action.data.service_name,
                appointment_date: isoDate,
                status: 'pending',
                notes: 'Agendado vía BarberFlow AI'
            }]);

            if (error) {
                console.error("Booking Error:", error);
                finalText += "\n\n(Error interno: No se pudo guardar en la base de datos real. Por favor avisa al barbero.)";
            } else {
                console.log("Booking Success:", data);
            }
        }

        return NextResponse.json({
            response: finalText,
            action: action
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
