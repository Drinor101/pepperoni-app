-- Clear all existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM drivers;
DELETE FROM users;

-- Insert test users
INSERT INTO users (username, role, location_id) VALUES
('admin', 'admin', NULL),
('staff', 'staff', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Arbëri' LIMIT 1)),
('driver', 'driver', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Arbëri' LIMIT 1));

-- Insert test drivers (all using the same location to avoid null constraint)
INSERT INTO drivers (name, phone, status, location_id) VALUES
('Artan Gashi', '049123456', 'i_lire', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Arbëri' LIMIT 1)),
('Blerim Krasniqi', '049654321', 'i_lire', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Arbëri' LIMIT 1)),
('Dardan Rexhepi', '049789123', 'i_lire', (SELECT id FROM locations WHERE name = 'Pepperoni Pizza - Arbëri' LIMIT 1));

-- Database is now clean and ready for testing! 