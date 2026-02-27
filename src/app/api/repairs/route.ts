import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const repairs = await prisma.repairRequest.findMany({
      include: {
        service: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(repairs);
  } catch (error) {
    console.error("Error fetching repairs:", error);
    return NextResponse.json(
      { error: "Failed to fetch repairs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, deviceModel, problem, serviceId, notes } = body;

    if (!customerName || !phone || !deviceModel || !problem || !serviceId) {
      return NextResponse.json(
        { error: "Все обязательные поля должны быть заполнены" },
        { status: 400 }
      );
    }

    const repair = await prisma.repairRequest.create({
      data: {
        customerName,
        phone,
        deviceModel,
        problem,
        serviceId,
        notes: notes || null,
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json(repair, { status: 201 });
  } catch (error) {
    console.error("Error creating repair:", error);
    return NextResponse.json(
      { error: "Failed to create repair request" },
      { status: 500 }
    );
  }
}
