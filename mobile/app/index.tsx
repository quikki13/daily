import { Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function CalendarScreen() {
  // useRouter - хук для программного перехода между экранами
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-slate-50 p-5">
      <Text className="text-2xl font-bold text-slate-800 mb-4">
        Это экран Календаря
      </Text>
      
      {/* TouchableOpacity - нативная кнопка для мобилок */}
      <TouchableOpacity 
        className="bg-indigo-600 px-6 py-3 rounded-xl"
        onPress={() => router.push('/list')}
      >
        <Text className="text-white font-semibold">Перейти к Списку</Text>
      </TouchableOpacity>
    </View>
  );
}