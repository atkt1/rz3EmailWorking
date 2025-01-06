/*
  # Orders Management Setup

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `order_id` (varchar, unique per user)
      - `marketplace` (marketplace)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `orders` table
    - Add policies for authenticated users to manage their orders

  3. Functions
    - Add function to clean up old orders
    - Add scheduled job for cleanup
*/

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

-- Schedule cleanup job (runs daily at midnight UTC)
SELECT cron.schedule(
  'cleanup-old-orders',
  '0 0 * * *',
  'SELECT cleanup_old_orders();'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);
CREATE INDEX IF NOT EXISTS orders_order_id_idx ON orders(order_id);