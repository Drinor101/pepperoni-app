-- Create tables
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  manager TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'staff', 'driver')) NOT NULL,
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
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

-- Enable Row Level Security (RLS)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent execution)
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON locations;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON drivers;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON staff;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON orders;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON order_items;

-- Create RLS policies (basic ones - you can customize based on your needs)
CREATE POLICY "Allow all operations for authenticated users" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON drivers FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON staff FOR ALL USING (true);
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