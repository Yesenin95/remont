import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable");
}

// Для seed используем прямое подключение без Accelerate
const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 seeding database...");

  // Создаём пользователей
  const user1 = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      name: "Alice Johnson",
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      name: "Bob Smith",
      role: "ADMIN",
    },
  });

  console.log("✅ Users created:", user1.name, user2.name);

  // Создаём посты
  const post1 = await prisma.post.create({
    data: {
      title: "Добро пожаловать в блог!",
      content: "Это первый пост в нашем блоге. Мы рады видеть вас здесь!",
      published: true,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Как работать с Next.js и Prisma",
      content: "В этом посте мы рассмотрим, как настроить Next.js с Prisma для работы с базой данных PostgreSQL...",
      published: true,
      authorId: user2.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "Черновик будущего поста",
      content: "Этот пост ещё не опубликован...",
      published: false,
      authorId: user1.id,
    },
  });

  console.log("✅ Posts created:", post1.title, post2.title, post3.title);

  // Создаём услуги сервиса
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: "screen-replacement" },
      update: {},
      create: {
        id: "screen-replacement",
        name: "Замена экрана",
        description: "Замена разбитого или неисправного экрана на новый оригинальный",
        price: 3500,
        category: "Дисплей",
        available: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "battery-replacement" },
      update: {},
      create: {
        id: "battery-replacement",
        name: "Замена аккумулятора",
        description: "Замена старой батареи на новую с увеличенной ёмкостью",
        price: 2000,
        category: "Аккумулятор",
        available: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "charging-port" },
      update: {},
      create: {
        id: "charging-port",
        name: "Замена разъёма зарядки",
        description: "Ремонт или замена разъёма для зарядки телефона",
        price: 1500,
        category: "Разъёмы",
        available: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "camera-replacement" },
      update: {},
      create: {
        id: "camera-replacement",
        name: "Замена камеры",
        description: "Замена основной или фронтальной камеры",
        price: 2500,
        category: "Камера",
        available: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "speaker-replacement" },
      update: {},
      create: {
        id: "speaker-replacement",
        name: "Замена динамика",
        description: "Замена разговорного или полифонического динамика",
        price: 1200,
        category: "Звук",
        available: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "water-damage" },
      update: {},
      create: {
        id: "water-damage",
        name: "Восстановление после воды",
        description: "Чистка и восстановление телефона после попадания влаги",
        price: 2500,
        category: "Ремонт",
        available: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "glass-replacement" },
      update: {},
      create: {
        id: "glass-replacement",
        name: "Замена стекла",
        description: "Замена защитного стекла без замены дисплея",
        price: 2000,
        category: "Дисплей",
        available: true,
      },
    }),
    prisma.service.upsert({
      where: { id: "diagnostics" },
      update: {},
      create: {
        id: "diagnostics",
        name: "Диагностика",
        description: "Полная диагностика устройства для выявления неисправностей",
        price: 0,
        category: "Услуги",
        available: true,
      },
    }),
  ]);

  console.log("✅ Services created:", services.length);
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
