import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const operations: any[] = [];

  if (body.categories) {
    for (const cat of body.categories) {
      operations.push(
        prisma.category.update({
          where: { id: cat.id },
          data: { position: cat.position },
        })
      );
    }
  }

  if (body.items) {
    for (const item of body.items) {
      operations.push(
        prisma.item.update({
          where: { id: item.id },
          data: {
            position: item.position,
            ...(item.categoryId && { categoryId: item.categoryId }),
          },
        })
      );
    }
  }

  await prisma.$transaction(operations);

  return NextResponse.json({ success: true });
}
