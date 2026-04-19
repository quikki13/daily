<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { getCalendarGrid } from '@/utils/calendar';
import { WEEK_DAYS, MONTH_NAMES } from '@/consts/calendar';
import { useEntriesStore } from '@/stores/entries';

// Инициализируем текущую дату
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());

const entriesStore = useEntriesStore();

/**
 * Вычисляем сетку дней на основе выбранного года и месяца.
 * При изменении currentYear или currentMonth эта функция запустится заново автоматически.
 */
const calendarDays = computed(() => {
  return getCalendarGrid(currentYear.value, currentMonth.value);
});

// Название текущего месяца для заголовка
const currentMonthName = computed(() => {
  return MONTH_NAMES[currentMonth.value];
});

// Методы переключения месяцев
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};
</script>

<template>
  <div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">

    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl cursor-default font-bold text-slate-800 transition-colors hover:text-slate-800/80">
        {{ currentMonthName }} <span class="text-slate-400 font-normal hover:text-slate-400">{{ currentYear }}</span>
      </h2>

      <div class="flex gap-2">
        <button @click="prevMonth"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100">
          <ChevronLeft :size="20" />
        </button>
        <button @click="nextMonth"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100">
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>

    <div class="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
      <div v-for="day in WEEK_DAYS" :key="day" class="pb-2">
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1 md:gap-2">
      <div v-for="({ isCurrentMonth, isToday, date }, index) in calendarDays" :key="index" :class="[
        'relative flex h-14 md:h-24 flex-col rounded-xl border p-1 transition-colors md:p-2',
        isCurrentMonth ? 'bg-white border-slate-100' : 'bg-slate-50/50 border-transparent text-slate-400',
        isToday ? 'ring-2 ring-indigo-500 border-transparent' : 'hover:border-indigo-200'
      ]">
        <span :class="[
          'text-sm font-medium',
          isToday ? 'text-indigo-600' : (isCurrentMonth ? 'text-slate-700' : '')
        ]">
          {{ date.getDate() }}
        </span>

        <div class="mt-auto flex flex-wrap gap-1">
          <div v-for="entry in entriesStore.getEntriesByDate(date)" :key="entry.id"
            class="relative flex items-center justify-center">
            <div class="cursor-[url(@/assets/cursor.cur),pointer] p-1 peer">
              <div class="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-indigo-500"></div>
            </div>

            <!-- tooltip -->
            <div
              class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 hidden w-max max-w-50 -translate-x-1/2 rounded-lg bg-slate-500 px-3 py-2 text-xs font-medium text-white shadow-xl peer-hover:block">
              <p class="truncate whitespace-normal line-clamp-3">
                {{ entry.content }}
              </p>

              <div class="absolute left-1/2 -bottom-1 -mt-px h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>