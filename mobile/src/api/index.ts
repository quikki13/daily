// src/api/index.ts
import axios from 'axios';
import Constants from 'expo-constants';

// Функция для определения правильного адреса бэкенда
const getBaseUrl = () => {
  // Expo Constants позволяет получить IP-адрес компьютера в локальной сети
  const pcHost = Constants.expoConfig?.hostUri;
  
  if (pcHost) {
    return `http://${pcHost.split(':')[0]}:3000`;
  }
  
  // Фолбэк для симулятора, если IP не определился
  return 'http://localhost:3000';
};

export const api = axios.create({
  baseURL: `${getBaseUrl()}/api`,
  timeout: 10000, // 10 секунд на ответ
  headers: {
    'Content-Type': 'application/json',
  },
});