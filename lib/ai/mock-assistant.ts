
import { createClient } from "@supabase/supabase-js";
import { parseNaturalDate } from "./date-parser";

export class MockBarberAssistant {
    private step: 'GREETING' | 'SERVICE_SELECTION' | 'DATE_TIME' | 'CONFIRMATION' = 'GREETING';
    private collectedData: any = {};
    private services: any[] = [];
    private workingHours: { start: string, end: string } = { start: "09:00", end: "20:00" }; // Default
    private supabase;

    constructor(initialState?: { step: any, collectedData: any }) {
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        if (initialState) {
            this.step = initialState.step;
            this.collectedData = initialState.collectedData;
        }
    }

    // Export state for persistence
    getState() {
        return {
            step: this.step,
            collectedData: this.collectedData
        };
    }

    // Initialize/Fetch services and settings
    async loadData() {
        if (this.services.length > 0) return;

        try {
            // Load Services
            const { data: servicesData } = await this.supabase
                .from('services')
                .select('name, price, duration_minutes');

            if (servicesData && servicesData.length > 0) {
                this.services = servicesData;
            } else {
                this.services = [
                    { name: 'Corte de Cabello', price: 15, duration_minutes: 30 },
                    { name: 'Barba', price: 10, duration_minutes: 20 },
                    { name: 'Corte + Barba', price: 22, duration_minutes: 50 }
                ];
            }

            // Load Settings (Working Hours)
            const { data: settingsData } = await this.supabase
                .from('settings')
                .select('value')
                .eq('key', 'working_hours')
                .single();

            if (settingsData && settingsData.value) {
                this.workingHours = settingsData.value;
            }

        } catch (e) {
            console.error(e);
        }
    }

    async processMessage(userMessage: string, history: string[] = []): Promise<string> {
        await this.loadData();
        await new Promise(resolve => setTimeout(resolve, 800));

        const lowerMsg = userMessage.toLowerCase();

        // State Deduction (Modified to respect current step if already set from DB, but allow override)
        // If we have history, we can re-deduce. If history is empty (WhatsApp first message without context), we rely on this.step

        let lastBotMessage = "";
        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].startsWith("Model:") || (history[i].startsWith("assistant:"))) {
                lastBotMessage = history[i].toLowerCase();
                break;
            }
        }

        // Only re-deduce step if history is provided (Web Chat mode) OR if we want to guess from context.
        // For WhatsApp, we might provide history from DB. 
        if (lastBotMessage.includes("confirmamos") || lastBotMessage.includes("disponible")) {
            this.step = 'CONFIRMATION';
            this.extractDataFromHistory(history);
        } else if (lastBotMessage.includes("para qué día") || lastBotMessage.includes("día y hora") || lastBotMessage.includes("estamos cerrados") || lastBotMessage.includes("horario de atención") || lastBotMessage.includes("ocupado")) {
            this.step = 'DATE_TIME';
            this.extractDataFromHistory(history);
        } else if (lastBotMessage.includes("servicios") || lastBotMessage.includes("número del servicio")) {
            this.step = 'SERVICE_SELECTION';
        } else {
            // If manual reset
            if (lowerMsg.includes("hola") || lowerMsg.includes("inicio")) {
                this.step = 'GREETING';
            } else if (this.step === 'GREETING' && this.services.some(s => lowerMsg.includes(s.name.toLowerCase()))) {
                this.step = 'SERVICE_SELECTION';
            }
        }

        // Manual override for 'config' or 'hours' query
        if (lowerMsg.includes("que hora") || lowerMsg.includes("horario")) {
            return `Nuestro horario de atención es de ${this.workingHours.start} a ${this.workingHours.end}. ¿Para qué día te gustaría agendar?`;
        }

        // --- Logic Engine ---

        if (this.step === 'GREETING') {
            const serviceList = this.services.map((s, i) => `${i + 1}. ${s.name} - $${s.price} (${s.duration_minutes} min)`).join('\n');
            const hoursMsg = `Nuestro horario es de ${this.workingHours.start} a ${this.workingHours.end}.`;
            return `¡Hola! Soy BarberFlow. ${hoursMsg}\nAquí tienes nuestros servicios:\n\n${serviceList}\n\nPor favor, escribe el número del servicio que deseas (ej: "1").`;
        }

        if (this.step === 'SERVICE_SELECTION') {
            let selected = this.services.find(s => lowerMsg.includes(s.name.toLowerCase()));
            if (!selected) {
                const numMatch = lowerMsg.match(/\d+/);
                if (numMatch) {
                    const index = parseInt(numMatch[0]) - 1;
                    if (this.services[index]) selected = this.services[index];
                }
            }
            if (selected) {
                return `Elegiste: **${selected.name}** ($${selected.price} - ${selected.duration_minutes} min).\n\n¿Para qué día y hora te gustaría reservar?\n(Ej: "Mañana a las 2pm")`;
            }
            return "No entendí cuál servicio prefieres. Por favor escribe el NÚMERO o el NOMBRE del servicio.";
        }

        if (this.step === 'DATE_TIME') {
            const parsed = parseNaturalDate(lowerMsg);
            if (!parsed) return "¿Me repites la fecha y hora? (Ej: Lunes 4pm)";

            // Check Working Hours
            const timeNum = parseInt(parsed.time.replace(':', ''));
            const startNum = parseInt(this.workingHours.start.replace(':', ''));
            const endNum = parseInt(this.workingHours.end.replace(':', ''));

            if (timeNum < startNum || timeNum > endNum) {
                return `Lo siento, esa hora (${parsed.time}) está fuera de nuestro horario de atención (${this.workingHours.start} - ${this.workingHours.end}).\n\n¿Podrías elegir otra hora?`;
            }

            // CHECK COLLISION
            const isOverlap = await this.checkOverlap(parsed.date, parsed.time);
            if (isOverlap) {
                return `Lo siento, el horario ${parsed.date} a las ${parsed.time} ya está ocupado ❌.\n\nPor favor elige otro horario.`;
            }

            this.collectedData.date = parsed.date;
            this.collectedData.time = parsed.time;
            this.collectedData.client_name = "Cliente Chat";

            // Re-extract service
            const foundService = this.services.find(s => this.extractServiceFromHistory(history)?.name === s.name);
            if (foundService) this.collectedData.service_name = foundService.name;
            if (!this.collectedData.service_name) {
                // heuristic fallback
                const lastUserMsg = history.filter(h => h.startsWith("User:")).slice(-2)[0] || "";
                const s = this.services.find(s => lastUserMsg.toLowerCase().includes(s.name.toLowerCase()));
                if (s) this.collectedData.service_name = s.name;
            }

            // Return full date in string for history extraction
            return `Hora ${parsed.time} (${parsed.date}) disponible ✅.\n\n¿Confirmamos la cita para **${this.collectedData.service_name || 'tu corte'}**? (Responde SÍ)`;
        }

        if (this.step === 'CONFIRMATION') {
            if (lowerMsg.includes('si') || lowerMsg.includes('ok') || lowerMsg.includes('dale')) {
                this.extractDataFromHistory(history);
                if (!this.collectedData.service_name) this.collectedData.service_name = "Corte General";

                if (!this.collectedData.date) {
                    return "Lo siento, hubo un error al recuperar la fecha. Por favor escribe la fecha y hora de nuevo.";
                }

                // Final collision check
                const isOverlap = await this.checkOverlap(this.collectedData.date, this.collectedData.time);
                if (isOverlap) return `Ups, alguien acaba de reservar ese horario (${this.collectedData.time}). Por favor elige otro.`;

                return `¡Listo! Cita agendada. 🎉\n\nServicio: ${this.collectedData.service_name}\nFecha: ${this.collectedData.date} ${this.collectedData.time}\n\nTe esperamos.`;
            }
            return "Entendido. No he confirmado la cita aún. ¿Deseas confirmar? (Responde SÍ)";
        }

        return "Hola, escribe 'Hola' para empezar de nuevo.";
    }

    async checkOverlap(date: string, time: string): Promise<boolean> {
        const proposedStart = `${date}T${time}:00-03:00`;
        const { data, error } = await this.supabase
            .from('appointments')
            .select('id')
            .eq('appointment_date', proposedStart)
            .neq('status', 'cancelled');
        if (data && data.length > 0) return true;
        return false;
    }

    // Helper to extract service more robustly
    extractServiceFromHistory(history: string[]) {
        for (let i = history.length - 1; i >= 0; i--) {
            const msg = history[i].toLowerCase();
            for (const s of this.services) {
                if (msg.includes(`elegiste: **${s.name.toLowerCase()}**`)) {
                    return s;
                }
            }
        }
        return null;
    }

    extractDataFromHistory(history: string[]) {
        // Search backwards to find the LATEST confirmation/date proposal
        for (let i = history.length - 1; i >= 0; i--) {
            const msg = history[i].toLowerCase();

            // service check
            if (!this.collectedData.service_name) {
                for (const s of this.services) {
                    if (msg.includes(`elegiste: **${s.name.toLowerCase()}**`)) {
                        this.collectedData.service_name = s.name;
                    }
                }
            }

            // date check
            // Pattern: "Hora 13:00 (2026-02-03) disponible" OR "horario 2026-02-03 a las 13:00"
            let dateMatch = msg.match(/horario (\d{4}-\d{2}-\d{2}) a las (\d{2}:\d{2})/);
            if (!dateMatch) {
                dateMatch = msg.match(/hora (\d{2}:\d{2}) \((\d{4}-\d{2}-\d{2})\)/);
                if (dateMatch) {
                    // dateMatch[1] = time, dateMatch[2] = date
                    if (!this.collectedData.date) {
                        this.collectedData.time = dateMatch[1];
                        this.collectedData.date = dateMatch[2];
                    }
                }
            } else {
                if (!this.collectedData.date) {
                    this.collectedData.date = dateMatch[1];
                    this.collectedData.time = dateMatch[2];
                }
            }
        }

        this.collectedData.client_name = "Cliente Chat";
    }

    parseAction(response: string) {
        if (response.includes("Cita agendada")) {
            return { action: 'book_appointment', data: this.collectedData };
        }
        return null;
    }
}
