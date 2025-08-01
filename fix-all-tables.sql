-- Drop existing tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS locations CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS set_order_number() CASCADE;

-- Create tables
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  manager TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (only for admin)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff table (for staff members)
CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location_id UUID REFERENCES locations(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers table (for drivers)
CREATE TABLE IF NOT EXISTS drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT CHECK (status IN ('i_lire', 'ne_delivery')) DEFAULT 'i_lire',
  location_id UUID REFERENCES locations(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number INTEGER UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  location_id UUID REFERENCES locations(id) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pranuar', 'konfirmuar', 'ne_delivery', 'perfunduar')) DEFAULT 'pranuar',
  assigned_driver_id UUID REFERENCES drivers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estimated_delivery TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_location_id ON orders(location_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_driver_id ON orders(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_drivers_location_id ON drivers(location_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_staff_location_id ON staff(location_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Insert sample data
INSERT INTO locations (name, address, phone, manager) VALUES
  ('Pepperoni Pizza - Arbëri', 'Rr. Arbëri, Prishtinë', '049500600', 'Blerjan Gashi'),
  ('Pepperoni Pizza - Qendra', 'Rr. Nëna Terezë, Prishtinë', '044123456', 'Ardian Krasniqi'),
  ('Pepperoni Pizza - Ulpianë', 'Rr. Ilir Konushevci, Prishtinë', '049789012', 'Elda Berisha');

-- Insert admin user
INSERT INTO users (username, password, role) VALUES
  ('admin', 'admin', 'admin');

-- Insert sample staff
INSERT INTO staff (username, password, name, phone, location_id) VALUES
  ('staff1', 'staff1', 'Blerjan Gashi', '049500600', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Arbëri')),
  ('staff2', 'staff2', 'Ardian Krasniqi', '044123456', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Qendra'));

-- Insert sample drivers
INSERT INTO drivers (username, password, name, phone, status, location_id) VALUES
  ('driver1', 'driver1', 'Ardian Krasniqi', '044123456', 'i_lire', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Qendra')),
  ('driver2', 'driver2', 'Blerim Berisha', '049789012', 'i_lire', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Ulpianë')),
  ('driver3', 'driver3', 'Elda Gashi', '049500600', 'i_lire', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Arbëri'));

-- Insert sample orders
INSERT INTO orders (order_number, customer_name, customer_phone, address, location_id, total, status, estimated_delivery) VALUES
  (601, 'Blerjan Gashi', '049500600', 'Bajram Kelmendi Nr.20', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Arbëri'), 8.50, 'perfunduar', NOW() + INTERVAL '45 minutes'),
  (602, 'Ardian Krasniqi', '044123456', 'Rr. Nëna Terezë 15', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Qendra'), 6.80, 'perfunduar', NOW() + INTERVAL '40 minutes'),
  (603, 'Elda Berisha', '049789012', 'Rr. Ilir Konushevci 8', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Ulpianë'), 5.00, 'perfunduar', NOW() + INTERVAL '35 minutes');

-- Insert sample order items
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  ((SELECT id FROM orders WHERE order_number = 601), 'Pizza Margherita', 1, 3.50),
  ((SELECT id FROM orders WHERE order_number = 601), 'Hamburger Classic', 2, 2.50),
  ((SELECT id FROM orders WHERE order_number = 602), 'Pizza Pepperoni', 1, 4.00),
  ((SELECT id FROM orders WHERE order_number = 602), 'Samun Special', 1, 2.80),
  ((SELECT id FROM orders WHERE order_number = 603), 'Sandwich Mix', 2, 2.50);

-- Enable Row Level Security (RLS)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic ones - you can customize based on your needs)
CREATE POLICY "Allow all operations for authenticated users" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON staff FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON drivers FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON order_items FOR ALL USING (true);

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS INTEGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(order_number), 600) + 1 INTO next_number FROM orders;
  RETURN next_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number(); 