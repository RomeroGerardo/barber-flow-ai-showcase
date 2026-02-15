CREATE TABLE IF NOT EXISTS public.configuraciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id TEXT NOT NULL DEFAULT 'default',
    contexto TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id)
);

-- Policy to allow anyone to read (or restrict as needed)
ALTER TABLE public.configuraciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.configuraciones
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Allow authenticated update" ON public.configuraciones
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated insert" ON public.configuraciones
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Insert default config if not exists
INSERT INTO public.configuraciones (business_id, contexto)
VALUES ('default', 'Eres BarberFlow, un asistente virtual profesional de barbería.
Tu objetivo es ayudar a los clientes a agendar citas de manera amable y eficiente.
Siempre confirmas el servicio, fecha y hora antes de agendar.
Responde de forma concisa y natural en español.')
ON CONFLICT (business_id) DO NOTHING;
