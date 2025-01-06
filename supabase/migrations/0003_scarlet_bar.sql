/*
  # Update get_all_enums function
  
  Updates the get_all_enums function to include new enum types:
  - time_delay
  - minimum_review_length
  - minimum_star_rating
*/

CREATE OR REPLACE FUNCTION get_all_enums()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'marketplace', ARRAY(SELECT unnest(enum_range(NULL::marketplace))),
      'plan_name', ARRAY(SELECT unnest(enum_range(NULL::plan_name))),
      'subscription_status', ARRAY(SELECT unnest(enum_range(NULL::subscription_status))),
      'survey_status', ARRAY(SELECT unnest(enum_range(NULL::survey_status))),
      'survey_style', ARRAY(SELECT unnest(enum_range(NULL::survey_style))),
      'voucher_status', ARRAY(SELECT unnest(enum_range(NULL::voucher_status))),
      'giveaway', ARRAY(SELECT unnest(enum_range(NULL::giveaway))),
      'package_insert_style_size', ARRAY(SELECT unnest(enum_range(NULL::package_insert_style_size))),
      'frequency', ARRAY(SELECT unnest(enum_range(NULL::frequency))),
      'boolean_enum', ARRAY(SELECT unnest(enum_range(NULL::boolean_enum))),
      'time_delay', ARRAY(SELECT unnest(enum_range(NULL::time_delay))),
      'minimum_review_length', ARRAY(SELECT unnest(enum_range(NULL::minimum_review_length))),
      'minimum_star_rating', ARRAY(SELECT unnest(enum_range(NULL::minimum_star_rating)))
    )
  );
END;
$$;