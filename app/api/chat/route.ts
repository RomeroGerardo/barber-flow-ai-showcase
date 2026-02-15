import { NextRequest, NextResponse } from 'next/server';
import { Cerebro } from '@/lib/ai/cerebro';
import { createClient } from "@supabase/supabase-js";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const body = await req.json();
        const { message, history, state } = body;

        if (!message) {
            return NextResponse.json({ error: 'El mensaje es obligatorio' }, { status: 400 });
        }

        const cerebro = new Cerebro({
            businessId: 'default',
            initialState: state
        });

        const response = await cerebro.processMessage(message, history || []);
        const action = cerebro.parseAction(response);
        let finalText = response.replace(/```json[\s\S]*```/, '').trim();
        let newState = cerebro.getState();

        if (action && action.action === 'book_appointment') {
            console.log("Ejecutando Acción de Reserva:", action.data);

            if (!action.data.date || !action.data.time) {
                console.error("Datos incompletos para reserva");
            } else {
                const isOverlap = await cerebro.checkOverlap(action.data.date, action.data.time);
                if (isOverlap) {
                    finalText = "Lo siento, ese horario ya está ocupado. ¿Podrías elegir otro?";
                } else {
                    const isoDate = `${action.data.date}T${action.data.time}:00-03:00`;
                    // **Fix 1: Programmatic Date Confirmation**
                    // Parse the ISO date to get the real date and format it correctly to avoid hallucination
                    // We treat the input string as local time for display
                    const displayDate = format(parseISO(isoDate), "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });

                    const price = 4500; // TODO: Fetch from DB based on service name
                    const depositAmount = Math.round(price * 0.30);

                    const { data: newAppointment, error } = await supabase.from('appointments').insert([{
                        client_name: action.data.client_name || 'Cliente Chat',
                        service_type: action.data.service_name,
                        appointment_date: isoDate,
                        status: 'confirmed',
                        notes: 'Agendado vía Cerebro AI',
                        price: price,
                        payment_status: 'none',
                        deposit_amount: depositAmount
                    }]).select().single();

                    if (error) {
                        console.error("Error al Reservar:", error);
                        finalText = `Hubo un error al guardar la cita: ${error.message}. Por favor intenta de nuevo.`;
                    } else {
                        console.log("Reserva Exitosa:", newAppointment);

                        // **Fix 2: Force clean confirmation message**
                        finalText = `¡Listo! ✅ Cita agendada para el ${displayDate}.`;

                        // Generar Link de Pago
                        try {
                            const { preference } = await import('@/lib/mercadopago');
                            console.log("Generando preferencia de pago para:", newAppointment.id);

                            const mpResult = await preference.create({
                                body: {
                                    items: [
                                        {
                                            id: newAppointment.id,
                                            title: `Seña: ${action.data.service_name}`,
                                            quantity: 1,
                                            unit_price: depositAmount,
                                            currency_id: 'ARS',
                                        },
                                    ],
                                    payer: {
                                        email: 'test_user_chat@test.com',
                                    },
                                    back_urls: {
                                        success: `${req.nextUrl.origin}/booking/success`,
                                        failure: `${req.nextUrl.origin}/booking/failure`,
                                    },
                                    auto_return: 'approved',
                                    external_reference: newAppointment.id,
                                    notification_url: `${req.nextUrl.origin}/api/webhook/mercadopago`,
                                }
                            });

                            if (mpResult.sandbox_init_point || mpResult.init_point) {
                                const link = mpResult.sandbox_init_point || mpResult.init_point;
                                finalText += `\n\n📌 **Para confirmar tu turno, por favor abona la seña ($${depositAmount}):**\n[👉 Pagar Seña Aquí](${link})`;
                            } else {
                                console.error("MercadoPago no devolvió init_point:", mpResult);
                                finalText += `\n\n(No se pudo generar el link de pago, por favor paga en el local).`;
                            }
                        } catch (mpError: any) {
                            console.error("Error generando MP link en chat:", mpError);
                            finalText += `\n\n(Error al conectar con MercadoPago: ${mpError.message || 'Desconocido'}).`;
                        }
                    }
                }
            }
        }

        return NextResponse.json({
            response: finalText,
            action: action,
            state: newState
        });

    } catch (error) {
        console.error('Error en API de Chat:', error);
        return NextResponse.json({ error: 'Error Interno del Servidor' }, { status: 500 });
    }
}
