import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase (Service Role for admin access)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const SYSTEM_PROMPT = `
You are 'BarberFlow', the AI receptionist for a high-end barber shop.
Your tone is professional, friendly, and cool.
Your goal is to help users book appointments or answer standard questions.

**Services & Prices:**
- Corte de Cabello: $15 (30 min)
- Barba: $10 (20 min)
- Corte + Barba: $22 (50 min)
- Coloración: $35 (90 min)

**Business Hours:**
- 9:00 AM to 8:00 PM (20:00), daily.

**Instructions:**
1. If the user asks for services, list them clearly.
2. If the user wants to book, collect: Name, Service, Date, Time.
3. Check availability before confirming (simulate this by asking them to wait a moment).
4. **CRITICAL**: When you have all details (Name, Service, Date, Time), DO NOT just say "Booked".
   Instead, output a JSON block at the end of your message to trigger the system action:
   \`\`\`json
   {
     "action": "book_appointment",
     "data": {
       "client_name": "Name",
       "service_name": "Service",
       "date": "YYYY-MM-DD",
       "time": "HH:MM"
     }
   }
   \`\`\`

5. If the user asks about availability for a specific date, output:
   \`\`\`json
   {
     "action": "check_availability",
     "data": {
       "date": "YYYY-MM-DD"
     }
   }
   \`\`\`

Keep responses concise (suitable for WhatsApp).
`;

export class BarberAssistant {
    private model;

    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async processMessage(userMessage: string, history: string[] = []): Promise<string> {
        // Construct chat history for context
        const chat = this.model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am BarberFlow, ready to assist." }],
                },
                // TODO: Append real history if we store it
            ],
        });

        try {
            const result = await chat.sendMessage(userMessage);
            const response = result.response.text();
            return response;
        } catch (error) {
            console.error("Gemini Error:", error);
            return "Lo siento, tuve un error procesando tu mensaje. ¿Puedes intentarlo de nuevo?";
        }
    }

    // Helper to parse actions from the response (to be called by the route)
    parseAction(response: string) {
        const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch (e) {
                console.error("Failed to parse JSON action", e);
            }
        }
        return null;
    }
}
