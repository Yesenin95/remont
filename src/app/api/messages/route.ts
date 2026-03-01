import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/messages?repairRequestId=xxx - получение сообщений заявки
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repairRequestId = searchParams.get("repairRequestId");

    if (!repairRequestId) {
      return NextResponse.json(
        { error: "repairRequestId required" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { repairRequestId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/messages - отправка сообщения
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, repairRequestId, senderId } = body;

    if (!content || !repairRequestId || !senderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        repairRequestId,
        senderId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
