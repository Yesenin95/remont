import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ number: string }>;
}

// GET /api/repairs/track/[number] - получение заявки по номеру для клиента
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { number } = await params;

    const repair = await prisma.repairRequest.findUnique({
      where: { requestNumber: number },
      select: {
        id: true,
        requestNumber: true,
        customerName: true,
        phone: true,
        deviceModel: true,
        problem: true,
        repairStage: true,
        status: true,
        isReadyForPickup: true,
        pickupCode: true,
        media: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!repair) {
      return NextResponse.json(
        { error: "Заявка не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(repair);
  } catch (error) {
    console.error("Error fetching repair:", error);
    return NextResponse.json(
      { error: "Failed to fetch repair" },
      { status: 500 }
    );
  }
}
