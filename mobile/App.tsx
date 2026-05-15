import "@/global.css";
import React from "react";
import { Platform, UIManager } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Calendar, List, SquareStackIcon } from "lucide-react-native";

// --- Импорты экранов ---
import ListScreen from "@/screens/ListScreen";
import CalendarScreen from "@/screens/CalendarScreen";
import CreateEntryScreen from "@/screens/CreateEntryScreen";
import EditEntryScreen from "@/screens/EditEntryScreen";
import StatsScreen from "@/screens/StatsScreen";
import { useEntriesStore } from "@/store/useEntriesStore";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- Компонент навигации (вынесли отдельно для чистоты) ---
function BottomTabsNavigator() {
  const { setSelectedDate } = useEntriesStore();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#4f46e5", // indigo-600
        tabBarInactiveTintColor: "#94a3b8", // slate-400
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9", // slate-100
        },
      }}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        listeners={{
          tabPress: (_e) => {
            setSelectedDate(null);
          },
        }}
        options={{
          title: "Календарь",
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          title: "Список записей",
          tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: "Статистика",
          tabBarIcon: ({ color, size }) => <SquareStackIcon size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// --- Главная точка входа ---
export default function App() {
  // анимашки на андроиде, на ios из коробки работает
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={BottomTabsNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CreateEntry"
          component={CreateEntryScreen}
          options={{
            presentation: "modal", // Магия нативного слайда снизу вверх!
            title: "Новая запись",
            headerStyle: { backgroundColor: "#f8fafc" },
            headerShadowVisible: false,
          }}
        />

        <Stack.Screen
          name="EditEntry"
          component={EditEntryScreen}
          options={{
            presentation: "modal",
            title: "Редактировать запись",
            headerStyle: { backgroundColor: "#f8fafc" },
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
