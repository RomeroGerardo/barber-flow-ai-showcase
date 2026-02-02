-- Fix RLS Policy for Appointments
-- Run this script in the Supabase SQL Editor

-- 1. Drop the restrictive policy that only allows anonymous users
drop policy if exists "Allow public inserts" on appointments;

-- 2. Create a new policy that allows EVERYONE (public) to insert
-- "public" role includes both "anon" (not logged in) and "authenticated" (logged in)
create policy "Allow public inserts"
  on appointments for insert
  to public
  with check (true);
