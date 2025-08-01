-- Add password column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'admin';

-- Update existing admin user with password
UPDATE users SET password = 'admin' WHERE username = 'admin';

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location_id UUID REFERENCES locations(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for staff table
CREATE INDEX IF NOT EXISTS idx_staff_location_id ON staff(location_id);

-- Enable RLS for staff table
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for staff table
CREATE POLICY "Allow all operations for authenticated users" ON staff FOR ALL USING (true);

-- Insert sample staff
INSERT INTO staff (username, password, name, phone, location_id) VALUES
  ('staff1', 'staff1', 'Blerjan Gashi', '049500600', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Arbëri')),
  ('staff2', 'staff2', 'Ardian Krasniqi', '044123456', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Qendra')); 