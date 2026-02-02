-- Create settings table for key-value storage (e.g., working hours)
create table if not exists settings (
  key text primary key,
  value jsonb
);

-- Enable RLS
alter table settings enable row level security;

-- Policies
create policy "Allow public read settings" 
  on settings for select 
  to anon, authenticated 
  using (true);

create policy "Allow admin all settings" 
  on settings for all 
  to authenticated 
  using (true);

-- Seed Initial Working Hours (Example: 9am - 8pm)
insert into settings (key, value) 
values ('working_hours', '{"start": "09:00", "end": "20:00"}'::jsonb) 
on conflict (key) do nothing;
