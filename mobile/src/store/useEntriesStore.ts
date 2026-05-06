import { create } from "zustand";

import { api } from "@/api";
import { getUUID } from "@/utils/common";

export interface Entry {
  content: string;
  date: string;
  tags: Tag[];
  id: string | number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
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

  addEntry: async (content: string, date: string, tags: string[] = []) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/entries", { content, date, tags });

      const updTags = tags.map((tag) => {
        return { name: tag, id: getUUID() };
      });
      set((state) => ({
        entries: [
          ...state.entries,
          {
            content,
            date,
            id: Math.floor(Math.random() * 10000),
            tags: updTags,
          },
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
