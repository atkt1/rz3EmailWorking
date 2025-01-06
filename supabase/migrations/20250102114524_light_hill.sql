-- Create a new Supabase Edge Function for optimized data fetching
create or replace function get_survey_with_products(survey_short_code text)
returns json
language plpgsql
security definer
as $$
begin
  return (
    select 
      json_build_object(
        'id', s.id,
        'survey_name', s.survey_name,
        'survey_style', s.survey_style,
        'logo_path', s.logo_path,
        'survey_status', s.survey_status,
        'minimum_review_length', s.minimum_review_length,
        'minimum_star_rating', s.minimum_star_rating,
        'time_delay', s.time_delay,
        'user_id', s.user_id,
        'products', (
          select json_agg(
            json_build_object(
              'id', p.id,
              'name', p.name,
              'image_path', p.image_path,
              'thumbnail_path', p.thumbnail_path,
              'marketplace', p.marketplace,
              'marketplace_product_id', p.marketplace_product_id
            )
          )
          from survey_products sp
          join products p on p.id = sp.product_id
          where sp.survey_id = s.id
        )
      )
    from surveys s
    where s.short_code = survey_short_code
    limit 1
  );
end;
$$;