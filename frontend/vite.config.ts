import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), vue()],
  resolve: {
    alias: {
      // Настройка @ как алиаса для папки src
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173, // Стандартный порт Vite
    proxy: {
      // Все запросы, начинающиеся с /api, будут перенаправлены на бэкенд
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Мы не вырезаем /api из пути, так как бэкенд его ожидает
      },
    },
  },
});
