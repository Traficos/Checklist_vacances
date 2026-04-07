import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await request.json();

  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const checklist = await prisma.checklist.findUnique({
    where: { shareToken: token },
  });

  if (!checklist) {
    return NextResponse.json({ error: "Checklist not found" }, { status: 404 });
  }

  const maxPosition = await prisma.category.aggregate({
    where: { checklistId: checklist.id },
    _max: { position: true },
  });

  const category = await prisma.category.create({
    data: {
      checklistId: checklist.id,
      name: body.name.trim(),
      icon: body.icon || null,
      position: (maxPosition._max.position ?? -1) + 1,
    },
    include: { items: true },
  });

  return NextResponse.json(category, { status: 201 });
}
