import { create } from 'zustand';

interface OrderSearchStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useOrderSearchStore = create<OrderSearchStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export function useOrderSearch() {
  const { searchQuery, setSearchQuery } = useOrderSearchStore();
  return { searchQuery, setSearchQuery };
}