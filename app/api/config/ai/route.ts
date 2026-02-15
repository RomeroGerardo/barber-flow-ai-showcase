import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase
            .from('configuraciones')
            .select('contexto')
            .eq('business_id', 'default')
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return NextResponse.json({
            contexto: data?.contexto || ''
        });

    } catch (error) {
        console.error('Error fetching config:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const body = await req.json();
        const { contexto } = body;

        const { error } = await supabase
            .from('configuraciones')
            .upsert({
                business_id: 'default',
                contexto: contexto,
                updated_at: new Date().toISOString()
            }, { onConflict: 'business_id' });

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating config:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
