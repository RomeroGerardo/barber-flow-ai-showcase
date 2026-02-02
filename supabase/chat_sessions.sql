-- Create table to store WhatsApp/Chat session state
create table if not exists chat_sessions (
  phone_number text primary key,
  current_step text not null default 'GREETING',
  collected_data jsonb default '{}'::jsonb,
  history jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table chat_sessions enable row level security;

-- Policies (Open for service role/admin, restricted for public if needed, but for webhook mostly admin)
create policy "Enable all for authenticated/service_role" 
  on chat_sessions for all 
  using (true);

-- Optional: Allow public to insert (for initial webhook contact if auth is handled elsewhere) or keep strict. 
-- For this demo, assuming the API route uses service_role key to access this table.
