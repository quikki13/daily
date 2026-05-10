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
  isInited: boolean;
  selectedDate: string | null;
  error: string | null;
  fetchEntries: () => Promise<void>;
  deleteEntry: (id: number | string) => Promise<boolean>; 
  updateEntry: (id: string, updatedData: IUpdatedData) => Promise<boolean>;
  addEntry: (content: string, date: string, tags: string[]) => Promise<boolean>;
  setSelectedDate: (date: string | null) => void;
}

interface IUpdatedData {
  content: string;
  date?: string; // в целом можно, но мы не будем передавать, чтобы не лоамать логику и не перебрасывать заметку между днями
  tags: string[];
}

export const useEntriesStore = create<EntryState>((set) => ({
  entries: [],
  isLoading: false,
  isInited: false,
  selectedDate: null, // для фильтра по дням - по умолчанию выключен
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
      set((state) => ({ isLoading: !state.isLoading, isInited: true }));
    }
  },

  updateEntry: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/entries/${id}`, updatedData);

      const response = await api.get("/entries");
      set({ entries: response.data, isLoading: false });

      return true; // success
    } catch (e: any) {
      console.error("Ошибка редактирования записи:", e.message);
      set({ error: "Ошибка редактирования записи", isLoading: false });
      return false; // если ошибка редактирования записи
    }
  },

  addEntry: async (content, date, tags = []) => {
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

  deleteEntry: async (id: string | number) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/entries/${id}`);

      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
      }));
      return true; // запись удалена успешно
    } catch (e: any) {
      console.error("Ошибка удаления записи:", e.message);
      set({ error: "Ошибка удаления записи" });
      return false; // еошибка удаления
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedDate: (date) => set({ selectedDate: date }),
}));
