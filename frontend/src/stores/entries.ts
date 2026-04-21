import { defineStore } from "pinia";
import { ref } from "vue";

import api from "@/api";

interface Tag {
  id: string;
  name: string;
}

export interface Entry {
  id: string;
  content: string;
  date: string;
  tags: Tag[];
}

export const useEntriesStore = defineStore("entries", () => {
  const entries = ref<Entry[]>([]);
  const isLoading = ref<boolean>(false);

  //
  //
  // ACTIONS
  //
  //
  const fetchEntries = async () => {
    try {
      isLoading.value = true;

      const { data } = await api.get("/api/entries");
      entries.value = data;
    } catch (e) {
      console.error("Ошибка загрузки записей:", e);
    } finally {
      isLoading.value = false;
    }
  };

  const getEntriesByDate = (key: Date) => {
    const keyDate = `${key.getFullYear()}-${key.getMonth() + 1}-${key.getDate()}`; // YYYY-MM-DD
    const filtered = entries.value.length
      ? entries.value.filter((entry) => {
          const entryDate = new Date(entry.date);
          const entryDateFormated = `${entryDate.getFullYear()}-${entryDate.getMonth() + 1}-${entryDate.getDate()}`;
          return entryDateFormated === keyDate;
        })
      : [];

    return filtered;
  };

  const deleteEntry = async (id: string) => {
    try {
      await api.delete(`/api/entries/${id}`);
      entries.value = entries.value.filter((entry) => entry.id !== id);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Не удалось удалить запись");
    }
  };

  return {
    entries,
    isLoading,
    getEntriesByDate,
    fetchEntries,
    deleteEntry,
  };
});
