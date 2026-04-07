"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTemplates } from "@/lib/templates";
import { useLocalChecklists } from "@/hooks/useLocalChecklists";

export function CreateChecklistForm() {
  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { save } = useLocalChecklists();
  const templates = getTemplates();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          templateId: templateId || undefined,
        }),
      });
      const data = await res.json();
      save(data.shareToken, data.title);
      router.push(`/c/${data.shareToken}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
          Nom de votre checklist
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Vacances été 2026"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
        />
      </div>

      <div>
        <label htmlFor="template" className="block text-sm font-semibold text-gray-700 mb-1">
          Partir d'un template
        </label>
        <select
          id="template"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white"
        >
          <option value="">Aucun template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={!title.trim() || loading}
        className="btn-primary w-full"
      >
        {loading ? "Création..." : "Créer ma checklist"}
      </button>
    </form>
  );
}
