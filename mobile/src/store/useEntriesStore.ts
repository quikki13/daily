import { create } from "zustand";
import { LayoutAnimation } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { QUEUE_STORAGE_KEY } from "@/consts/common";
import { api } from "@/api";
import { getUUID } from "@/utils/common";

export interface Entry {
  content: string;
  date: string;
  tags: Tag[];
  id: string | number;
}
export type OfflineMutation = {
  type: "add" | "update" | "delete";
  isPersisted: boolean;
  payload: any;
};

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface EntryState {
  isOnline: boolean;
  localEntries: OfflineMutation[];
  isSyncing: boolean;

  entries: Entry[];
  tagsIndex: Record<string, string[]>;
  isLoading: boolean;
  isInited: boolean;
  selectedDate: string | null;
  error: string | null;
  fetchEntries: () => Promise<void>;
  deleteEntry: (id: number | string) => Promise<boolean>;
  updateEntry: (id: string, updatedData: IUpdatedData) => Promise<boolean>;
  addEntry: (content: string, date: string, tags: string[]) => Promise<boolean>;
  setSelectedDate: (date: string | null) => void;
  setIsOnline: (isOnline: boolean) => void;

  loadFromStorage: () => Promise<void>;
  addMutation: (mutation: OfflineMutation) => void;
  persistQueue: (queue: OfflineMutation[]) => void;
  syncOfflineMutations: () => void;
}

interface IUpdatedData {
  content: string;
  date?: string; // в целом можно, но мы не будем передавать, чтобы не лоамать логику и не перебрасывать заметку между днями
  tags: string[];
}

const generateTagsIndex = (entries: Entry[]) => {
  const index: Record<string, string[]> = {}; // Ключ: строка (тэг), Значение: массив ID

  for (const entry of entries) {
    if (!entry.tags || entry.tags.length === 0) continue;

    for (const tag of entry.tags) {
      const normalizedTag = tag.name.toLowerCase();

      // Если такого тэга еще нет в словаре, создаем пустой массив
      if (!index[normalizedTag]) {
        index[normalizedTag] = [];
      }
      // Добавляем ID записи в массив этого тэга
      index[normalizedTag].push(entry.id.toString());
    }
  }

  return index;
};

export const useEntriesStore = create<EntryState>((set, get) => ({
  isOnline: false,
  entries: [],
  tagsIndex: {},
  isLoading: false,
  isInited: false,
  selectedDate: null, // для фильтра по дням - по умолчанию выключен
  error: "",

  fetchEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/entries");
      set((_state) => ({
        entries: response.data,
        tagsIndex: generateTagsIndex(response.data),
      }));
    } catch (e: any) {
      console.error("Ошибка загрузки:", e.message);
      set({ error: "Ошибка загрузки записей" });
    } finally {
      set((state) => ({ isLoading: !state.isLoading, isInited: true }));
    }
  },

  updateEntry: async (id: string | number, updatedData) => {
    const { isOnline, entries, localEntries, persistQueue } = get();

    const isTemp = id.toString().startsWith("temp-");
    const updatedPayload = {
      id,
      ...updatedData,
      tags: updatedData.tags.map((tag) => {
        return { name: tag, id: getUUID() };
      }),
    };

    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedPayload } : entry,
      ),
    }));

    if (isTemp) {
      get().addMutation({
        type: "update",
        isPersisted: false,
        payload: updatedPayload,
      });

      return true;
    } else {
      const mutation: OfflineMutation = {
        type: "update",
        isPersisted: true,
        payload: updatedPayload,
      };

      if (isOnline) {
        try {
          await api.put(`/entries/${id}`, updatedPayload);
          const updatedQueue = localEntries.filter((m) => m.payload.id !== id);
          if (updatedQueue.length !== localEntries.length) {
            set({ localEntries: updatedQueue });
            await persistQueue(updatedQueue);
          }
        } catch (e) {
          get().addMutation(mutation);
        }
      } else {
        get().addMutation(mutation);
      }

      return true;
    }
  },

  addEntry: async (content, date, tags = []) => {
    const newEntry = {
      id: `temp-id:${getUUID()}`, // Временный ID
      content,
      date,
      tags: tags.map((tag) => {
        return { name: tag, id: getUUID() };
      }),
    };
    // set({ isLoading: true, error: null });
    // Optimistic Update
    set((state) => ({ entries: [newEntry, ...state.entries] }));

    if (get().isOnline) {
      try {
        await api.post("/entries", { ...newEntry, tags });
      } catch (e) {
        // Если запрос упал (например, сервер 500), сохраняем в офлайн
        get().addMutation({
          type: "add",
          isPersisted: false,
          payload: newEntry,
        });
      }
    } else {
      get().addMutation({
        type: "add",
        isPersisted: false,
        payload: newEntry,
      });
    }

    return true;
  },

  deleteEntry: async (id: string | number) => {
    const { isOnline, localEntries, entries, persistQueue } = get();

    // Определяем, является ли ID временным
    const isTemp = id.toString().startsWith("temp-");

    // Optimistic Update
    const updatedEntries = entries.filter((e) => e.id !== id);
    set({ entries: updatedEntries });

    if (isTemp) {
      // Удаление записи, созданной в офлайне
      // Нужно найти и удалить операцию 'add'/'update' из очереди
      const updatedQueue = localEntries.filter(
        (item) => item.payload.id !== id,
      );

      set({ localEntries: updatedQueue });
      await persistQueue(updatedQueue);

      // На сервер ничего не шлем
      return true;
    } else {
      // удаление записи, которая уже есть в БД
      const mutation: OfflineMutation = {
        type: "delete",
        isPersisted: true,
        payload: { id },
      };

      if (isOnline) {
        try {
          await api.delete(`/entries/${id}`);
          // Если запрос успешен, очередь не трогаем (или чистим, если там был update)
          const updatedQueue = localEntries.filter(
            (item) => item.payload.id !== id,
          );
          set({ localEntries: updatedQueue });
          await persistQueue(updatedQueue);
        } catch (e) {
          // Если сервер упал, кладем удаление в очередь
          get().addMutation(mutation);
        }
      } else {
        // Если офлайн — сохраняем намерение удалить в очередь
        get().addMutation(mutation);
      }
      return true;
    }
  },

  setSelectedDate: (date) => set({ selectedDate: date }),
  setIsOnline: (isOnline) => set({ isOnline: isOnline }),

  localEntries: [],
  isSyncing: false,

  loadFromStorage: async () => {
    try {
      const storedQueue = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (storedQueue) {
        set({ localEntries: JSON.parse(storedQueue) });
      }
    } catch (e) {
      console.error("Ошибка загрузки очереди:", e);
    }
  },
  // Mutation Folding
  addMutation: (newMutation: OfflineMutation) => {
    const { localEntries, persistQueue } = get();
    let updatedQueue = [...localEntries];

    // Ищем, есть ли уже в очереди операции с этим ID
    const existingIndex = updatedQueue.findIndex(
      (item) => item.payload.id === newMutation.payload.id,
    );

    if (existingIndex !== -1) {
      const existing = updatedQueue[existingIndex];

      if (newMutation.type === "delete") {
        // Если удаляем то, что еще не ушло на бэк — просто стираем из очереди
        if (!newMutation.isPersisted) {
          updatedQueue.splice(existingIndex, 1);
        } else {
          // Если запись из БД — заменяем любое действие на delete
          updatedQueue[existingIndex] = newMutation;
        }
      } else if (newMutation.type === "update") {
        // Обновляем payload существующей операции (add или update)
        updatedQueue[existingIndex] = {
          ...existing,
          payload: { ...existing.payload, ...newMutation.payload },
        };
      }
    } else {
      // Если операций с этим ID еще нет — просто добавляем в конец
      updatedQueue.push(newMutation);
    }

    set({ localEntries: updatedQueue });
    persistQueue(updatedQueue);
  },

  // Вспомогательный метод для сохранения очереди на диск при каждом изменении
  persistQueue: async (queue: OfflineMutation[]) => {
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  },

  syncOfflineMutations: async () => {
    const { localEntries, isSyncing, persistQueue, fetchEntries } = get();

    if (isSyncing || localEntries.length === 0) return;

    set({ isSyncing: true });

    for (const mutation of localEntries) {
      try {
        if (mutation.type === "add") {
          // Отправляем без ID, так как бэк создаст свой
          const { id, ...data } = mutation.payload;
          await api.post("/entries", data);
        } else if (mutation.type === "update") {
          await api.put(`/entries/${mutation.payload.id}`, mutation.payload);
        } else if (mutation.type === "delete") {
          await api.delete(`/entries/${mutation.payload.id}`);
        }
      } catch (e) {
        console.error("Ошибка синхронизации мутации:", e);
        break;
      }
    }

    // После завершения чистим очередь и обновляем данные с сервера
    set({ localEntries: [], isSyncing: false });
    await persistQueue([]);
    await fetchEntries(); // Загружаем актуальные ID и данные
  },
}));
