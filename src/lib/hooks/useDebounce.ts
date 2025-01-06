import { useCallback } from 'react';
import debounce from 'lodash/debounce';

export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    debounce((...args: Parameters<T>) => callback(...args), delay),
    [callback, delay]
  );
}