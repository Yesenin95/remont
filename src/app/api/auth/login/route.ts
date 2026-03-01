import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Login attempt:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Введите email и пароль" },
        { status: 400 }
      );
    }

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 401 }
      );
    }

    // Проверяем пароль с хешем
    if (!user.passwordHash) {
      console.log("No password hash for user:", email);
      return NextResponse.json(
        { error: "Пароль не установлен" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    console.log("Password valid:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Неверный пароль" },
        { status: 401 }
      );
    }

    // Генерируем простой токен
    const token = `token-${user.id}-${Date.now()}`;

    console.log("Login successful:", email);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");
    return NextResponse.json(
      { error: "Ошибка авторизации", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
