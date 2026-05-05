import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

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
  addEntry: (content: string, date: string, tags: string[]) => Promise<boolean>;
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

  addEntry: async (content: string, date: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/entries", { content, date, tags: [] });
      set((state) => ({
        entries: [
          ...state.entries,
          { content, date, id: Math.floor(Math.random() * 10000), tags: [] },
        ],
      }));
      return true; // если успешно добавили запись
    } catch (e: any) {
      console.error("Ошибка добавления записи:", e.message);
      set({ error: "Ошибка добавления записи" });
      return false; // если ошибка добавления записи
    } finally {
      set({ isLoading: false });
    }
  },
}));
