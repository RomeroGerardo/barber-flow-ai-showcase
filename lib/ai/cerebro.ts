/**
 * Cerebro AI - Motor de IA Reutilizable para Chat/WhatsApp
 * 
 * Usa Groq (Llama 3) para entender lenguaje natural y agendar citas.
 * Diseñado para ser reutilizable entre múltiples clientes/negocios.
 */

import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { parseNaturalDate } from "./date-parser";

interface CerebroConfig {
    businessId?: string;
    initialState?: ConversationState;
}

interface ConversationState {
    step: 'GREETING' | 'SERVICE_SELECTION' | 'DATE_TIME' | 'CONFIRMATION';
    collectedData: {
        service_name?: string;
        date?: string;
        time?: string;
        client_name?: string;
    };
}

interface Service {
    name: string;
    price: number;
    duration_minutes: number;
}

export class Cerebro {
    private businessId: string;
    private state: ConversationState;
    private businessContext: string = "";
    private services: Service[] = [];
    private workingHours = { start: "09:00", end: "20:00" };
    private supabase;
    private groq: Groq;

    constructor(config: CerebroConfig = {}) {
        this.businessId = config.businessId || 'default';
        this.state = config.initialState || {
            step: 'GREETING',
            collectedData: {}
        };

        // Inicializar Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
        this.supabase = createClient(supabaseUrl, supabaseKey);

        // Inicializar Groq
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY || ''
        });
    }

    /**
     * Devuelve el estado actual para persistencia (WhatsApp)
     */
    getState(): ConversationState {
        return { ...this.state };
    }

    /**
     * Carga datos del negocio desde Supabase
     */
    private async loadBusinessData(): Promise<void> {
        if (this.services.length > 0) return;

        try {
            // Cargar contexto personalizado
            const { data: configData } = await this.supabase
                .from('configuraciones')
                .select('contexto')
                .eq('business_id', this.businessId)
                .single();

            if (configData?.contexto) {
                this.businessContext = configData.contexto;
            } else {
                this.businessContext = `Eres BarberFlow, un asistente virtual profesional de barbería.
Tu objetivo es ayudar a los clientes a agendar citas de manera amable y eficiente.
Siempre confirmas el servicio, fecha y hora antes de agendar.
Responde de forma concisa y natural en español.`;
            }

            // Cargar servicios
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

            // Cargar horarios
            const { data: settingsData } = await this.supabase
                .from('settings')
                .select('value')
                .eq('key', 'working_hours')
                .single();

            if (settingsData?.value) {
                this.workingHours = settingsData.value;
            }

        } catch (error) {
            console.error("Error cargando datos del negocio:", error);
        }
    }

    /**
     * Procesa un mensaje del usuario usando Groq
     */
    async processMessage(userMessage: string, history: string[] = []): Promise<string> {
        await this.loadBusinessData();

        const lowerMsg = userMessage.toLowerCase();

        // Detectar reinicio de conversación
        if (lowerMsg.includes("hola") && this.state.step !== 'GREETING') {
            this.state = { step: 'GREETING', collectedData: {} };
        }

        // Construir prompt del sistema
        const serviceList = this.services.map((s, i) =>
            `${i + 1}. ${s.name} - $${s.price} (${s.duration_minutes} min)`
        ).join('\n');

        const systemPrompt = `${this.businessContext}

INFORMACIÓN DEL NEGOCIO:
- Horario: ${this.workingHours.start} a ${this.workingHours.end}
- Servicios disponibles:
${serviceList}

ESTADO ACTUAL DE LA CONVERSACIÓN:
- Paso: ${this.state.step}
- Datos recopilados: ${JSON.stringify(this.state.collectedData)}

INSTRUCCIONES SEGÚN EL PASO:
${this.getStepInstructions()}

REGLAS IMPORTANTES:
1. Responde SIEMPRE en español
2. Sé conciso (máximo 2-3 oraciones)
3. NO inventes servicios que no estén en la lista
4. Si el usuario confirma una cita, responde con "¡Listo! Cita agendada. 🎉" seguido de los detalles
5. Si detectas un servicio, incluye "[SERVICIO: nombre_del_servicio]" al final de tu respuesta
6. Si detectas fecha/hora, incluye "[DATETIME: detectado]" al final
7. Si el usuario confirma (dice sí, dale, ok), incluye "[CONFIRMADO]" al final`;

        // Construir mensajes para Groq
        const messages: { role: 'system' | 'user' | 'assistant', content: string }[] = [
            { role: 'system', content: systemPrompt }
        ];

        // Agregar historial
        history.slice(-6).forEach(msg => {
            if (msg.startsWith("User:")) {
                messages.push({ role: 'user', content: msg.replace("User:", "").trim() });
            } else {
                messages.push({ role: 'assistant', content: msg.replace("Model:", "").replace("assistant:", "").trim() });
            }
        });

        // Agregar mensaje actual
        messages.push({ role: 'user', content: userMessage });

        try {
            console.log("Llamando a Groq...");

            const chatCompletion = await this.groq.chat.completions.create({
                messages: messages,
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 500,
            });

            let response = chatCompletion.choices[0]?.message?.content || "";

            console.log("Respuesta de Groq OK:", response.substring(0, 80));

            // Actualizar estado basado en la respuesta
            this.updateStateFromResponse(response, userMessage);

            // Limpiar marcadores internos de la respuesta visible
            response = response
                .replace(/\[SERVICIO:.*?\]/g, '')
                .replace(/\[DATETIME:.*?\]/g, '')
                .replace(/\[CONFIRMADO\]/g, '')
                .trim();

            return response;

        } catch (error: any) {
            console.error("Error con Groq:", error?.message || error);
            // Fallback a respuesta básica
            return this.getFallbackResponse();
        }
    }

    private getStepInstructions(): string {
        switch (this.state.step) {
            case 'GREETING':
                return "Saluda al cliente y muéstrale la lista de servicios. Pregunta qué servicio desea.";
            case 'SERVICE_SELECTION':
                return "El cliente está eligiendo un servicio. Confirma su elección y pregunta para qué día y hora desea la cita.";
            case 'DATE_TIME':
                return "El cliente está indicando fecha/hora. Verifica que esté dentro del horario laboral y pide confirmación.";
            case 'CONFIRMATION':
                return "El cliente debe confirmar la cita. Si dice 'sí', 'dale', 'ok', confirma la cita. Si no, pregunta qué desea cambiar.";
            default:
                return "Ayuda al cliente a agendar una cita.";
        }
    }

    private updateStateFromResponse(response: string, userMessage: string): void {
        const lowerResponse = response.toLowerCase();
        const lowerMsg = userMessage.toLowerCase();

        // Detectar servicio seleccionado
        if (response.includes("[SERVICIO:") || this.state.step === 'SERVICE_SELECTION') {
            const serviceMatch = response.match(/\[SERVICIO:\s*(.+?)\]/);
            if (serviceMatch) {
                this.state.collectedData.service_name = serviceMatch[1].trim();
                this.state.step = 'DATE_TIME';
            } else {
                const found = this.findServiceInMessage(lowerMsg);
                if (found) {
                    this.state.collectedData.service_name = found.name;
                    this.state.step = 'DATE_TIME';
                }
            }
        }

        // Detectar fecha/hora
        if (response.includes("[DATETIME:") || this.state.step === 'DATE_TIME') {
            const parsed = parseNaturalDate(lowerMsg);
            if (parsed) {
                this.state.collectedData.date = parsed.date;
                this.state.collectedData.time = parsed.time;
                this.state.step = 'CONFIRMATION';
            }
        }

        // Detectar confirmación
        if (response.includes("[CONFIRMADO]") ||
            (this.state.step === 'CONFIRMATION' &&
                (lowerMsg.includes('si') || lowerMsg.includes('sí') || lowerMsg.includes('ok') || lowerMsg.includes('dale')))) {
            this.state.collectedData.client_name = "Cliente Chat";
        }

        // Actualizar paso basado en la respuesta si es el saludo inicial
        if (this.state.step === 'GREETING' &&
            (lowerResponse.includes('servicio') || lowerResponse.includes('servicios'))) {
            this.state.step = 'SERVICE_SELECTION';
        }
    }

    private findServiceInMessage(message: string): Service | null {
        for (const service of this.services) {
            if (message.includes(service.name.toLowerCase())) {
                return service;
            }
        }
        const numMatch = message.match(/\b(\d+)\b/);
        if (numMatch) {
            const index = parseInt(numMatch[1]) - 1;
            if (this.services[index]) {
                return this.services[index];
            }
        }
        return null;
    }

    private getFallbackResponse(): string {
        switch (this.state.step) {
            case 'GREETING':
                const serviceList = this.services.map((s, i) =>
                    `${i + 1}. ${s.name} - $${s.price}`
                ).join('\n');
                return `¡Hola! Soy BarberFlow. Nuestros servicios:\n\n${serviceList}\n\n¿Cuál te gustaría?`;
            case 'SERVICE_SELECTION':
                return "Por favor, dime el número o nombre del servicio que deseas.";
            case 'DATE_TIME':
                return "¿Para qué día y hora te gustaría la cita? (Ej: mañana a las 3pm)";
            case 'CONFIRMATION':
                return `¿Confirmamos la cita para ${this.state.collectedData.service_name}? (Responde SÍ)`;
            default:
                return "¿En qué puedo ayudarte?";
        }
    }

    /**
     * Verifica si la respuesta indica que se debe agendar una cita
     */
    parseAction(response: string): { action: string; data: typeof this.state.collectedData } | null {
        if (response.includes("Cita agendada") || response.includes("🎉")) {
            if (this.state.collectedData.date && this.state.collectedData.time) {
                return {
                    action: 'book_appointment',
                    data: this.state.collectedData
                };
            }
        }
        return null;
    }

    /**
     * Verifica si un horario ya está ocupado
     */
    async checkOverlap(date: string, time: string): Promise<boolean> {
        const proposedStart = `${date}T${time}:00-03:00`;
        const { data } = await this.supabase
            .from('appointments')
            .select('id')
            .eq('appointment_date', proposedStart)
            .neq('status', 'cancelled');
        return !!(data && data.length > 0);
    }
}
