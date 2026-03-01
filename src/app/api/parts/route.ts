import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/parts - получение списка запчастей
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const status = searchParams.get("status") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};

    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (brand) where.brand = brand;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { compatibleModels: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const [parts, total] = await Promise.all([
      prisma.part.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.part.count({ where }),
    ]);

    return NextResponse.json({
      parts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching parts:", error);
    return NextResponse.json(
      { error: "Failed to fetch parts" },
      { status: 500 }
    );
  }
}

// POST /api/parts - создание запчасти (только OWNER)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      cost,
      categoryId,
      brand,
      compatibleModels,
      quantity,
      minQuantity,
      supplier,
      sku,
    } = body;

    // Валидация
    if (!name || !categoryId || !brand) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const part = await prisma.part.create({
      data: {
        name,
        description: description || null,
        price: parseInt(price) || 0,
        cost: parseInt(cost) || 0,
        categoryId,
        brand,
        compatibleModels: compatibleModels || null,
        quantity: parseInt(quantity) || 0,
        minQuantity: parseInt(minQuantity) || 5,
        supplier: supplier || null,
        sku: sku || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(part, { status: 201 });
  } catch (error) {
    console.error("Error creating part:", error);
    return NextResponse.json(
      { error: "Failed to create part" },
      { status: 500 }
    );
  }
}
