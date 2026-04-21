<script setup lang="ts">
import { computed } from 'vue';
import { X, Calendar as CalendarIcon, Tag as TagIcon, Trash2 } from 'lucide-vue-next';
import { useEntriesStore, type Entry } from '@/stores/entries'; // Импортируем тип Entry

const props = defineProps<{
  isOpen: boolean;
  entry: Entry | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useEntriesStore();

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long'
});

const displayDate = computed(() => {
  if (!props.entry) return '';
  return dateFormatter.format(new Date(props.entry.date));
});

/**
 * Обработка удаления прямо из модального окна просмотра
 */
const handleDelete = async () => {
  if (!props.entry) return;

  if (confirm('Удалить эту запись?')) {
    await store.deleteEntry(props.entry.id);
    emit('close'); // Закрываем окно после успешного удаления
  }
};
</script>

<template>
  <div v-if="isOpen && entry"
    class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    @click.self="emit('close')">
    <div class="max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">

      <div class="flex items-center justify-between border-b border-slate-400 px-6 py-4">
        <div class="flex items-center gap-2 text-sm font-medium text-indigo-600 capitalize">
          <CalendarIcon :size="16" />
          {{ displayDate }}
        </div>
        <div class="flex gap-1">
          <button @click="handleDelete"
            class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title="Удалить запись">
            <Trash2 :size="18" />
          </button>
          <button @click="emit('close')"
            class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
            <X :size="18" />
          </button>
        </div>
      </div>

      <div class="p-6">
        <p class="whitespace-pre-wrap text-slate-700 text-base leading-relaxed">
          {{ entry.content }}
        </p>
      </div>

      <div v-if="entry.tags && entry.tags.length > 0" class="border-t border-slate-400 bg-slate-50 px-6 py-4">
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in entry.tags" :key="tag.id"
            class="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <TagIcon :size="12" />
            {{ tag.name }}
          </span>
        </div>
      </div>

    </div>
  </div>
</template>