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
      'boolean_enum', ARRAY(SELECT unnest(enum_range(NULL::boolean_enum)))
    )
  );
END;
$$;