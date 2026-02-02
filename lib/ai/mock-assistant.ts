
import { createClient } from "@supabase/supabase-js";
import { parseNaturalDate } from "./date-parser";

/**
 * Asistente Virtual Simulado (MockBarberAssistant)
 * 
 * Esta clase maneja la lógica del chat para agendar citas.
 * No utiliza IA real (Gemini), sino una máquina de estados simple.
 */
export class MockBarberAssistant {
    // Estados posibles del flujo de conversación
    private step: 'GREETING' | 'SERVICE_SELECTION' | 'DATE_TIME' | 'CONFIRMATION' = 'GREETING';

    // Datos recolectados durante la charla
    private collectedData: any = {};

    // Lista de servicios disponibles (se carga desde DB)
    private services: any[] = [];

    // Horarios de trabajo (se carga desde DB)
    private workingHours: { start: string, end: string } = { start: "09:00", end: "20:00" };

    private supabase;

    /**
     * Constructor
     * Permite re-hidratar el estado (útil para WhatsApp / Webhooks sin estado)
     */
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

    /**
     * Devuelve el estado actual para guardarlo en la Base de Datos
     */
    getState() {
        return {
            step: this.step,
            collectedData: this.collectedData
        };
    }

    /**
     * Carga servicios y configuración desde Supabase
     */
    async loadData() {
        if (this.services.length > 0) return;

        try {
            // Cargar Servicios
            const { data: servicesData } = await this.supabase
                .from('services')
                .select('name, price, duration_minutes');

            if (servicesData && servicesData.length > 0) {
                this.services = servicesData;
            } else {
                // Datos por defecto si falla la DB
                this.services = [
                    { name: 'Corte de Cabello', price: 15, duration_minutes: 30 },
                    { name: 'Barba', price: 10, duration_minutes: 20 },
                    { name: 'Corte + Barba', price: 22, duration_minutes: 50 }
                ];
            }

            // Cargar Configuración (Horarios)
            const { data: settingsData } = await this.supabase
                .from('settings')
                .select('value')
                .eq('key', 'working_hours')
                .single();

            if (settingsData && settingsData.value) {
                this.workingHours = settingsData.value;
            }

        } catch (e) {
            console.error("Error cargando datos:", e);
        }
    }

    /**
     * Procesa el mensaje del usuario y devuelve una respuesta
     */
    async processMessage(userMessage: string, history: string[] = []): Promise<string> {
        await this.loadData();
        // Simular un pequeño retraso para que se sienta natural
        await new Promise(resolve => setTimeout(resolve, 800));

        const lowerMsg = userMessage.toLowerCase();

        // --- Deducción de Estado ---
        // Analizamos el último mensaje del bot para saber en qué pregunta nos quedamos.
        // Si es WhatsApp (sin historial previo en memoria), usamos this.step o lo re-calculamos del historial.

        let lastBotMessage = "";
        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].startsWith("Model:") || (history[i].startsWith("assistant:"))) {
                lastBotMessage = history[i].toLowerCase();
                break;
            }
        }

        if (lastBotMessage.includes("confirmamos") || lastBotMessage.includes("disponible")) {
            this.step = 'CONFIRMATION';
            this.extractDataFromHistory(history);
        } else if (lastBotMessage.includes("para qué día") || lastBotMessage.includes("día y hora") || lastBotMessage.includes("estamos cerrados") || lastBotMessage.includes("horario de atención") || lastBotMessage.includes("ocupado")) {
            this.step = 'DATE_TIME';
            this.extractDataFromHistory(history);
        } else if (lastBotMessage.includes("servicios") || lastBotMessage.includes("número del servicio")) {
            this.step = 'SERVICE_SELECTION';
        } else {
            // Reinicio manual
            if (lowerMsg.includes("hola") || lowerMsg.includes("inicio")) {
                this.step = 'GREETING';
            } else if (this.step === 'GREETING' && this.services.some(s => lowerMsg.includes(s.name.toLowerCase()))) {
                this.step = 'SERVICE_SELECTION';
            }
        }

        // Comandos manuales de consulta de horario
        if (lowerMsg.includes("que hora") || lowerMsg.includes("horario")) {
            return `Nuestro horario de atención es de ${this.workingHours.start} a ${this.workingHours.end}. ¿Para qué día te gustaría agendar?`;
        }

        // --- Motor Lógico ---

        // PASO 1: SALUDO
        if (this.step === 'GREETING') {
            const serviceList = this.services.map((s, i) => `${i + 1}. ${s.name} - $${s.price} (${s.duration_minutes} min)`).join('\n');
            const hoursMsg = `Nuestro horario es de ${this.workingHours.start} a ${this.workingHours.end}.`;
            return `¡Hola! Soy BarberFlow. ${hoursMsg}\nAquí tienes nuestros servicios:\n\n${serviceList}\n\nPor favor, escribe el número del servicio que deseas (ej: "1").`;
        }

        // PASO 2: SELECCIÓN DE SERVICIO
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

        // PASO 3: FECHA Y HORA
        if (this.step === 'DATE_TIME') {
            const parsed = parseNaturalDate(lowerMsg);
            if (!parsed) return "¿Me repites la fecha y hora? (Ej: Lunes 4pm)";

            // Validar Horario Laboral
            const timeNum = parseInt(parsed.time.replace(':', ''));
            const startNum = parseInt(this.workingHours.start.replace(':', ''));
            const endNum = parseInt(this.workingHours.end.replace(':', ''));

            if (timeNum < startNum || timeNum > endNum) {
                return `Lo siento, esa hora (${parsed.time}) está fuera de nuestro horario de atención (${this.workingHours.start} - ${this.workingHours.end}).\n\n¿Podrías elegir otra hora?`;
            }

            // Validar Colisión (Si ya está ocupado)
            const isOverlap = await this.checkOverlap(parsed.date, parsed.time);
            if (isOverlap) {
                return `Lo siento, el horario ${parsed.date} a las ${parsed.time} ya está ocupado ❌.\n\nPor favor elige otro horario.`;
            }

            this.collectedData.date = parsed.date;
            this.collectedData.time = parsed.time;
            this.collectedData.client_name = "Cliente Chat";

            // Re-intentar extraer el servicio si se perdió
            const foundService = this.services.find(s => this.extractServiceFromHistory(history)?.name === s.name);
            if (foundService) this.collectedData.service_name = foundService.name;
            if (!this.collectedData.service_name) {
                // heurística de respaldo
                const lastUserMsg = history.filter(h => h.startsWith("User:")).slice(-2)[0] || "";
                const s = this.services.find(s => lastUserMsg.toLowerCase().includes(s.name.toLowerCase()));
                if (s) this.collectedData.service_name = s.name;
            }

            // Confirmación previa
            return `Hora ${parsed.time} (${parsed.date}) disponible ✅.\n\n¿Confirmamos la cita para **${this.collectedData.service_name || 'tu corte'}**? (Responde SÍ)`;
        }

        // PASO 4: CONFIRMACIÓN FINAL
        if (this.step === 'CONFIRMATION') {
            if (lowerMsg.includes('si') || lowerMsg.includes('ok') || lowerMsg.includes('dale')) {
                this.extractDataFromHistory(history);
                if (!this.collectedData.service_name) this.collectedData.service_name = "Corte General";

                if (!this.collectedData.date) {
                    return "Lo siento, hubo un error al recuperar la fecha. Por favor escribe la fecha y hora de nuevo.";
                }

                // Chequeo final de colisión (por si acaso alguien reservó en el interín)
                const isOverlap = await this.checkOverlap(this.collectedData.date, this.collectedData.time);
                if (isOverlap) return `Ups, alguien acaba de reservar ese horario (${this.collectedData.time}). Por favor elige otro.`;

                return `¡Listo! Cita agendada. 🎉\n\nServicio: ${this.collectedData.service_name}\nFecha: ${this.collectedData.date} ${this.collectedData.time}\n\nTe esperamos.`;
            }
            return "Entendido. No he confirmado la cita aún. ¿Deseas confirmar? (Responde SÍ)";
        }

        return "Hola, escribe 'Hola' para empezar de nuevo.";
    }

    /**
     * Verifica si ya existe una cita en ese horario
     */
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

    /**
     * Ayuda a encontrar qué servicio eligió el usuario en el historial
     */
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

    /**
     * Extrae fecha, hora y servicio del historial reciente
     * Busca de atrás hacia adelante para encontrar lo más nuevo
     */
    extractDataFromHistory(history: string[]) {
        for (let i = history.length - 1; i >= 0; i--) {
            const msg = history[i].toLowerCase();

            // Buscar servicio
            if (!this.collectedData.service_name) {
                for (const s of this.services) {
                    if (msg.includes(`elegiste: **${s.name.toLowerCase()}**`)) {
                        this.collectedData.service_name = s.name;
                    }
                }
            }

            // Buscar fecha (Formatos variados que usa el bot)
            // Patrón: "Hora 13:00 (2026-02-03) disponible" O "horario 2026-02-03 a las 13:00"
            let dateMatch = msg.match(/horario (\d{4}-\d{2}-\d{2}) a las (\d{2}:\d{2})/);
            if (!dateMatch) {
                dateMatch = msg.match(/hora (\d{2}:\d{2}) \((\d{4}-\d{2}-\d{2})\)/);
                if (dateMatch) {
                    // dateMatch[1] = hora, dateMatch[2] = fecha
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

    /**
     * Identifica si el asistente completó una acción (agendar)
     */
    parseAction(response: string) {
        if (response.includes("Cita agendada")) {
            return { action: 'book_appointment', data: this.collectedData };
        }
        return null;
    }
}
