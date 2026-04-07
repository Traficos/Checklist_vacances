import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const checklist = await prisma.checklist.findUnique({
    where: { shareToken: token },
    include: {
      categories: {
        orderBy: { position: "asc" },
        include: {
          items: { orderBy: { position: "asc" } },
        },
      },
    },
  });

  if (!checklist) {
    return NextResponse.json({ error: "Checklist not found" }, { status: 404 });
  }

  return NextResponse.json(checklist);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await request.json();

  const checklist = await prisma.checklist.findUnique({
    where: { shareToken: token },
  });

  if (!checklist) {
    return NextResponse.json({ error: "Checklist not found" }, { status: 404 });
  }

  const updated = await prisma.checklist.update({
    where: { shareToken: token },
    data: {
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.description !== undefined && { description: body.description }),
    },
    include: {
      categories: {
        orderBy: { position: "asc" },
        include: {
          items: { orderBy: { position: "asc" } },
        },
      },
    },
  });

  return NextResponse.json(updated);
}
