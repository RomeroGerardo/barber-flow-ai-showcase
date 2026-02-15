import { NextRequest, NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { appointment_id, service_name, price, client_email, client_name } = body;

        // Validations
        if (!appointment_id || !price) {
            return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
        }

        // Calculate deposit (30%)
        const depositAmount = Math.round(price * 0.30);

        // Create preference
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: appointment_id,
                        title: `Seña: ${service_name}`,
                        quantity: 1,
                        unit_price: depositAmount,
                        currency_id: 'ARS',
                    },
                ],
                payer: {
                    email: client_email || 'test_user@test.com', // Sandbox requires valid email format
                    name: client_name,
                },
                back_urls: {
                    success: `${req.nextUrl.origin}/booking/success`,
                    failure: `${req.nextUrl.origin}/booking/failure`, // or just main page
                    pending: `${req.nextUrl.origin}/booking/pending`,
                },
                // auto_return: 'approved', // Disabled to avoid localhost validation errors in Sandbox
                external_reference: appointment_id, // Link payment to appointment
                notification_url: `${req.nextUrl.origin}/api/webhook/mercadopago`, // Must be public URL for MP to reach
                statement_descriptor: 'BarberFlow',
                payment_methods: {
                    installments: 1
                }
            }
        });

        console.log('MercadoPago Preference Result:', JSON.stringify(result, null, 2));

        return NextResponse.json({
            ...result,
            deposit_amount: depositAmount,
            debug_price: price,
            debug_mp_response: result
        });

    } catch (error: any) {
        console.error('Error creating preference:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return NextResponse.json({
            error: error.message || 'Error creating preference',
            details: error
        }, { status: 500 });
    }
}
