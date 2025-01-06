import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useEnumStore } from '@/lib/stores/enumStore';

export function useFilteredGiveaways() {
  const { user } = useAuth();
  const enums = useEnumStore((state) => state.enums);

  return useQuery({
    queryKey: ['filtered-giveaways', user?.id],
    queryFn: async () => {
      if (!user || !enums?.giveaway) return [];

      // Get available vouchers (not tied to user)
      const { data: voucherData, error: voucherError } = await supabase
        .from('vouchers')
        .select('giveaway')
        .eq('status', 'Available')
        .is('review_id', null);

      if (voucherError) throw voucherError;

      // Get available coupons for user
      const { data: couponData, error: couponError } = await supabase
        .from('coupons')
        .select('giveaway')
        .eq('status', 'Available')
        .eq('user_id', user.id)
        .is('review_id', null);

      if (couponError) throw couponError;

      // Combine available giveaways from both sources
      const availableGiveaways = new Set([
        ...voucherData.map(v => v.giveaway),
        ...couponData.map(c => c.giveaway)
      ]);

      // Filter enum values based on availability
      return enums.giveaway.filter(giveaway => {
        // Allow all "Rs" values
        //if (giveaway.endsWith('Rs')) return true;
        // For GET* values, check if they exist in available vouchers/coupons
        return availableGiveaways.has(giveaway);
      });
    },
    enabled: !!user && !!enums?.giveaway
  });
}
