import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

export function useActiveSurveys() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['active-surveys', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('surveys')
        .select('id, survey_name')
        .eq('user_id', user.id)
        .eq('survey_status', 'ACTIVE')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
}