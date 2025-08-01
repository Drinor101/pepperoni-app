-- Add password column to drivers table
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'driver123';

-- Update existing drivers with a default password
UPDATE drivers SET password = 'driver123' WHERE password IS NULL;

-- Add comment to document the change
COMMENT ON COLUMN drivers.password IS 'Password for driver login'; 