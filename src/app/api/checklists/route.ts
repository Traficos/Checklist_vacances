import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { getTemplateById } from "@/lib/templates";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, templateId } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const shareToken = nanoid(12);

  const checklist = await prisma.checklist.create({
    data: {
      title: title.trim(),
      shareToken,
      categories: templateId
        ? {
            create:
              getTemplateById(templateId)?.categories.map(
                (cat, catIndex) => ({
                  name: cat.name,
                  icon: cat.icon,
                  position: catIndex,
                  items: {
                    create: cat.items.map((itemText, itemIndex) => ({
                      text: itemText,
                      position: itemIndex,
                    })),
                  },
                })
              ) ?? [],
          }
        : undefined,
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

  return NextResponse.json(checklist, { status: 201 });
}
