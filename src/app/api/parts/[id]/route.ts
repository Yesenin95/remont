import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/parts/[id] - получение одной запчасти
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const part = await prisma.part.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!part) {
      return NextResponse.json(
        { error: "Part not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(part);
  } catch (error) {
    console.error("Error fetching part:", error);
    return NextResponse.json(
      { error: "Failed to fetch part" },
      { status: 500 }
    );
  }
}

// PATCH /api/parts/[id] - обновление запчасти (только OWNER)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    const allowedFields = [
      "name",
      "description",
      "price",
      "cost",
      "categoryId",
      "brand",
      "compatibleModels",
      "quantity",
      "minQuantity",
      "supplier",
      "sku",
      "status",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (["price", "cost", "quantity", "minQuantity"].includes(field)) {
          updateData[field] = parseInt(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    const part = await prisma.part.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(part);
  } catch (error) {
    console.error("Error updating part:", error);
    return NextResponse.json(
      { error: "Failed to update part" },
      { status: 500 }
    );
  }
}

// DELETE /api/parts/[id] - удаление запчасти (только OWNER)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.part.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting part:", error);
    return NextResponse.json(
      { error: "Failed to delete part" },
      { status: 500 }
    );
  }
}
