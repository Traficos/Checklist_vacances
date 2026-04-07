import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const item = await prisma.item.update({
    where: { id },
    data: {
      ...(body.text !== undefined && { text: body.text.trim() }),
      ...(body.checked !== undefined && { checked: body.checked }),
      ...(body.note !== undefined && { note: body.note || null }),
      ...(body.dueDate !== undefined && {
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      }),
    },
  });

  return NextResponse.json({
    ...item,
    dueDate: item.dueDate ? item.dueDate.toISOString().split("T")[0] : null,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.item.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
