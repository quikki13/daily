import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function CalendarScreen() {
  // useRouter - хук для программного перехода между экранами
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-slate-50 p-5">
      <Text className="text-2xl font-bold text-slate-800 mb-4">
        Это экран Календаря
      </Text>
    </View>
  );
}