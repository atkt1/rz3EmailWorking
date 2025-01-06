import { useEffect } from 'react';
import { useEnumStore } from '../stores/enumStore';
import { fetchAndCacheEnums, getEnumsFromCache } from '../services/enumService';

export function useEnums() {
  const { enums, setEnums } = useEnumStore();

  useEffect(() => {
    async function initializeEnums() {
      if (enums) return;

      // Try to get from cache first
      const cachedEnums = getEnumsFromCache();
      if (cachedEnums) {
        setEnums(cachedEnums);
        return;
      }

      // If not in cache, fetch from API
      const freshEnums = await fetchAndCacheEnums();
      if (freshEnums) {
        setEnums(freshEnums);
      }
    }

    initializeEnums();
  }, [enums, setEnums]);

  return enums;
}