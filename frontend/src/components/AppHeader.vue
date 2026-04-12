<script setup lang="ts">

import { ref, computed } from 'vue';
import { Calendar, List, Plus } from 'lucide-vue-next';

const activeTab = ref<'calendar' | 'list'>('calendar');

const activeClass = computed(() => {
  return activeTab.value === 'calendar' ? 'translate-x-0' : 'translate-x-full';
});

/**
 * emit — это механизм для передачи событий от дочернего компонента к родительскому.
 * Здесь мы определяем, какие события этот компонент может "выбрасывать".
 */
const emit = defineEmits<{
  (e: 'change-view', view: 'calendar' | 'list'): void;
  (e: 'add-entry'): void;
}>();

const setView = (view: 'calendar' | 'list') => {
  activeTab.value = view;
  emit('change-view', view);
};
</script>

<template>
  <header class="sticky top-0 z-50 p-2 w-full border-b bg-white/80 backdrop-blur-md">
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <div
          class="relative flex h-8 w-8 items-center justify-center rounded-t-lg rounded-bl-lg bg-indigo-600 text-white after:content-[''] after:block after:w-2 after:h-2 after:bg-indigo-500 after:rounded-tl-sm after:absolute after:right-0 after:bottom-0">
          <span class="text-xl font-bold cursor-default">D</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-slate-900">Daily</h1>
      </div>

      <nav class="relative hidden md:flex items-center gap-1 rounded-full bg-slate-100 p-1">
        <div
          class="absolute z-0 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-white shadow-sm transition duration-300 ease-out"
          :class="activeClass"></div>

        <button @click="setView('calendar')" :class="[
          'flex z-10 items-center gap-2 rounded-full cursor-pointer px-4 py-1.5 text-sm font-medium',
          activeTab === 'calendar' ? ' text-indigo-600' : 'text-slate-500 hover:text-slate-700'
        ]">
          <Calendar :size="18" />
          Календарь
        </button>
        <button @click="setView('list')" :class="[
          'flex z-10 items-center gap-2 rounded-full cursor-pointer px-4 py-1.5 text-sm font-medium',
          activeTab === 'list' ? ' text-indigo-600' : 'text-slate-500 hover:text-slate-700'
        ]">
          <List :size="18" />
          Список
        </button>
      </nav>

      <button @click="emit('add-entry')"
        class="flex items-center gap-2 rounded-lg cursor-pointer bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:scale-95">
        <Plus :size="18" />
        <span class="hidden sm:inline">Новая запись</span>
      </button>
    </div>
  </header>
</template>