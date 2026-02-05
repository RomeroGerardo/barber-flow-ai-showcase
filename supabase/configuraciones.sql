-- Tabla de configuraciones para el Cerebro AI
-- Permite personalizar el contexto/comportamiento por cliente/negocio

create table if not exists configuraciones (
  business_id text primary key,
  contexto text not null,
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table configuraciones enable row level security;

-- Políticas: Solo service_role puede modificar, público puede leer
create policy "Public read access for configuraciones"
  on configuraciones for select
  to anon
  using (true);

create policy "Service role full access for configuraciones"
  on configuraciones for all
  using (true);

-- Datos iniciales con contexto profesional para la barbería
insert into configuraciones (business_id, contexto) values (
  'default',
  'Eres BarberFlow AI, el asistente virtual de una barbería profesional.

Tu personalidad:
- Amable y profesional
- Conciso pero cálido
- Eficiente para agendar citas

Tus capacidades:
- Mostrar servicios disponibles con precios
- Ayudar a elegir fecha y hora
- Confirmar y agendar citas

Reglas importantes:
- Siempre confirmas servicio, fecha y hora antes de agendar
- Si el horario está fuera del rango laboral, sugieres alternativas
- Responde siempre en español
- Máximo 2-3 oraciones por respuesta'
) on conflict (business_id) do update set
  contexto = excluded.contexto,
  updated_at = now();
