import { create } from "zustand";
import { api } from "../api";

export interface Entry {
  content: string;
  date: string;
  id: string | number;
}

interface EntryState {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
}

export const useEntriesStore = create<EntryState>((set) => ({
  entries: [],
  isLoading: false,
  error: "",

  fetchEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/entries");
      set((_state) => ({ entries: response.data }));
    } catch (e: any) {
      console.error("Ошибка загрузки:", e.message);
      set({ error: "Ошибка загрузки записей" });
    } finally {
      set((state) => ({ isLoading: !state.isLoading }));
    }
  },
}));
