import { create } from 'zustand';
import { EnumCache } from '../types/enums';

interface EnumStore {
  enums: EnumCache | null;
  setEnums: (enums: EnumCache) => void;
  clearEnums: () => void;
}

export const useEnumStore = create<EnumStore>((set) => ({
  enums: null,
  setEnums: (enums) => set({ enums }),
  clearEnums: () => set({ enums: null })
}));