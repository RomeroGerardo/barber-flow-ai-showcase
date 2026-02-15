-- Add payment columns to appointments table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending', -- pending, approved, rejected, none
ADD COLUMN IF NOT EXISTS payment_id text,
ADD COLUMN IF NOT EXISTS preference_id text,
ADD COLUMN IF NOT EXISTS deposit_amount numeric,
ADD COLUMN IF NOT EXISTS total_amount numeric;

-- Comment on columns
COMMENT ON COLUMN appointments.payment_status IS 'Status of the payment: pending, approved, rejected, none';
