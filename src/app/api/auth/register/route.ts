import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    console.log("Register attempt:", { email, name });

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Введите email и пароль" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Создаём пользователя с ролью USER (клиент)
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        role: "USER",
      },
    });

    console.log("User created:", user.id);

    // Генерируем токен
    const token = `token-${user.id}-${Date.now()}`;

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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ошибка регистрации", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
