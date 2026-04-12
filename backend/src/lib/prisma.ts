import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// Создаем коннект к нашей базу DATABASE_URL
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// адаптер для синхронизации кода призмы и postgres
const adapter = new PrismaPg(pool);

// Клиент призмы через который будем дергать базу
export const prisma = new PrismaClient({ adapter });