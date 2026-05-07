import { useMemo, useState } from "react";

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  date: Date;
}

/**
 * Генерирует массив дней для календаря и методы управления
 * @return currentDate текущий день (для определения текущего месяца календаря)
 * @return calendarDays Список дней текущего месяца
 * @return nextMonth Метод переключения месяцев вперед
 * @return prevMonth Метод переключения месяцев назад
 */
export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Воскресенье = 0. Сдвигаем, чтобы понедельник был 1, воскресенье 7
    const startingDay = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Хвост предыдущего месяца
    for (let i = 1; i < startingDay; i++) {
      days.push({
        day: daysInPrevMonth - startingDay + i + 1,
        isCurrentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - startingDay + i + 1),
      });
    }

    // Дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    return days;
  }, [currentDate]);

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );

  return {
    currentDate,
    calendarDays,
    nextMonth,
    prevMonth,
  };
};
