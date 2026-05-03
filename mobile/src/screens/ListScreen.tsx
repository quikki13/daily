import { useEffect } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import { Bug, Info } from "lucide-react-native";

import { formatDate } from "../utils/calendar";

import { useEntriesStore } from "../store/useEntriesStore";

export default function ListScreen() {
  const { entries, isLoading, error, fetchEntries } = useEntriesStore();

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
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            {/* Ограничиваем content до 3 строк (numberOfLines={3}) */}
            <Text
              className="text-base text-slate-800 leading-relaxed"
              numberOfLines={3}
            >
              {item.content}
            </Text>
            <Text className="text-sm font-medium text-slate-400 mt-2">
              {formatDate(item.date)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex flex-row gap-2 justify-center items-center mt-10">
            <Info size={30} color="#94a3b8" />
            <Text className="text-slate-500 font-medium">
              У вас пока нет записей.
            </Text>
          </View>
        }
      />
    </View>
  );
}
