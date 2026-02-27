import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, password } = body;

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен быть не менее 6 символов" },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Укажите email или телефон" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли уже пользователь
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {},
        ].filter(Boolean),
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Пользователь с таким email или телефоном уже существует" },
        { status: 400 }
      );
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём клиента
    const customer = await prisma.customer.create({
      data: {
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      phone: customer.phone,
    }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ошибка регистрации" },
      { status: 500 }
    );
  }
}
