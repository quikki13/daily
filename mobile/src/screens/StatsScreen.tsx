import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useEntriesStore } from '@/store/useEntriesStore';
import { FileText, Hash, TrendingUp, Type } from 'lucide-react-native';

export default function StatsScreen() {
  const { entries } = useEntriesStore();

  const stats = useMemo(() => {
    let totalWords = 0;
    const tagCounts: Record<string, number> = {};

    for (const entry of entries) {
      const words = entry.content.trim().split(/\s+/);
      if (words[0] !== '') {
        totalWords += words.length;
      }

      if (entry.tags) {
        for (const tag of entry.tags) {
          const normalizedTag = tag.name.toLowerCase();
          tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
        }
      }
    }

    // Сортируем тэги по убыванию популярности и берем топ-5
    const topTags = Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5);

    // Находим максимальное количество использований для расчета процентов ширины полоски
    const maxTagCount = topTags.length > 0 ? topTags[0][1] : 1;

    return {
      totalEntries: entries.length,
      totalWords,
      topTags,
      maxTagCount,
    };
  }, [entries]);

  return (
    <ScrollView className="flex-1 bg-slate-50 p-5">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Статистика</Text>

      {/* Сетка быстрых показателей (2x2) */}
      <View className="flex-row flex-wrap justify-between mb-8">
        {/* Всего записей */}
        <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
          <View className="bg-indigo-100 w-10 h-10 rounded-full items-center justify-center mb-3">
            <FileText size={20} color="#4f46e5" />
          </View>
          <Text className="text-3xl font-bold text-slate-800">{stats.totalEntries}</Text>
          <Text className="text-sm text-slate-500 font-medium">Всего записей</Text>
        </View>

        {/* Всего слов */}
        <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
          <View className="bg-emerald-100 w-10 h-10 rounded-full items-center justify-center mb-3">
            <Type size={20} color="#10b981" />
          </View>
          <Text className="text-3xl font-bold text-slate-800">{stats.totalWords}</Text>
          <Text className="text-sm text-slate-500 font-medium">Написано слов</Text>
        </View>

        {/* Уникальных тэгов */}
        <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <View className="bg-amber-100 w-10 h-10 rounded-full items-center justify-center mb-3">
            <Hash size={20} color="#d97706" />
          </View>
          <Text className="text-3xl font-bold text-slate-800">
            {Object.keys(stats.topTags).length > 0 ? stats.topTags.length : 0}
          </Text>
          <Text className="text-sm text-slate-500 font-medium">Топ тэгов</Text>
        </View>

        {/* Среднее слов на запись */}
        <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <View className="bg-rose-100 w-10 h-10 rounded-full items-center justify-center mb-3">
            <TrendingUp size={20} color="#e11d48" />
          </View>
          <Text className="text-3xl font-bold text-slate-800">
            {stats.totalEntries > 0 
              ? Math.round(stats.totalWords / stats.totalEntries) 
              : 0}
          </Text>
          <Text className="text-sm text-slate-500 font-medium">Слов в среднем</Text>
        </View>
      </View>

      {/* Блок популярных тэгов */}
      <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-10">
        <Text className="text-lg font-bold text-slate-800 mb-4">Популярные темы</Text>
        
        {stats.topTags.length === 0 ? (
          <Text className="text-slate-500 text-center py-4">Вы пока не используете тэги</Text>
        ) : (
          stats.topTags.map(([tag, count], index) => {
            // Вычисляем ширину полоски в процентах
            const percentage = Math.round((count / stats.maxTagCount) * 100);
            
            return (
              <View key={tag} className="mb-4 last:mb-0">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-slate-700 font-medium">#{tag}</Text>
                  <Text className="text-slate-500 font-bold">{count}</Text>
                </View>
                {/* Фоновая полоска */}
                <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  {/* Заполненная часть */}
                  <View 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${percentage}%` }} 
                  />
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}