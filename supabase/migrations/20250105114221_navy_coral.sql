/*
  # Add emails table and related functionality
  
  1. New Tables
    - `emails`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `survey_id` (uuid, references surveys) 
      - `review_id` (uuid, references reviews)
      - `coupon_code` (varchar)
      - `status` (email_status enum)
      - `created_at` (timestamptz)
      - `sent_at` (timestamptz)
      - `delay` (integer)

  2. New Enums
    - `email_status`: Pending, Sent, Failed

  3. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create email status enum
CREATE TYPE email_status AS ENUM ('Pending', 'Sent', 'Failed');

-- Create emails table
CREATE TABLE emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  survey_id uuid REFERENCES surveys(id) ON DELETE CASCADE,
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  coupon_code varchar,
  status email_status DEFAULT 'Pending',
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz,
  delay integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own emails"
  ON emails
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emails"
  ON emails
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emails"
  ON emails
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for better query performance
CREATE INDEX emails_user_id_idx ON emails(user_id);
CREATE INDEX emails_status_idx ON emails(status);
CREATE INDEX emails_created_at_idx ON emails(created_at);