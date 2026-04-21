import express, { Response, Request } from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";

const app = express();

// Middleware для CORS — разрешает фронтенду (на другом порту) делать запросы к нам
app.use(cors());
// Middleware для парсинга JSON — превращает тело запроса в удобный JS-объект
app.use(express.json());

// CRUD для Entities

/**
 * Маршрут: Создание записи
 * POST /api/entries
 */
app.post("/api/entries", async (req: Request, res: Response) => {
  const { content, date, tags } = req.body;

  try {
    const entry = await prisma.entry.create({
      data: {
        content,
        date: new Date(date),
        tags: {
          // Магия Prisma: если тег есть — подключаем, если нет — создаем новый
          connectOrCreate: tags.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: { tags: true },
    });

    console.log("Добавили запись");
    res.status(201).json(entry);
  } catch (err) {
    console.error("Ошибка создания:", err);
    res.status(500).json({ error: "Не удалось сохранить запись" });
  }
});

/**
 * Маршрут: Получение списка записей с фильтрами
 * GET /api/entries?start=...&end=...&tags=...
 */
app.get("/api/entries", async (req: Request, res: Response) => {
  const { start, end, tags } = req.query;

  const where: any = {};

  if (start && end) {
    where.date = {
      gte: new Date(start as string), // Greater Than curr or Equal
      lte: new Date(end as string), // Less Than curr or Equal
    };
  }

  if (tags) {
    const tagNames = (tags as string).split(",");
    where.tags = {
      some: {
        name: {
          in: tagNames,
        },
      },
    };
  }

  // where  сформировали

  try {
    const entries = await prisma.entry.findMany({
      where,
      include: { tags: true },
      orderBy: { date: "desc" },
    });

    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ error: "Не удалось получить данные" });
  }
});

/**
 * DELETE /api/entries/:id — Удаление записи
 */
app.delete("/api/entries/:id", async (req: Request, res: Response) => {
  const id = req.params.id?.toString();

  console.log(id);

  try {
    id &&
      (await prisma.entry.delete({
        where: { id },
      }));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Не удалось получить данные" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Ежедневник "Daily" запущен на http://localhost:${PORT}`);
});
