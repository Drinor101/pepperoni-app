-- Add password column to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- Update existing users with default passwords
UPDATE users SET password = 'admin' WHERE username = 'admin';
UPDATE users SET password = 'staff' WHERE username = 'staff';
UPDATE users SET password = 'driver' WHERE username = 'driver';

-- Make password column NOT NULL after setting values
ALTER TABLE users ALTER COLUMN password SET NOT NULL; 