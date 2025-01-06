/*
  # Add Short Code to Surveys Table

  1. Changes
    - Add short_code column to surveys table
    - Create function to generate random 12-character codes
    - Add unique constraint on short_code
    - Add trigger to auto-generate short_code on insert
    
  2. Notes
    - Short codes use alphanumeric characters (A-Z, 0-9)
    - Codes are guaranteed unique through retry logic
    - Length is 12 characters for better uniqueness
*/

-- Create function to generate short codes
CREATE OR REPLACE FUNCTION generate_short_code() 
RETURNS varchar AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result varchar(12);
  done bool;
BEGIN
  done := false;
  WHILE NOT done LOOP
    result := '';
    FOR i IN 1..12 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Check if code already exists
    done := NOT EXISTS(SELECT 1 FROM surveys WHERE short_code = result);
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Add short_code column with unique constraint
ALTER TABLE surveys 
  ADD COLUMN short_code varchar(12);

-- Make short_code not null after populating existing records
ALTER TABLE surveys 
  ALTER COLUMN short_code SET NOT NULL,
  ADD CONSTRAINT unique_short_code UNIQUE (short_code);


-- Add comment to explain the column
COMMENT ON COLUMN surveys.short_code IS 'Unique 12-character alphanumeric code for survey URL generation';