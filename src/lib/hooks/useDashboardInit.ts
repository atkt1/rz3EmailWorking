import { useEffect, useState } from 'react';
import { useEnums } from './useEnums';

export function useDashboardInit() {
  const [isLoading, setIsLoading] = useState(true);
  const enums = useEnums();

  useEffect(() => {
    if (enums) {
      setIsLoading(false);
    }
  }, [enums]);

  return {
    isLoading,
  };
}