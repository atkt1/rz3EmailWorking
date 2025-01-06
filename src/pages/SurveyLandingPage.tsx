import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useSurveyData } from '@/lib/hooks/useSurveyData';
import { SurveyPaused } from '@/components/surveys/landing/SurveyPaused';
import { SurveyForm } from '@/components/surveys/landing/SurveyForm';
import { LoadingState } from '@/components/surveys/landing/LoadingState';
import { ErrorState } from '@/components/surveys/landing/ErrorState';

export function SurveyLandingPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { 
    data: survey,
    isLoading,
    isError,
    error,
    refetch
  } = useSurveyData(shortCode);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState 
        message={error instanceof Error ? error.message : 'Failed to load survey'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!survey) {
    return (
      <ErrorState message="Survey not found" />
    );
  }

  if (survey.survey_status === 'PAUSED') {
    return <SurveyPaused logo={survey.logo_path} />;
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <SurveyForm survey={survey} />
    </Suspense>
  );
}