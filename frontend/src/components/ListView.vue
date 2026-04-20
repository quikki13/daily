<script setup lang="ts">
import { ref, computed } from 'vue';
import { Calendar as CalendarIcon, Tag as TagIcon, CalendarArrowDownIcon, CalendarArrowUpIcon } from 'lucide-vue-next';
import { useEntriesStore } from '@/stores/entries';

const store = useEntriesStore();

const sorting = ref<'new' | 'old'>('new');

const sortedEntries = computed(() => {
  return [...store.entries].sort((a, b) => {
    const first = sorting.value === 'new' ? b.date : a.date;
    const second = sorting.value === 'new' ? a.date : b.date;

    return new Date(first).getTime() - new Date(second).getTime();
  });
});

/**
 * Intl.DateTimeFormat — встроенный в современный JS API для локализации дат.
 */
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'short' // Добавит день недели (например, "вс")
});

const formatDisplayDate = (isoString: string) => {
  return dateFormatter.format(new Date(isoString));
};

const onChangeSort = () => {
  sorting.value === 'new' ? sorting.value = 'old' : sorting.value = 'new';
}

</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">

    <div v-if="store.isLoading" class="py-10 text-center animate-pulse cursor-default text-slate-400">
      Загрузка записей...
    </div>

    <div v-else-if="sortedEntries.length === 0" class="py-20 text-center cursor-default">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-400">
        <CalendarArrowUpIcon :size="24" />
      </div>
      <h3 class="mb-1 text-lg font-medium text-slate-900">Нет записей</h3>
      <p class="text-slate-500">Добавьте запись, чтобы она отобразилась в списке.</p>
    </div>

    <div v-else class="space-y-4 flex flex-col">
      <button @click="onChangeSort"
        class="w-fit p-2 rounded-md cursor-pointer bg-slate-200 text-slate-400 transition-colors hover:bg-slate-300 hover:text-slate-500">
        <CalendarArrowDownIcon v-if="sorting === 'new'" :size="20" />
        <CalendarArrowUpIcon v-else-if="sorting === 'old'" :size="20" />
      </button>

      <article v-for="{ date, id, tags, content } in sortedEntries" :key="id"
        class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <header class="mb-3 flex items-center gap-1.5 text-sm font-medium text-indigo-600">
          <CalendarIcon :size="16" />
          <time :datetime="date" class="capitalize">
            {{ formatDisplayDate(date) }}
          </time>
        </header>

        <p class="mb-4 whitespace-pre-wrap text-slate-700">
          {{ content }}
        </p>

        <footer v-if="tags && tags.length > 0" class="flex flex-wrap gap-2">
          <span v-for="tag in tags" :key="tag.id"
            class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 cursor-pointer transition-colors hover:text-slate-700 hover:bg-slate-200">
            <TagIcon :size="12" />
            {{ tag.name }}
          </span>
        </footer>
      </article>
    </div>

  </div>
</template>