import { Tabs } from "expo-router";
import { List, Calendar } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: '#4f46e5', // Цвет активной иконки
        tabBarInactiveTintColor: '#94a3b8', // Цвет неактивной
        headerStyle: {
          backgroundColor: '#f8fafc', // Цвет шапки
        },
        headerShadowVisible: false, // Убираем полоску под шапкой
    }}>
      <Tabs.Screen name="index" options={{ title: 'Календарь', tabBarIcon: ({color}) => <Calendar color={color} size={24} />}}/>
      <Tabs.Screen name="list" options={{ title: 'Список записей', tabBarIcon: ({color}) => <List color={color} size={24} />}}/>
    </Tabs>
  );
}