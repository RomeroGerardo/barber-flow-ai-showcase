-- Add DELETE policy for appointments table
-- This allows authenticated users to delete appointments

-- Drop if exists (idempotent)
drop policy if exists "Allow authenticated delete" on appointments;

-- Create delete policy
create policy "Allow authenticated delete"
  on appointments for delete
  to authenticated
  using (true);
