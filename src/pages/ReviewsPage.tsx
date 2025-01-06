import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';
import { EmptyState } from '@/components/empty-states/EmptyState';
import { ReviewList } from '@/components/reviews/ReviewList';
import { supabase } from '@/lib/supabase';

export function ReviewsPage() {
  const [hasReviews, setHasReviews] = useState<boolean | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkReviews() {
      if (!user) return;

      try {
        const { count } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setHasReviews(count ? count > 0 : false);
      } catch (error) {
        console.error('Error checking reviews:', error);
        setHasReviews(false);
      }
    }

    checkReviews();
  }, [user]);

  if (hasReviews === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!hasReviews) {
    return (
      <EmptyState
        icon={Star}
        title="No Reviews Collected"
        description="Waiting for someone to respond to a survey."
        actionLabel="Create Survey"
        onAction={() => navigate('/dashboard/surveys/new')}
      />
    );
  }

  return <ReviewList />;
}