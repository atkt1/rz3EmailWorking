-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders"
  ON orders
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to clean up old orders
CREATE OR REPLACE FUNCTION cleanup_old_orders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM orders
  WHERE created_at < NOW() - INTERVAL '2 months';
END;
$$;

-- Create a daily trigger for cleanup (runs at midnight UTC)
CREATE OR REPLACE FUNCTION trigger_cleanup_old_orders()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM cleanup_old_orders();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER cleanup_old_orders_trigger
  AFTER INSERT ON orders
  EXECUTE FUNCTION trigger_cleanup_old_orders();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);
CREATE INDEX IF NOT EXISTS orders_order_id_idx ON orders(order_id);