import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Генерация уникального номера заявки
function generateRequestNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `R-${timestamp}${random}`;
}

// Отправка уведомления в Telegram
async function sendTelegramNotification(repair: any) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram credentials not configured");
    return;
  }

  const message = `
🔧 *Новая заявка на ремонт*

📋 *Номер:* ${repair.requestNumber}

👤 *Имя:* ${repair.customerName}
📞 *Телефон:* ${repair.phone}
📱 *Устройство:* ${repair.deviceModel}
❗ *Проблема:* ${repair.problem}
🛠️ *Услуга:* ${repair.service?.name || "Не указана"}

🕒 *Время:* ${new Date(repair.createdAt).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}
  `.trim();

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
}

// GET /api/repairs - получение списка заявок
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const assignedTo = searchParams.get("assignedTo") || undefined;
    const phone = searchParams.get("phone") || undefined; // Для фильтрации по телефону клиента
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    if (phone) {
      where.phone = phone;
    }

    const [repairs, total] = await Promise.all([
      prisma.repairRequest.findMany({
        where,
        include: {
          service: true,
          customer: true,
          assignedMaster: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.repairRequest.count({ where }),
    ]);

    return NextResponse.json({
      repairs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching repairs:", error);
    return NextResponse.json(
      { error: "Failed to fetch repairs" },
      { status: 500 }
    );
  }
}

// POST /api/repairs - создание новой заявки
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      deviceModel,
      problem,
      serviceId,
      customerId,
      notes,
      media,
    } = body;

    // Валидация обязательных полей
    if (!customerName || !phone || !deviceModel || !problem) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Генерируем уникальный номер заявки
    let requestNumber = generateRequestNumber();
    let exists = true;
    while (exists) {
      const existing = await prisma.repairRequest.findUnique({
        where: { requestNumber },
      });
      if (!existing) {
        exists = false;
      } else {
        requestNumber = generateRequestNumber();
      }
    }

    // Если serviceId не указан, создаём услугу по умолчанию
    let finalServiceId = serviceId;
    if (!finalServiceId) {
      const defaultService = await prisma.service.upsert({
        where: { id: "default-repair" },
        update: {},
        create: {
          id: "default-repair",
          name: "Ремонт по умолчанию",
          price: 0,
          category: "repair",
        },
      });
      finalServiceId = defaultService.id;
    }

    const repair = await prisma.repairRequest.create({
      data: {
        customerName,
        phone,
        deviceModel,
        problem,
        notes,
        serviceId: finalServiceId,
        customerId: customerId || undefined,
        status: "PENDING",
        requestNumber,
        media: media || [],
        pickupCode: phone.slice(-4), // Последние 4 цифры телефона
      },
      include: {
        service: true,
        customer: true,
      },
    });

    // Отправляем уведомление мастеру в Telegram
    await sendTelegramNotification(repair);

    return NextResponse.json({
      ...repair,
      message: "Заявка создана. Мастер получит уведомление в Telegram.",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating repair:", error);
    return NextResponse.json(
      { error: "Failed to create repair request" },
      { status: 500 }
    );
  }
}
