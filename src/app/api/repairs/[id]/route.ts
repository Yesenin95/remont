import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/repairs/[id] - получение одной заявки
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const repair = await prisma.repairRequest.findUnique({
      where: { id },
      include: {
        service: true,
        customer: true,
        assignedMaster: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        messages: {
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
        },
      },
    });

    if (!repair) {
      return NextResponse.json(
        { error: "Repair request not found" },
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

// PATCH /api/repairs/[id] - обновление заявки
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, assignedTo, notes, problem, deviceModel, repairStage, isReadyForPickup, pickupCode } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (notes !== undefined) updateData.notes = notes;
    if (problem) updateData.problem = problem;
    if (deviceModel) updateData.deviceModel = deviceModel;
    if (repairStage) updateData.repairStage = repairStage;
    if (isReadyForPickup !== undefined) updateData.isReadyForPickup = isReadyForPickup;
    if (pickupCode !== undefined) updateData.pickupCode = pickupCode;

    const repair = await prisma.repairRequest.update({
      where: { id },
      data: updateData,
      include: {
        service: true,
        assignedMaster: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(repair);
  } catch (error) {
    console.error("Error updating repair:", error);
    return NextResponse.json(
      { error: "Failed to update repair" },
      { status: 500 }
    );
  }
}

// DELETE /api/repairs/[id] - удаление заявки
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.repairRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting repair:", error);
    return NextResponse.json(
      { error: "Failed to delete repair" },
      { status: 500 }
    );
  }
}
