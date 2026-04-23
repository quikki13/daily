<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useEntriesStore } from '@/stores/entries';
import AppHeader from '@/components/AppHeader.vue';
import CalendarGrid from '@/components/CalendarGrid.vue';
import ListView from '@/components/ListView.vue';
import EntryForm from '@/components/EntryForm.vue';

import { type Entry } from '@/stores/entries';

const isFormOpen = ref(false);

const currentView = ref<'calendar' | 'list'>('calendar');

const entryToEdit = ref<null | Entry>(null);

const entriesStore = useEntriesStore();

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
      <div v-if="currentView === 'calendar'" class="py-10 text-center">
        <CalendarGrid @edit-entry="handleEditEntry" />
      </div>
      <div v-else class="py-10 text-center">
        <ListView @edit-entry="handleEditEntry" />
      </div>
    </main>

    <EntryForm :is-open="isFormOpen" :entry-to-edit="entryToEdit" @close="onCloseForm"
      @success="handleSuccess" />
  </div>
</template>