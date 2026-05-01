<script setup lang="ts">
import { CalendarArrowDownIcon, CalendarArrowUpIcon, Filter, X } from 'lucide-vue-next';

import { useEntriesStore } from '@/stores/entries';
import { toRefs } from 'vue';

const store = useEntriesStore();

// null - если мы на страничке календаря
const props = defineProps<{
  sorting: 'new' | 'old' | null;
}>();

const emit = defineEmits<{
  (e: 'change-sorting', sorting: 'new' | 'old'): void;
}>();

const onChangeSort = () => {
  if (props.sorting) {
    emit('change-sorting', props.sorting === 'new' ? 'old' : 'new');
  }
}

const { selectedTags, fetchEntries, allUniqueTags, toggleTag } = toRefs(store);

const clearFilters = () => {
  selectedTags.value = [];
  fetchEntries.value();
};
</script>

<template>
  <div class="mb-6 flex flex-wrap items-center gap-3">
    <Transition name="sort">
      <button v-if="!!sorting" @click="onChangeSort"
        class="w-fit p-2 rounded-md cursor-pointer bg-slate-200 text-slate-400 transition-colors hover:bg-slate-300 hover:text-slate-500">
        <CalendarArrowDownIcon v-if="props.sorting === 'new'" :size="20" />
        <CalendarArrowUpIcon v-else-if="props.sorting === 'old'" :size="20" />
      </button>
    </Transition>

    <div class="flex items-center gap-2 text-sm font-semibold text-slate-500">
      <Filter :size="16" />
      Фильтры:
    </div>

    <TransitionGroup name="filter-item" mode="out-in">
      <button v-for="tag in allUniqueTags" :key="tag" @click="toggleTag(tag)" :class="[
        'rounded-full px-3 py-1 text-xs font-medium transition-all border',
        selectedTags.includes(tag)
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
      ]">
        {{ tag }}
      </button>
    </TransitionGroup>

    <button v-if="selectedTags.length > 0" @click="clearFilters"
      class="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
      <X :size="14" />
      Сбросить
    </button>

    <span v-if="allUniqueTags.length === 0" class="text-xs text-slate-400 italic">
      Теги появятся здесь после создания записей
    </span>
  </div>
</template>

<style lang="postcss">
@reference "tailwindcss";

.filter-item-enter-active,
.filter-item-leave-active,
.sort-enter-active,
.sort-leave-active {
  @apply transition-all duration-400 ease-out;
}

.filter-item-enter-from,
.filter-item-leave-to,
.sort-enter-from,
.sort-leave-to {
  @apply opacity-0 translate-x-[-4];
}

.filter-item-enter-to,
.filter-item-leave-from,
.sort-enter-to,
.sort-leave-from  {
  @apply opacity-100 translate-x-0;
}
</style>