import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Введите email и пароль" },
        { status: 400 }
      );
    }

    // Ищем пользователя по email или телефону
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email },
          { phone: email }, // Пробуем найти по телефону
        ],
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, customer.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // В реальном приложении здесь нужно сгенерировать JWT токен
    // Для простоты возвращаем ID пользователя
    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      phone: customer.phone,
      name: customer.name,
      token: `fake-token-${customer.id}`, // Заглушка для токена
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Ошибка авторизации" },
      { status: 500 }
    );
  }
}
