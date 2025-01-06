import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { PackageInsert } from '../types/packageInsert';

export function usePackageInsert(id: string | undefined) {
  return useQuery({
    queryKey: ['package-insert', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('package_inserts')
        .select(`
          *,
          survey:surveys (
            url,
            logo_path
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        surveyUrl: data.survey?.url,
        surveyLogoPath: data.survey?.logo_path
      };
    },
    enabled: !!id,
    staleTime: 0,
    cacheTime: 0
  });
}
