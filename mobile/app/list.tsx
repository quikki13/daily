import { Text, View } from 'react-native';

export default function ListScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 p-5">
      <Text className="text-xl text-slate-800">
        Здесь будет список всех записей
      </Text>
    </View>
  );
}