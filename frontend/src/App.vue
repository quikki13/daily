<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useEntriesStore } from '@/stores/entries';
import AppHeader from '@/components/AppHeader.vue';
import CalendarGrid from '@/components/CalendarGrid.vue';
import ListView from '@/components/ListView.vue';
import EntryForm from '@/components/EntryForm.vue';
import TagFilter from '@/components/TagFilter.vue';

import { type Entry } from '@/stores/entries';

import { formatDateForApi } from '@/utils/calendar';

const isFormOpen = ref(false);

const currentView = ref<'calendar' | 'list'>('calendar');
const entryToEdit = ref<null | Entry>(null);

// selectedDate для новой записи
const selectedDate = ref<string>(formatDateForApi(new Date()));

// Для ListView 
const sorting = ref<'new' | 'old'>('new');

const entriesStore = useEntriesStore();

const handleChangeSorting = (sortingArg: 'new' | 'old') => {
  sorting.value = sortingArg;
}

const handleAddEntry = () => {
  isFormOpen.value = true;
}

const handleSuccess = () => {
  entriesStore.fetchEntries();
}

const handleChangeView = (view: 'list' | 'calendar') => {
  currentView.value = view;
}

const handleEditEntry = (entry: Entry) => {
  entryToEdit.value = entry;
  isFormOpen.value = true;
}

const handleCreateEntry = (date: Date) => {
  entryToEdit.value = null;
  selectedDate.value = formatDateForApi(date);
  isFormOpen.value = true;
}

const onCloseForm = () => {
  entryToEdit.value = null;
  isFormOpen.value = false;
}

onMounted(() => {
  entriesStore.fetchEntries();
});

</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader @add-entry="handleAddEntry" @change-view="handleChangeView" />

    <main class="container mx-auto p-4">
      <TagFilter :sorting="currentView === 'list' ? sorting : null" @change-sorting="handleChangeSorting" />

      <Transition name="view" mode="out-in">
        <div v-if="currentView === 'calendar'" class="py-10 text-center">
          <CalendarGrid @edit-entry="handleEditEntry" @create-at="handleCreateEntry" />
        </div>
        <div v-else class="py-10 text-center">
          <ListView :sorting="sorting" @edit-entry="handleEditEntry" />
        </div>
      </Transition>
    </main>

    <EntryForm :is-open="isFormOpen" :entry-to-edit="entryToEdit" :initial-date="selectedDate" @close="onCloseForm"
      @success="handleSuccess" />
  </div>
</template>

<style lang="postcss">
@reference "tailwindcss";

.view-enter-active,
.view-leave-active {
  @apply transition-all duration-400 ease-out;
}

.view-enter-from,
.view-leave-to {
  @apply opacity-0 translate-y-4;
  
  /* Растворяемся и сдвигаемся вниз на 1rem (16px) при скрытии и начинаем рисоваться с этого же положения */
}

.view-enter-to,
.view-leave-from {
  @apply opacity-100 translate-y-0;
}
</style>