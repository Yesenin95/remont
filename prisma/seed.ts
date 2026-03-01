import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable");
}

// Для seed используем прямое подключение без Accelerate
const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Пароли для тестовых пользователей
const PASSWORDS = {
  master: "TechFix@Master2024!SecureKey#9",
  owner: "TechFix@Owner2024!SecureKey#7",
  user: "User@TechFix2024!SecureKey#3",
};

async function main() {
  console.log("🌱 seeding database...");

  // Хешируем пароли
  const masterHash = await bcrypt.hash(PASSWORDS.master, 10);
  const ownerHash = await bcrypt.hash(PASSWORDS.owner, 10);
  const userHash = await bcrypt.hash(PASSWORDS.user, 10);

  // ============================================
  // ПОЛЬЗОВАТЕЛИ С РАЗНЫМИ РОЛЯМИ
  // ============================================
  
  // Мастер - может видеть заявки и работать с ними
  const master = await prisma.user.upsert({
    where: { email: "master@techfix.ru" },
    update: { passwordHash: masterHash },
    create: {
      email: "master@techfix.ru",
      name: "Иван Мастер",
      role: "MASTER",
      passwordHash: masterHash,
    },
  });

  // Владелец - полный доступ + управление товарами/запчастями
  const owner = await prisma.user.upsert({
    where: { email: "owner@techfix.ru" },
    update: { passwordHash: ownerHash },
    create: {
      email: "owner@techfix.ru",
      name: "Петр Владелец",
      role: "OWNER",
      passwordHash: ownerHash,
    },
  });

  // Обычный пользователь
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: { passwordHash: userHash },
    create: {
      email: "user@example.com",
      name: "Клиент",
      role: "USER",
      passwordHash: userHash,
    },
  });

  console.log("✅ Users created:", master.name, owner.name, user.name);

  // ============================================
  // КАТЕГОРИИ
  // ============================================
  
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: "smartphones" },
      update: {},
      create: {
        id: "smartphones",
        name: "Смартфоны",
        description: "Мобильные телефоны и смартфоны",
      },
    }),
    prisma.category.upsert({
      where: { id: "tablets" },
      update: {},
      create: {
        id: "tablets",
        name: "Планшеты",
        description: "Планшетные компьютеры",
      },
    }),
    prisma.category.upsert({
      where: { id: "laptops" },
      update: {},
      create: {
        id: "laptops",
        name: "Ноутбуки",
        description: "Ноутбуки и ультрабуки",
      },
    }),
    prisma.category.upsert({
      where: { id: "displays" },
      update: {},
      create: {
        id: "displays",
        name: "Дисплеи",
        description: "Запчасти для дисплеев",
      },
    }),
    prisma.category.upsert({
      where: { id: "batteries" },
      update: {},
      create: {
        id: "batteries",
        name: "Аккумуляторы",
        description: "Батареи и аккумуляторы",
      },
    }),
    prisma.category.upsert({
      where: { id: "cameras" },
      update: {},
      create: {
        id: "cameras",
        name: "Камеры",
        description: "Модули камер",
      },
    }),
  ]);

  console.log("✅ Categories created:", categories.length);

  // ============================================
  // ТОВАРЫ (ДЛЯ ПРОДАЖИ)
  // ============================================
  
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: "iphone-13-used" },
      update: {},
      create: {
        id: "iphone-13-used",
        name: "Apple iPhone 13",
        description: "Б/у iPhone 13 в отличном состоянии",
        price: 45000,
        cost: 35000,
        categoryId: "smartphones",
        brand: "Apple",
        model: "iPhone 13",
        condition: "USED",
        status: "AVAILABLE",
        quantity: 2,
        images: [],
      },
    }),
    prisma.product.upsert({
      where: { id: "iphone-14-pro-new" },
      update: {},
      create: {
        id: "iphone-14-pro-new",
        name: "Apple iPhone 14 Pro",
        description: "Новый iPhone 14 Pro, запечатанный",
        price: 85000,
        cost: 70000,
        categoryId: "smartphones",
        brand: "Apple",
        model: "iPhone 14 Pro",
        condition: "NEW",
        status: "AVAILABLE",
        quantity: 1,
        images: [],
      },
    }),
    prisma.product.upsert({
      where: { id: "samsung-s23-used" },
      update: {},
      create: {
        id: "samsung-s23-used",
        name: "Samsung Galaxy S23",
        description: "Б/у Samsung S23",
        price: 55000,
        cost: 45000,
        categoryId: "smartphones",
        brand: "Samsung",
        model: "Galaxy S23",
        condition: "USED",
        status: "AVAILABLE",
        quantity: 1,
        images: [],
      },
    }),
    prisma.product.upsert({
      where: { id: "macbook-air-m1" },
      update: {},
      create: {
        id: "macbook-air-m1",
        name: "MacBook Air M1",
        description: "Восстановленный MacBook Air на чипе M1",
        price: 75000,
        cost: 60000,
        categoryId: "laptops",
        brand: "Apple",
        model: "MacBook Air M1 2020",
        condition: "REFURBISHED",
        status: "AVAILABLE",
        quantity: 1,
        images: [],
      },
    }),
  ]);

  console.log("✅ Products created:", products.length);

  // ============================================
  // ЗАПЧАСТИ
  // ============================================
  
  const parts = await Promise.all([
    prisma.part.upsert({
      where: { id: "iphone-13-screen" },
      update: {},
      create: {
        id: "iphone-13-screen",
        name: "Дисплей iPhone 13",
        description: "Оригинальный дисплей для iPhone 13",
        price: 12000,
        cost: 8000,
        categoryId: "displays",
        brand: "Apple",
        compatibleModels: "iPhone 13",
        quantity: 5,
        minQuantity: 2,
        supplier: "Поставщик А",
        sku: "SCR-IP13-001",
        status: "IN_STOCK",
      },
    }),
    prisma.part.upsert({
      where: { id: "iphone-12-battery" },
      update: {},
      create: {
        id: "iphone-12-battery",
        name: "Аккумулятор iPhone 12",
        description: "Батарея повышенной ёмкости для iPhone 12",
        price: 3500,
        cost: 2000,
        categoryId: "batteries",
        brand: "Apple",
        compatibleModels: "iPhone 12, iPhone 12 Pro",
        quantity: 10,
        minQuantity: 3,
        supplier: "Поставщик Б",
        sku: "BAT-IP12-001",
        status: "IN_STOCK",
      },
    }),
    prisma.part.upsert({
      where: { id: "samsung-s22-camera" },
      update: {},
      create: {
        id: "samsung-s22-camera",
        name: "Камера Samsung S22",
        description: "Основная камера для Samsung Galaxy S22",
        price: 8000,
        cost: 5000,
        categoryId: "cameras",
        brand: "Samsung",
        compatibleModels: "Galaxy S22",
        quantity: 3,
        minQuantity: 2,
        supplier: "Поставщик В",
        sku: "CAM-S22-001",
        status: "LOW_STOCK",
      },
    }),
    prisma.part.upsert({
      where: { id: "usb-c-connector" },
      update: {},
      create: {
        id: "usb-c-connector",
        name: "USB-C разъём универсальный",
        description: "Подходит для многих моделей с USB-C",
        price: 500,
        cost: 200,
        categoryId: "displays",
        brand: "Generic",
        compatibleModels: "USB-C devices",
        quantity: 50,
        minQuantity: 10,
        supplier: "Поставщик Г",
        sku: "USB-C-001",
        status: "IN_STOCK",
      },
    }),
  ]);

  console.log("✅ Parts created:", parts.length);

  // ============================================
  // УСЛУГИ СЕРВИСА
  // ============================================
  
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

  // ============================================
  // ЗАЯВКИ НА РЕМОНТ (ДЛЯ ТЕСТА)
  // ============================================
  
  const repairs = await Promise.all([
    prisma.repairRequest.upsert({
      where: { id: "repair-1" },
      update: {},
      create: {
        id: "repair-1",
        customerName: "Алексей Петров",
        phone: "+79991234567",
        deviceModel: "iPhone 13",
        problem: "Разбит экран, нужна замена",
        status: "PENDING",
        serviceId: "screen-replacement",
        notes: "Клиент хочет оригинальную запчасть",
        assignedTo: master.id,
        requestNumber: "R-00001",
        repairStage: "DIAGNOSTICS",
      },
    }),
    prisma.repairRequest.upsert({
      where: { id: "repair-2" },
      update: {},
      create: {
        id: "repair-2",
        customerName: "Мария Иванова",
        phone: "+79997654321",
        deviceModel: "Samsung Galaxy S22",
        problem: "Быстро разряжается батарея",
        status: "IN_PROGRESS",
        serviceId: "battery-replacement",
        notes: "",
        assignedTo: master.id,
        requestNumber: "R-00002",
        repairStage: "REPAIR",
      },
    }),
    prisma.repairRequest.upsert({
      where: { id: "repair-3" },
      update: {},
      create: {
        id: "repair-3",
        customerName: "Дмитрий Сидоров",
        phone: "+79991112233",
        deviceModel: "MacBook Air M1",
        problem: "Не работает клавиатура",
        status: "PENDING",
        serviceId: "diagnostics",
        notes: "Требуется диагностика",
        requestNumber: "R-00003",
        repairStage: "DIAGNOSTICS",
      },
    }),
  ]);

  console.log("✅ Repair requests created:", repairs.length);

  console.log("🎉 Seeding completed!");
  console.log("");
  console.log("📋 Тестовые аккаунты:");
  console.log("   Мастер: master@techfix.ru / TechFix@Master2024!SecureKey#9");
  console.log("   Владелец: owner@techfix.ru / TechFix@Owner2024!SecureKey#7");
  console.log("   Клиент: user@example.com / User@TechFix2024!SecureKey#3");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
