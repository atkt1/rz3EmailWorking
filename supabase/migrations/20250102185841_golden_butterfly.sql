/*
  # Add Package Inserts Table

  1. New Tables
    - `package_inserts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `style` (text)
      - `survey_id` (uuid, foreign key)
      - `include_logo` (boolean)
      - `background_color` (text)
      - `headline` (text)
      - `subtitle` (text)
      - `url` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `package_inserts` table
    - Add policies for authenticated users
*/

-- Create package_inserts table
CREATE TABLE IF NOT EXISTS package_inserts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  style text NOT NULL,
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  include_logo boolean DEFAULT true,
  background_color text NOT NULL,
  headline text NOT NULL,
  subtitle text NOT NULL,
  url text,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE package_inserts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own package inserts"
  ON package_inserts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own package inserts"
  ON package_inserts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own package inserts"
  ON package_inserts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own package inserts"
  ON package_inserts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER set_package_inserts_updated_at
  BEFORE UPDATE ON package_inserts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();