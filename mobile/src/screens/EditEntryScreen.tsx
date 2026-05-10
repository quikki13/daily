import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { X } from "lucide-react-native";

import { useEntriesStore, Entry } from "@/store/useEntriesStore";

export type EntryType = Omit<Entry, "tags"> & {
  // мы на фронте передаем только строки в тэгах
  tags: string[];
};

type EditScreenRouteProp = RouteProp<
  { params: { entry: EntryType } },
  "params"
>;

export default function EditEntryScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditScreenRouteProp>();

  // При выборе записи параметры будут в урле передаваться
  const { entry } = route.params;

  const [content, setContent] = useState(entry.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    entry.tags.length ? entry.tags : [],
  );

  const { updateEntry } = useEntriesStore();

  const handleAddTag = () => {
    const newTag = tagInput.length ? tagInput.trim().toLowerCase() : "";

    if (!newTag.length || tags.findIndex((tag) => tag === newTag) >= 0) {
      return;
    }

    setTags([...tags, newTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => {
      return [...prev].filter((tag) => tag !== tagToRemove);
    });
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);

    const body = {
      content,
      date: entry.date,
      tags,
    };

    const success = await updateEntry(entry.id.toString(), body);
    if (success) {
      navigation.goBack(); // Закрываем модалку и возвращаемся в список
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    // KeyboardAvoidingView сам поднимает контент, когда снизу выезжает клавиатура
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <ScrollView className="flex-1 p-5">
        <TextInput
          className="bg-white p-4 rounded-xl border border-slate-200 text-base text-slate-800 min-h-[150px] mb-2"
          multiline
          autoFocus
          textAlignVertical="top"
          placeholder="Заполните заметку..."
          placeholderTextColor="#94a3b8"
          value={content}
          onChangeText={setContent}
        />

        <View className="bg-white rounded-xl border border-slate-200 px-4 py-2 mb-4">
          <TextInput
            value={tagInput}
            className="h-10 text-slate-800 text-base"
            placeholderTextColor="#94a3b8"
            placeholder="Тут можно добавить тэги (Enter)"
            onChangeText={setTagInput}
            onSubmitEditing={handleAddTag}
            blurOnSubmit={false}
          />
        </View>

        {tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-6">
            {tags.map((tag, i) => (
              <View
                key={i}
                className="flex-row items-center bg-indigo-100 pl-3 pr-2 py-1.5 rounded-full"
              >
                <Text className="text-indigo-700 font-medium mr-1">{tag}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveTag(tag)}
                  className="p-1"
                >
                  <X size={14} color="#4338ca" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          className={`mt-2 p-4 rounded-xl items-center flex-row justify-center ${
            (content.trim() && content !== entry.content) || tags !== entry.tags
              ? "bg-indigo-600"
              : "bg-slate-300"
          }`}
          onPress={handleSave}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">
              Сохранить изменения
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
