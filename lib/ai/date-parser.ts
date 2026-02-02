
export function parseNaturalDate(input: string): { date: string, time: string } | null {
    const lower = input.toLowerCase();
    const now = new Date();
    let targetDate = new Date(now);

    // Time parsing (simple regex for HH:MM or HHpm)
    // Matches 10:00, 10:30, 4pm, 4:00pm, 16:00
    const timeMatch = lower.match(/(\d{1,2})(:(\d{2}))?\s*(am|pm)?/);
    let hours = 10;
    let minutes = 0;

    if (timeMatch) {
        let h = parseInt(timeMatch[1]);
        const colonMin = timeMatch[3];
        const ampm = timeMatch[4];

        if (ampm === 'pm' && h < 12) h += 12;
        if (ampm === 'am' && h === 12) h = 0;

        if (colonMin) minutes = parseInt(colonMin);

        hours = h;
    } else {
        // Default time if not found? Or return null?
        return null;
    }

    // Date parsing
    if (lower.includes("hoy")) {
        // same day
    } else if (lower.includes("mañana")) {
        targetDate.setDate(now.getDate() + 1);
    } else {
        // Weekday parsing (lunes, martes...)
        const days = ['domingo', 'lunes', 'martes', 'miercoles', 'miércoles', 'jueves', 'viernes', 'sabado', 'sábado'];
        const targetDayIndex = days.findIndex(d => lower.includes(d));

        if (targetDayIndex !== -1) {
            const currentDay = now.getDay();
            let diff = targetDayIndex - currentDay;
            if (diff <= 0) diff += 7; // next occurence
            targetDate.setDate(now.getDate() + diff);
        } else {
            // Check for explicit numeric date "el 15", "el 3"
            const dateNum = lower.match(/el (\d{1,2})/);
            if (dateNum) {
                const day = parseInt(dateNum[1]);
                // Assume current month unless day is in past, then next month
                targetDate.setDate(day);
                if (targetDate < now) {
                    targetDate.setMonth(targetDate.getMonth() + 1);
                }
            } else {
                // Fallback: If no date specified but time is, assume tomorrow if time is passed, or today?
                // Let's assume explicit date required or default to tomorrow for safety in demo
                if (!lower.includes("hoy")) targetDate.setDate(now.getDate() + 1);
            }
        }
    }

    // Format YYYY-MM-DD
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');

    // Format HH:MM
    const hh = String(hours).padStart(2, '0');
    const min = String(minutes).padStart(2, '0');

    return {
        date: `${yyyy}-${mm}-${dd}`,
        time: `${hh}:${min}`
    };
}
