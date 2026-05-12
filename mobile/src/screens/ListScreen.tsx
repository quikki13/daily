import { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import {
  Bug,
  Info,
  ChevronLeft,
  ChevronRight,
  Search,
  CloudOff,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Plus,
  Calendar as CalendarIcon,
  X,
  Pencil,
  Trash2,
} from "lucide-react-native";

import { weekDays } from "@/consts/common";

import { formatDate } from "@/utils/calendar";
import {
  filterEntriesByDate,
  filterEntriesBySearch,
  SearchType,
} from "@/utils/filters";

import { useCalendar, type CalendarDay } from "@/hooks/useCalendar";

import { Entry, useEntriesStore } from "@/store/useEntriesStore";

export default function ListScreen() {
  const navigation = useNavigation();

  const {
    entries,
    isLoading,
    selectedDate,
    error,
    tagsIndex,
    setSelectedDate,
    deleteEntry,
    fetchEntries,
  } = useEntriesStore();

  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("content");

  const { calendarDays, currentDate, nextMonth, prevMonth } = useCalendar();

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (selectedDate) {
      result = filterEntriesByDate(result, selectedDate);
    }

    if (searchInput.trim()) {
      result = filterEntriesBySearch(
        result,
        searchInput,
        searchType,
        tagsIndex,
      );
    }

    return result;
  }, [entries, selectedDate, searchInput, searchType, tagsIndex]);

  const showConfirm = (item: Entry) => {
    Alert.alert(
      `Удаление записи за ${formatDate(item.date)}`,
      "Уверены, что хотите удалить запись? 🥺",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            await deleteEntry(item.id);
          },
        },
      ],
    );
  };

  const onDayInModalClick = ({ date }: CalendarDay) => {
    setSelectedDate(formatDate(date));
    setCalendarModalVisible(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 flex-col items-center justify-center bg-slate-50 p-5">
        <Bug size={20} color="#fecaca" />
        <Text className="text-red-400 text-center font-medium">{"error"}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-row justify-between items-center px-5 pt-5 pb-2">
        <Text className="text-2xl font-bold text-slate-800">Записи</Text>

        <TouchableOpacity
          className={`flex-row items-center px-3 py-1.5 rounded-full border ${
            selectedDate
              ? "bg-indigo-100 border-indigo-200"
              : "bg-white border-slate-200"
          }`}
          onPress={() => setCalendarModalVisible(true)}
        >
          <CalendarIcon
            size={16}
            color={selectedDate ? "#4338ca" : "#64748b"}
          />
          <Text
            className={`ml-2 font-medium ${selectedDate ? "text-indigo-700" : "text-slate-500"}`}
          >
            {selectedDate ? selectedDate : "Все даты"}
          </Text>

          {selectedDate && (
            <TouchableOpacity
              className="ml-2"
              onPress={() => setSelectedDate(null)}
            >
              <X size={14} color="#4338ca" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter */}

      <View className="px-5 pb-4">
        {/* Инпут поиска */}
        <View className="flex-row items-center bg-white rounded-xl border border-slate-200 px-3 h-11 mb-3">
          <Search size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-base text-slate-800"
            placeholder="Найти записи..."
            placeholderTextColor="#94a3b8"
            value={searchInput}
            onChangeText={setSearchInput}
            autoCorrect={false}
          />
          {/* Кнопка очистки появляется только если есть текст */}
          {searchInput.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchInput("")}
              className="p-1"
            >
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Segmented Control */}
        <View className="flex-row bg-slate-200 p-1 rounded-lg">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSearchType("content")}
            className={`flex-1 py-1.5 items-center rounded-md ${
              searchType === "content" ? "bg-white" : "bg-transparent"
            }`}
          >
            <Text
              className={`font-medium ${
                searchType === "content" ? "text-slate-800" : "text-slate-500"
              }`}
            >
              В тексте
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSearchType("tag")}
            className={`flex-1 py-1.5 items-center rounded-md ${
              searchType === "tag" ? "bg-white" : "bg-transparent"
            }`}
          >
            <Text
              className={`font-medium ${
                searchType === "tag" ? "text-slate-800" : "text-slate-500"
              }`}
            >
              В тэгах
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        renderItem={({ item }) => {
          const isOffline = item.id.toString().startsWith("temp-id:");

          return (
            <View className="bg-white p-4 rounded-xl border border-slate-100">
              {/* Ограничиваем content до 3 строк (numberOfLines={3}) */}
              {isOffline && (
                <View className="flex flex-row gap-1 bg-red-300 py-1 px-1.5 items-center rounded-md mb-2 w-20">
                  <CloudOff size={14} color="#fef2f2" />
                  <Text className="text-sm text-red-50">Offline</Text>
                </View>
              )}
              <Text
                className="text-base text-slate-800 leading-relaxed"
                numberOfLines={3}
              >
                {item.content}
              </Text>

              {Boolean(item && item?.tags && item.tags.length > 0) && (
                <View className="flex-row flex-wrap gap-2 mt-3">
                  {item.tags.map((tag, i) => (
                    <View
                      key={i}
                      className={`px-2.5 py-1 rounded-md bg-slate-100`}
                    >
                      {tag && (
                        <Text className="text-slate-600 text-xs font-medium">
                          #{tag.name}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              <View className="flex flex-row justify-between items-center mt-3">
                <Text className="text-sm font-medium text-slate-400 mt-2">
                  {formatDate(item.date)}
                </Text>

                <View className="flex flex-row gap-3">
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(
                        ...([
                          "EditEntry",
                          {
                            entry: {
                              ...item,
                              tags: item.tags.map(({ name }) => name),
                            },
                          },
                        ] as never),
                      )
                    }
                  >
                    <Pencil size={18} color="#94a3b8" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => showConfirm(item)}>
                    <Trash2 size={18} color="#f87171" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View className="flex flex-row gap-2 justify-center items-center mt-10">
            <Info size={30} color="#94a3b8" />
            <Text className="text-slate-500 font-medium">
              У вас пока нет записей.
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center"
        style={{
          backgroundColor: "#6366f1",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.75,
          shadowRadius: 2,
          opacity: 1,
        }}
        onPress={() => navigation.navigate("CreateEntry" as never)}
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>

      <Modal
        visible={isCalendarModalVisible}
        animationType="slide"
        transparent={true} // Позволяет сделать фон полупрозрачным
        onRequestClose={() => setCalendarModalVisible(false)} // Обязательно для Android (кнопка "Назад")
      >
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-3xl p-5 min-h-[50%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-slate-800">
                Выберите дату
              </Text>
              <TouchableOpacity onPress={() => setCalendarModalVisible(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* шапка календаря */}

            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity
                onPress={prevMonth}
                className="p-2 bg-slate-50 rounded-full"
              >
                <ChevronLeft color="#475569" size={20} />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-slate-700 capitalize">
                {currentDate.toLocaleString("ru-RU", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <TouchableOpacity
                onPress={nextMonth}
                className="p-2 bg-slate-50 rounded-full"
              >
                <ChevronRight color="#475569" size={20} />
              </TouchableOpacity>
            </View>

            {/* дни недели */}
            <View className="flex-row mb-2">
              {weekDays.map((day, index) => (
                <View key={index} className="flex-1 items-center">
                  <Text className="text-xs font-semibold text-slate-400">
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* сетка дней */}
            <View className="flex-row flex-wrap">
              {calendarDays.map((item, index) => {
                // Проверяем, выбрана ли именно эта дата в фильтре
                const isSelected = selectedDate === formatDate(item.date);

                return (
                  <View key={index} className="w-[14.28%] p-1">
                    <TouchableOpacity
                      onPress={() => onDayInModalClick(item)}
                      activeOpacity={0.7}
                      className={`h-10 w-full items-center justify-center rounded-xl ${
                        isSelected ? "bg-indigo-600" : "bg-transparent"
                      }`}
                    >
                      <Text
                        className={`text-[15px] font-medium ${
                          isSelected
                            ? "text-white"
                            : item.isCurrentMonth
                              ? "text-slate-700"
                              : "text-slate-300"
                        }`}
                      >
                        {item.day}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
