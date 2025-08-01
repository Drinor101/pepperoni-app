-- Clear all orders and order items
DELETE FROM order_items;
DELETE FROM orders;

-- Reset order numbering to start from 0 (or 1)
-- Drop and recreate the function to start from 0
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;

-- Create new function that starts from 0
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS INTEGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(order_number), 0) + 1 INTO next_number FROM orders;
  RETURN next_number;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
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