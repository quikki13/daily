import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // Stack - это навигатор, который кладет экраны друг на друга.
    // Он автоматически добавляет системную шапку (header) и жест "свайп назад".
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ title: 'Календарь' }} // Заголовок в шапке
      />
      <Stack.Screen 
        name="list" 
        options={{ title: 'Список записей' }} 
      />
    </Stack>
  );
}