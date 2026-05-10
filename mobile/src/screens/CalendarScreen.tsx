import React, { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useEntriesStore } from "@/store/useEntriesStore";
import { weekDays } from "@/consts/common";
import { formatDate } from "@/utils/calendar";

import { useCalendar } from "@/hooks/useCalendar";

export default function CalendarScreen() {
  const { entries, isInited, fetchEntries } = useEntriesStore();
  const { currentDate, calendarDays, nextMonth, prevMonth  } = useCalendar();

  useEffect(() => {
    if (!isInited) {
      fetchEntries();
    }
  }, []);
  //   const year = currentDate.getFullYear();
  //   const month = currentDate.getMonth();

  //   const firstDayOfMonth = new Date(year, month, 1).getDay();
  //   // Воскресенье = 0. Сдвигаем, чтобы понедельник был 1, воскресенье 7
  //   const startingDay = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

  //   const daysInMonth = new Date(year, month + 1, 0).getDate();
  //   const daysInPrevMonth = new Date(year, month, 0).getDate();

  //   const days = [];

  //   // Хвост предыдущего месяца
  //   for (let i = 1; i < startingDay; i++) {
  //     days.push({
  //       day: daysInPrevMonth - startingDay + i + 1,
  //       isCurrentMonth: false,
  //       date: new Date(year, month - 1, daysInPrevMonth - startingDay + i + 1),
  //     });
  //   }

  //   // Дни текущего месяца
  //   for (let i = 1; i <= daysInMonth; i++) {
  //     days.push({
  //       day: i,
  //       isCurrentMonth: true,
  //       date: new Date(year, month, i),
  //     });
  //   }

  //   return days;
  // }, [currentDate]);

  // const nextMonth = () =>
  //   setCurrentDate(
  //     new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
  //   );
  // const prevMonth = () =>
  //   setCurrentDate(
  //     new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
  //   );

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <View className="flex-row items-center justify-between mb-6 mt-4">
        <TouchableOpacity
          onPress={prevMonth}
          style={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            opacity: 0.3,
          }}
          className="p-2 bg-white rounded-full"
        >
          <ChevronLeft color="#475569" size={24} />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-slate-800 capitalize">
          {currentDate.toLocaleString("ru-RU", {
            month: "long",
            year: "numeric",
          })}
        </Text>

        <TouchableOpacity
          onPress={nextMonth}
          style={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            opacity: 0.3,
          }}
          className="p-2 bg-white rounded-full"
        >
          <ChevronRight color="#475569" size={24} />
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-2">
        {weekDays.map((day, index) => (
          <View key={index} className="flex-1 items-center">
            <Text className="text-xs font-semibold text-slate-400">{day}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {calendarDays.map((item, index) => {
          const isToday =
            new Date().toDateString() === item.date.toDateString();

          const dateString = formatDate(item.date);
          const dayEntries = entries.filter(
            (entry) => formatDate(entry.date) === dateString,
          );

          return (
            <View key={index} className="w-[14.28%] p-1">
              <TouchableOpacity
                activeOpacity={0.7}
                className={`h-14 w-full items-center justify-center rounded-2xl border ${
                  item.isCurrentMonth
                    ? "bg-white border-slate-100"
                    : "bg-transparent border-transparent"
                } ${isToday ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20" : ""}`}
              >
                <Text
                  className={`text-[15px] font-medium ${
                    item.isCurrentMonth ? "text-slate-700" : "text-slate-300"
                  } ${isToday ? "text-indigo-600 font-bold" : ""}`}
                >
                  {item.day}
                </Text>

                <View className="mt-1 flex-row justify-center align-baseline gap-1">
                  {dayEntries.length ? (
                    <View
                      className={`h-4 w-9 mt-1 rounded-full ${
                        item.isCurrentMonth ? "bg-indigo-500" : "bg-indigo-300"
                      }`}
                    >
                      <Text className="text-xs text-indigo-50 text-center">
                        {dayEntries.length > 100 ? "100+" : dayEntries.length}
                      </Text>
                    </View>
                  ) : (
                    // заглушка
                    <View className="h-4 w-9 rounded-full bg-transparent" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}
