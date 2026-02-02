import { NextRequest, NextResponse } from 'next/server';
import Twilio from 'twilio'; // Use default import for cleaner usage if possible, or namespace
import { BarberAssistant } from '@/lib/ai/assistant';
import { createClient } from '@supabase/supabase-js';

// Helper to send WhatsApp message
async function sendWhatsAppMessage(to: string, body: string) {
    const client = Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    try {
        await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: to,
            body: body
        });
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
    }
}

// Helper to check availability (logic reused/simplified)
async function checkAvailability(dateStr: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    // Simple check: get all appointments for the day
    const { data } = await supabase
        .from('appointments')
        .select('appointment_date')
        .gte('appointment_date', `${dateStr}T00:00:00`)
        .lte('appointment_date', `${dateStr}T23:59:59`)
        .neq('status', 'cancelled');

    const busySlots = data?.map(d => {
        const date = new Date(d.appointment_date);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }) || [];

    return busySlots;
}

// Helper to book
async function bookAppointment(data: any) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Calculate duration based on service name (simplified)
    const services = {
        'Corte de Cabello': 30,
        'Barba': 20,
        'Corte + Barba': 50,
        'Coloración': 90
    };
    // @ts-ignore
    const duration = services[data.service_name] || 30;

    // Construct ISO date
    // data.date = "2024-02-02", data.time = "10:00"
    const isoDate = `${data.date}T${data.time}:00`;

    const { error } = await supabase.from('appointments').insert([{
        client_name: data.client_name,
        service_type: data.service_name,
        appointment_date: isoDate,
        status: 'pending',
        notes: 'Booked via WhatsApp AI'
    }]);

    return !error;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const body = formData.get('Body') as string;
        const from = formData.get('From') as string;

        if (!body || !from) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        console.log(`WhatsApp Message from ${from}: ${body}`);

        const assistant = new BarberAssistant();
        const aiResponse = await assistant.processMessage(body);

        // Check for actions
        const action = assistant.parseAction(aiResponse);
        let finalResponse = aiResponse.replace(/```json[\s\S]*```/, '').trim(); // Remove JSON from user view logic

        if (action) {
            console.log('AI Action:', action);
            if (action.action === 'check_availability') {
                const busySlots = await checkAvailability(action.data.date);
                if (busySlots.length > 0) {
                    finalResponse += `\n\n(Sistema): Para el ${action.data.date}, estas horas ya ESTÁN ocupadas: ${busySlots.join(', ')}.`;
                } else {
                    finalResponse += `\n\n(Sistema): ¡Todo libre para esa fecha por ahora!`;
                }
            } else if (action.action === 'book_appointment') {
                const success = await bookAppointment(action.data);
                if (success) {
                    finalResponse = `¡Listo ${action.data.client_name}! Tu cita para ${action.data.service_name} el ${action.data.date} a las ${action.data.time} ha sido confirmada via WhatsApp.`;
                } else {
                    finalResponse = "Hubo un error técnico al intentar guardar tu cita. Por favor intenta de nuevo.";
                }
            }
        }

        await sendWhatsAppMessage(from, finalResponse);

        return new NextResponse('<Response></Response>', {
            headers: { 'Content-Type': 'text/xml' }
        });

    } catch (error) {
        console.error('WhatsApp Endpoint Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
