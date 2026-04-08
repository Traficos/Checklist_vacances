import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChecklistView } from "@/components/ChecklistView";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ChecklistPage({ params }: Props) {
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

  if (!checklist) notFound();

  return <ChecklistView initialData={JSON.parse(JSON.stringify(checklist))} />;
}
