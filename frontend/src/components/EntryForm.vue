<script setup lang="ts">
import { ref } from 'vue';
import { X, Tag as TagIcon, Calendar as CalendarIcon } from 'lucide-vue-next';
import api from '@/api';

/**
 * defineProps — макрос для объявления входных параметров компонента.
 * Мы используем его, чтобы родитель (App.vue) мог управлять видимостью окна.
 */
const props = defineProps<{
  isOpen: boolean;
}>();

/**
 * defineEmits — объявляем события: закрытие окна и успешное сохранение.
 */
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

// Локальное состояние полей формы
const content = ref('');
const date = ref(new Date().toISOString().split('T')[0]); // По умолчанию сегодня (ГГГГ-ММ-ДД)
const tagsString = ref(''); // Теги вводом через запятую
const isLoading = ref(false);

/**
 * Функция отправки данных на бэкенд
 */
const handleSubmit = async () => {
  if (!content.value) return;

  isLoading.value = true;
  try {
    // Превращаем строку "тег1, тег2" в массив ["тег1", "тег2"]
    const tags = tagsString.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    await api.post('/api/entries', {
      content: content.value,
      date: date.value,
      tags
    });

    // Очищаем форму и уведомляем родителя об успехе
    content.value = '';
    tagsString.value = '';
    emit('success');
    emit('close');
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
    alert('Не удалось сохранить запись');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
      <div class="flex items-center justify-between border-b border-slate-400 px-6 py-4">
        <h3 class="text-lg cursor-default font-semibold text-slate-800">Новая запись</h3>
        <button @click="emit('close')" class="text-slate-400 cursor-pointer hover:text-slate-600">
          <X :size="20" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Текст заметки</label>
            <textarea
              v-model="content"
              rows="4"
              class="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="Заполните заметку..."
              required
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                <CalendarIcon :size="14" /> Дата
              </label>
              <input
                v-model="date"
                type="date"
                class="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label class="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                <TagIcon :size="14" /> Теги (через запятую)
              </label>
              <input
                v-model="tagsString"
                type="text"
                placeholder="важное, врач"
                class="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 flex gap-3">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 cursor-pointer rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 cursor-pointer rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
          >
            {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>