import { WhatsappSimulator } from "@/components/demo/whatsapp-simulator";

export default function WhatsappDemoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Simulador de WhatsApp</h1>
        <p className="text-muted-foreground mt-1">
          Prueba cómo la inteligencia artificial interactúa con tus clientes de forma automática.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Dispositivo simulado */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <WhatsappSimulator />
        </div>
        
        {/* Explicación de capacidades */}
        <div className="flex-1 bg-card border border-border p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">¿Qué está pasando aquí?</h3>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">1</div>
              <p>El bot entiende lenguaje natural. Prueba escribirle como si fueras un cliente ("quiero cortarme el pelo").</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">2</div>
              <p>Detecta automáticamente los huecos libres en tu agenda real y se los ofrece al cliente.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">3</div>
              <p>Cuando el cliente confirma, el turno aparece instantáneamente en la pestaña "Agenda".</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">4</div>
              <p>Si envían un audio, la IA lo transcribe y lo responde sin problemas (simulado en demo).</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
