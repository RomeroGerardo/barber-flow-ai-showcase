
export function parseNaturalDate(input: string): { date: string, time: string } | null {
    const lower = input.toLowerCase();
    const now = new Date();
    let targetDate = new Date(now);

    // Time parsing (simple regex for HH:MM or HHpm or HHhs)
    // Matches 10:00, 10:30, 4pm, 4:00pm, 16:00, 15hs, 15 hs
    const timeMatch = lower.match(/(\d{1,2})([:.](\d{2}))?\s*(am|pm|hs)?/);
    let hours = 10;
    let minutes = 0;

    if (timeMatch) {
        let h = parseInt(timeMatch[1]);
        const colonMin = timeMatch[3];
        const ampm = timeMatch[4];

        if (ampm === 'pm' && h < 12) h += 12;
        if (ampm === 'am' && h === 12) h = 0;
        // "hs" no cambia la hora, se asume formato 24h

        if (colonMin) minutes = parseInt(colonMin);

        hours = h;
    } else {
        // Sin hora especificada, retornar null
        return null;
    }

    // Date parsing
    if (lower.includes("hoy")) {
        // mismo día
    } else if (lower.includes("mañana")) {
        targetDate.setDate(now.getDate() + 1);
    } else {
        // Weekday parsing (lunes, martes...)
        // Mapeamos nombres de días a sus índices de JavaScript (0=domingo, 1=lunes, ..., 6=sábado)
        const dayMappings: { [key: string]: number } = {
            'domingo': 0,
            'lunes': 1,
            'martes': 2,
            'miercoles': 3,
            'miércoles': 3,
            'jueves': 4,
            'viernes': 5,
            'sabado': 6,
            'sábado': 6
        };

        let targetDayIndex = -1;
        for (const [dayName, dayIndex] of Object.entries(dayMappings)) {
            if (lower.includes(dayName)) {
                targetDayIndex = dayIndex;
                break;
            }
        }

        if (targetDayIndex !== -1) {
            const currentDay = now.getDay();
            let diff = targetDayIndex - currentDay;
            if (diff <= 0) diff += 7; // próxima ocurrencia
            targetDate.setDate(now.getDate() + diff);
        } else {
            // Verificar fecha numérica explícita "el 15", "el 3"
            const dateNum = lower.match(/el (\d{1,2})/);
            if (dateNum) {
                const day = parseInt(dateNum[1]);
                // Asumir mes actual, si ya pasó, mes siguiente
                targetDate.setDate(day);
                if (targetDate < now) {
                    targetDate.setMonth(targetDate.getMonth() + 1);
                }
            } else {
                // Fallback: si no hay fecha pero sí hora, asumir mañana para seguridad
                if (!lower.includes("hoy")) targetDate.setDate(now.getDate() + 1);
            }
        }
    }

    // Formato YYYY-MM-DD
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');

    // Formato HH:MM
    const hh = String(hours).padStart(2, '0');
    const min = String(minutes).padStart(2, '0');

    return {
        date: `${yyyy}-${mm}-${dd}`,
        time: `${hh}:${min}`
    };
}
