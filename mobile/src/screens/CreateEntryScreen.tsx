import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { formatDate } from "@/utils/calendar";
import { useEntriesStore } from '@/store/useEntriesStore';

export default function CreateEntryScreen() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigation = useNavigation();
  const { addEntry } = useEntriesStore();

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);

    const today = formatDate(new Date());

    const success = await addEntry(content, today, []);
    if (success) {
      navigation.goBack(); // Закрываем модалку и возвращаемся в список
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    // KeyboardAvoidingView сам поднимает контент, когда снизу выезжает клавиатура
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <View className="flex-1 p-5">
        <TextInput
          className="bg-white p-4 rounded-xl border border-slate-200 text-base text-slate-800 min-h-[150px]"
          multiline
          autoFocus
          textAlignVertical="top"
          placeholder="Заполните заметку..."
          placeholderTextColor="#94a3b8"
          value={content}
          onChangeText={setContent}
        />

        <TouchableOpacity 
          className={`mt-6 p-4 rounded-xl items-center flex-row justify-center ${
            content.trim() ? 'bg-indigo-600' : 'bg-slate-300'
          }`}
          onPress={handleSave}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Сохранить запись</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}