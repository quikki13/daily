# 📓 Daily App

Полноценное кроссплатформенное приложение-дневник с mobile/web клинтами.

## 🛠 Технологический стек

| Часть системы | Технологии |
| :--- | :--- |
| **Backend API** | Node.js, Express |
| **Mobile App** | React Native, Expo, Zustand, NativeWind |
| **Web Client** | Vue 3 (Composition API), Vite |

---

## 🚀 Быстрый старт

Предполагается, что у вас установлены [Node.js](https://nodejs.org/) (v18+) и менеджер пакетов npm/yarn.

### 1. Клонирование репозитория
```bash
git clone [https://github.com/your-username/daily-journal.git](https://github.com/your-username/daily-journal.git)
cd daily-journal
```

### 2. Запуск Базы данных (Docker)
База данных PostgreSQL работает в изолированном контейнере. Перед запуском бэкенда необходимо поднять БД.
```bash
# Находясь в корне проекта, запускаем контейнер в фоновом режиме
docker-compose up -d
```

### 3. Запуск Backend API (Сервер)
Сервер обрабатывает запросы клиентов и общается с базой данных через Prisma ORM.

```bash
cd backend
npm install

# Переименуйте .env.example в .env (убедитесь, что DATABASE_URL совпадает с настройками из docker-compose)
cp .env.example .env

# Применение миграций к БД в Docker и генерация Prisma Client
npx prisma migrate dev
npx prisma generate

# Запуск в режиме разработчика (по умолчанию http://localhost:3000)
npm run dev
```

### 4. Запуск Web Client (Vue 3)
Веб-версия для использования в браузере.

```bash
cd frontend
npm install

npm run dev
```

### 5. Запуск Mobile App (React Native / Expo)
Мобильное приложение для iOS и Android.

```bash
cd mobile
npm install

npm run start -- -c
```

---

## 📂 Структура проекта (Монорепозиторий)

```text
daily-app/
├── docker-compose.yml     # Конфигурация Docker для запуска базы данных (PostgreSQL)
├── backend/               # Node.js API сервер
│   ├── prisma/            # Конфигурация БД и ORM
│   │   ├── schema.prisma  # Декларативная схема базы данных
│   │   └── migrations/    # SQL-миграции
│   ├── src/
│   │   ├── lib/           # Настройка prisma клиента
│   │   └── index.ts       # Точка входа Express (определение эндпоинтов, обработчики http)
├── frontend/              # Vue 3 веб-клиент
│   ├── src/
│   │   ├── components/    # Экраны/Страницы и переиспользуемые Vue-компоненты
│   │   ├── consts/        # Константы
│   │   ├── store/         # Pinia-стор
│   │   ├── utils/         # Хелперы
│   │   ├── App.vue        # Корневой компонент vue
│   │   ├── main.ts        # Точка входа
│   │   ├── api.ts         # Подключение axios клиента
│   │   └── assets/        # статика
├── mobile/                # React Native Expo приложение
│   ├── src/
│   │   ├── store/         # Zustand-стор
│   │   ├── api/           # Настройка axios клиента
│   │   ├── assets/        # статика
│   │   ├── screens/       # Экраны навигации (ListScreen, StatsScreen...)
│   │   ├── hooks/         # Хуки (useCalendar)
│   │   ├── consts/        # Константы мобилки
│   │   └── utils/         # Хелперы
└── README.md
```

## 📝 Заметки

* **Добавление миграций:** Любые изменения структуры ответа от бэкенда должны быть синхронизированы с типами `Entry` в мобильном сторе `useEntriesStore.ts`.
* **Изменение схемы БД:** `npx prisma migrate dev --name <описание_изменений>` При любых изменениях схемы БД необходимо запустить миграции и описать изменения для сохранения предидущей версии БД для возможности бэкапа.