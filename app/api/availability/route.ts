// Use service role key to bypass RLS for availability check
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
        return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    // Initialize admin client to bypass RLS policies
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Define start and end of the selected day in UTC (or local consideration)
    // For simplicity, we assume the date passed is YYYY-MM-DD
    const startDate = `${date}T00:00:00`
    const endDate = `${date}T23:59:59`

    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('appointment_date') // Removed duration_minutes as it does not exist in the table
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)
        .neq('status', 'cancelled') // Ignore cancelled appointments

    console.log(`Checking availability for ${date} (Range: ${startDate} to ${endDate})`)

    if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Found ${appointments.length} appointments`)

    // Extract just the times or return the full objects
    // We want to return a list of busy times.
    // Ideally, we'd use the service duration to block a range, but for MVP we block the start time slot.
    // Let's return the ISO strings of busy starts.

    const busySlots = appointments.map(app => app.appointment_date)

    return NextResponse.json({ busySlots })
}
