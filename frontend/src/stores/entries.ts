import { defineStore } from "pinia";
import { ref, computed } from "vue";

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

  const selectedTags = ref<string[]>([]);

  //
  //
  // ACTIONS
  //
  //
  const fetchEntries = async () => {
    try {
      isLoading.value = true;

      const params = new URLSearchParams();

      if (selectedTags.value.length) {
        params.append("tags", selectedTags.value.join(","));
      }

      const { data } = await api.get(`/api/entries?${params.toString()}`);
      entries.value = data;
    } catch (e) {
      console.error("Ошибка загрузки записей:", e);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Метод получения всех уникальных тэгов из уже загруженных записей
   */
  const allUniqueTags = computed(() => {
    const set = new Set<string>();

    if (!entries.value.length) {
      return [];
    } else {
      entries.value.forEach(({ tags }) => {
        if (tags.length) {
          tags.forEach(({ name }) => {
            set.add(name);
          });
        }
      });

      return Array.from(set).sort();
    }
  });

  /**
   * Метод удаления/добавления тэгов в UI
   */
  const toggleTag = (tagName: string) => {
    const index = selectedTags.value.findIndex((tag) => tag === tagName);

    if (index >= 0) {
      // тут мутируем selectedTags - это ок
      // оно нам и надо чтобы реактивно список тэгов обновить
      selectedTags.value.splice(index, 1);
    } else {
      selectedTags.value.push(tagName);
    }
    // После изменения фильтров сразу обновляем данные
    fetchEntries();
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

  const updateEntry = async (
    id: string,
    updateData: { content: string; date: string; tags: string[] },
  ) => {
    try {
      const { data }: { data: Entry } = await api.put(`/api/entries/${id}`, {
        content: updateData.content,
        date: updateData.date,
        tags: updateData.tags,
      });

      entries.value = entries.value.map((entry) =>
        entry.id === data.id ? data : entry,
      );
    } catch (error) {
      console.error("Ошибка при редактировании", error);
      throw error;
    }
  };

  return {
    entries,
    allUniqueTags,
    selectedTags,
    isLoading,
    toggleTag,
    getEntriesByDate,
    fetchEntries,
    deleteEntry,
    updateEntry,
  };
});
