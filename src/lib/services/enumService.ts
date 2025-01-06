import { supabase } from '../supabase';
import { 
  EnumCache, 
  enumSchema, 
  ENUM_CACHE_KEY, 
  ENUM_VERSION_KEY, 
  ENUM_CACHE_VERSION,
  ENUM_CACHE_DURATION 
} from '../types/enums';
import { useEnumStore } from '../stores/enumStore';

export async function fetchAndCacheEnums(): Promise<EnumCache | null> {
  try {
    // Fetch enums from Supabase
    const { data, error } = await supabase
      .rpc('get_all_enums');

    if (error) throw error;

    // Parse and validate the data
    const enums = enumSchema.parse(data);

    // Store in localStorage with timestamp
    const cacheData = {
      data: enums,
      timestamp: Date.now(),
      version: ENUM_CACHE_VERSION
    };
    
    localStorage.setItem(ENUM_CACHE_KEY, JSON.stringify(cacheData));
    localStorage.setItem(ENUM_VERSION_KEY, ENUM_CACHE_VERSION);

    // Update Zustand store
    useEnumStore.getState().setEnums(enums);

    return enums;
  } catch (error) {
    console.error('Error fetching enums:', error);
    return null;
  }
}

export function getEnumsFromCache(): EnumCache | null {
  try {
    const cacheString = localStorage.getItem(ENUM_CACHE_KEY);
    const version = localStorage.getItem(ENUM_VERSION_KEY);

    if (!cacheString || version !== ENUM_CACHE_VERSION) {
      return null;
    }

    const cache = JSON.parse(cacheString);
    
    // Check if cache has expired
    if (Date.now() - cache.timestamp > ENUM_CACHE_DURATION) {
      localStorage.removeItem(ENUM_CACHE_KEY);
      localStorage.removeItem(ENUM_VERSION_KEY);
      return null;
    }

    return enumSchema.parse(cache.data);
  } catch (error) {
    console.error('Error reading enum cache:', error);
    return null;
  }
}

export function clearEnumCache(): void {
  localStorage.removeItem(ENUM_CACHE_KEY);
  localStorage.removeItem(ENUM_VERSION_KEY);
  useEnumStore.getState().clearEnums();
}