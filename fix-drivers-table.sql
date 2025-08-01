-- Add username and password columns to drivers table
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'driver123';

-- Update existing drivers with default values
UPDATE drivers SET username = 'driver_' || id WHERE username IS NULL;
UPDATE drivers SET password = 'driver123' WHERE password IS NULL;

-- Add comments to document the changes
COMMENT ON COLUMN drivers.username IS 'Username for driver login';
COMMENT ON COLUMN drivers.password IS 'Password for driver login';

-- Make username NOT NULL after setting default values
ALTER TABLE drivers ALTER COLUMN username SET NOT NULL; 