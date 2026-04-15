import { GRID_CELLS, MONTH_NAMES, WEEK_DAYS } from '@/consts/calendar';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean; // Относится ли день к выбранному месяцу (для стилизации "серым")
  isToday: boolean;
}

/**
 * Генерирует массив из 42 дней для отображения сетки календаря
 * @param year Год (например, 2026)
 * @param month Месяц (0 - Январь, 11 - Декабрь)
 */
export function getCalendarGrid(year: number, month: number) {
  const grid: CalendarDay[] = [];
  const today = new Date();

  const checkToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  // 1) Узнаем с какого дня начинается месяц (0 - понедельник, 7 - воскресенье)
  const firstDayOfTheMonth = new Date(year, month, 1);
  let startingDayOfWeek = firstDayOfTheMonth.getDay();

  // Адаптируем календарь к европейскому формату (т.е. принудительно ставим воскресенье последним === 7)
  if (startingDayOfWeek === 0) startingDayOfWeek = 7;

  // 2) Получаем количество дней в ТЕКУЩЕМ месяце
  const daysInMont = new Date(year, month + 1, 0).getDate();

  // 3) Получаем количество дней в ПРОШЕДШЕМ месяце
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Собираем дни из предидущего месяца в сетку (актуально есл месяц стартует не с пн)
  // Пример: если среда (3) то надо взять два дня из предидущего месяца
  const daysFromPrevMonth = startingDayOfWeek - 1;
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i);
    grid.push({
      date,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Собираем дни текущего месяца в сетку
  for (let i = 1; i <= daysInMont; i++) {
    const date = new Date(year, month, i);
    grid.push({
      date,
      isCurrentMonth: true,
      isToday: checkToday(date),
    });
  }

  // Собираем дни следующего месяца
  // Наша сетка не отличается от классической (42 ячейки = 6 колонок по 7 столбцов (дни))
  const daysInNextMonth = GRID_CELLS - grid.length;

  if (daysInNextMonth > 0) {
    for (let i = 1; i <= daysInNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      grid.push({
        date,
        isToday: false,
        isCurrentMonth: false,
      });
    }
  }

  return grid;
}

/**
 * Превращает объект Date в строку формата YYYY-MM-DD для запросов к нашему API
 */
export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}