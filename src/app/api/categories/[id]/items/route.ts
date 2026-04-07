import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (!body.text || typeof body.text !== "string" || body.text.trim().length === 0) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const maxPosition = await prisma.item.aggregate({
    where: { categoryId: id },
    _max: { position: true },
  });

  const item = await prisma.item.create({
    data: {
      categoryId: id,
      text: body.text.trim(),
      position: (maxPosition._max.position ?? -1) + 1,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
