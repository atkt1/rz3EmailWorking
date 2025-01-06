import { useEffect, useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';
import { EmptyState } from '@/components/empty-states/EmptyState';
import { SurveyList } from '@/components/surveys/SurveyList';
import { getSurveys, deleteSurvey, toggleSurveyStatus } from '@/lib/services/surveyService';
import type { Survey } from '@/lib/types/survey';

export function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSurveys() {
      if (!user) return;
      
      try {
        const data = await getSurveys(user.id);
        setSurveys(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load surveys');
      } finally {
        setIsLoading(false);
      }
    }

    loadSurveys();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      await deleteSurvey(id, user.id);
      setSurveys(surveys.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete survey');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'ACTIVE' | 'PAUSED') => {
    if (!user) return;
    
    try {
      const newStatus = await toggleSurveyStatus(id, user.id, currentStatus);
      setSurveys(surveys.map(survey => 
        survey.id === id 
          ? { ...survey, survey_status: newStatus }
          : survey
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update survey status');
    }
  };

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!isLoading && surveys.length === 0) {
    return (
      <EmptyState
        icon={FileSpreadsheet}
        title="No Surveys Created"
        description="Create your first survey to start collecting reviews."
        actionLabel="Create Survey"
        onAction={() => navigate('/dashboard/surveys/new')}
      />
    );
  }

  return (
    <SurveyList 
      surveys={surveys} 
      onDelete={handleDelete}
      onToggleStatus={handleToggleStatus}
      isLoading={isLoading}
    />
  );
}