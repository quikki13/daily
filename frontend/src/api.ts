import axios from "axios";

// Благодаря прокси в vite.config.ts нам НЕ НУЖНО писать http://localhost:3000
const api = axios.create({
  baseURL: "/",
});

export default api;
