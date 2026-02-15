import { NextRequest, NextResponse } from 'next/server';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { createClient } from '@/lib/supabase/client'; // or server if available, using client for simplicity with service key if needed

// We need a Service Role client for webhooks to bypass RLS potentially, 
// or ensure the RLS allows update by 'anon' if we don't have auth context.
// Better to use Service Role Key for webhooks.

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
    options: { timeout: 5000 }
});

const payment = new Payment(client);

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const topic = url.searchParams.get('topic') || url.searchParams.get('type');
        const id = url.searchParams.get('id') || url.searchParams.get('data.id');

        console.log(`Webhook received: ${topic} - ${id}`);

        if (topic === 'payment' && id) {
            const paymentData = await payment.get({ id: id });

            console.log('Payment status:', paymentData.status);
            console.log('External Reference (Appointment ID):', paymentData.external_reference);

            if (paymentData.status === 'approved' && paymentData.external_reference) {
                // Initialize Supabase Admin Client
                const supabase = createClient();

                // Note: Standard createClient might not have permission to update 'payment_status' 
                // if RLS restricts it. We might need a direct DB connection or Service Key.
                // For this demo, let's assume the client can update or we are in a trusted env.
                // Ideally: import { createClient } from '@supabase/supabase-js' and use service role key.

                // Since this is a server route, we can use the service role key if we have it in env.
                // DO NOT expose service role key in client components.
                // Assuming process.env.SUPABASE_SERVICE_ROLE_KEY exists.

                // Re-init with service key for admin access
                const supabaseAdmin = require('@supabase/supabase-js').createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL,
                    process.env.SUPABASE_SERVICE_ROLE_KEY
                );

                const { error } = await supabaseAdmin
                    .from('appointments')
                    .update({
                        payment_status: 'approved',
                        status: 'confirmed', // Confirm appointment
                        payment_id: id,
                        deposit_amount: paymentData.transaction_amount
                    })
                    .eq('id', paymentData.external_reference);

                if (error) {
                    console.error('Error updating appointment:', error);
                } else {
                    console.log('Appointment updated successfully');
                }
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
