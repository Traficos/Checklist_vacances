"use client";

import Link from "next/link";
import { useLocalChecklists } from "@/hooks/useLocalChecklists";

export function RecentChecklists() {
  const { checklists } = useLocalChecklists();

  if (checklists.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Mes checklists récentes</h2>
      <div className="space-y-2">
        {checklists.map((c) => (
          <Link
            key={c.token}
            href={`/c/${c.token}`}
            className="card block hover:shadow-md transition-shadow py-3 px-4"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-purple-700">{c.title}</span>
              <span className="text-xs text-gray-400">
                {new Date(c.updatedAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
