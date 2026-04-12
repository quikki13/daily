<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from './api';

import AppHeader from '@/components/AppHeader.vue';

const entries = ref([]);

const currentView = ref<'calendar' | 'list'>('calendar');

const handleAddEntry = () => {
  alert('Open modal window for new entity');
}

const handleChangeView = (view: 'list' | 'calendar') => {
  currentView.value = view;
}

onMounted(async () => {
  try {
    const { data } = await api.get('/api/entries');
    entries.value = data;
    console.log('Данные с бэкенда получены:', entries.value);
  } catch (error) {
    console.error('Ошибка связи с сервером:', error);
  }
});
</script>

<template>
<div class="min-h-screen bg-slate-50">
    <AppHeader 
      @add-entry="handleAddEntry" 
      @change-view="handleChangeView" 
    />

    <main class="container mx-auto p-4">
      <div v-if="currentView === 'calendar'" class="py-10 text-center">
        <h2 class="text-2xl text-slate-400">Здесь будет сетка календаря</h2>
      </div>
      <div v-else class="py-10 text-center">
        <h2 class="text-2xl text-slate-400">Здесь будет список записей</h2>
      </div>
    </main>
  </div>
</template>