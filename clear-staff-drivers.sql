-- Clear existing staff and drivers for manual creation
DELETE FROM staff;
DELETE FROM drivers;

-- Reset sequences if any (optional)
-- ALTER SEQUENCE IF EXISTS staff_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS drivers_id_seq RESTART WITH 1; 