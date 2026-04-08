"use client";

import { useState, useEffect, useCallback } from "react";
import { ProgressBar } from "./ProgressBar";
import { CategoryCard } from "./CategoryCard";
import { ToastContainer } from "./Toast";
import { useToast } from "@/hooks/useToast";
import { useLocalChecklists } from "@/hooks/useLocalChecklists";

interface Item {
  id: string;
  text: string;
  checked: boolean;
  note: string | null;
  dueDate: string | null;
  position: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  icon: string | null;
  position: number;
  items: Item[];
}

interface Checklist {
  id: string;
  title: string;
  description: string | null;
  shareToken: string;
  categories: Category[];
}

interface Props {
  initialData: Checklist;
}

export function ChecklistView({ initialData }: Props) {
  const [checklist, setChecklist] = useState<Checklist>(initialData);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(initialData.title);
  const { toasts, show: showToast } = useToast();
  const { save } = useLocalChecklists();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    save(checklist.shareToken, checklist.title);
  }, [checklist.shareToken, checklist.title, save]);

  const totalItems = checklist.categories.reduce((sum, c) => sum + c.items.length, 0);
  const checkedItems = checklist.categories.reduce(
    (sum, c) => sum + c.items.filter((i) => i.checked).length, 0
  );

  async function apiFetch(path: string, options?: RequestInit) {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      showToast("Une erreur est survenue", "error");
      throw new Error("API error");
    }
    if (res.status === 204) return null;
    return res.json();
  }

  async function updateTitle() {
    if (!titleDraft.trim()) return;
    setEditingTitle(false);
    const data = await apiFetch(`/api/checklists/${checklist.shareToken}`, {
      method: "PATCH",
      body: JSON.stringify({ title: titleDraft.trim() }),
    });
    if (data) setChecklist(data);
  }

  async function handleToggleItem(itemId: string, checked: boolean) {
    await apiFetch(`/api/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ checked }),
    });
    setChecklist((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => ({
        ...c,
        items: c.items.map((i) => (i.id === itemId ? { ...i, checked } : i)),
      })),
    }));
  }

  async function handleUpdateItem(itemId: string, data: Partial<Item>) {
    const updated = await apiFetch(`/api/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (updated) {
      setChecklist((prev) => ({
        ...prev,
        categories: prev.categories.map((c) => ({
          ...c,
          items: c.items.map((i) => (i.id === itemId ? { ...i, ...updated } : i)),
        })),
      }));
    }
  }

  async function handleDeleteItem(itemId: string) {
    await apiFetch(`/api/items/${itemId}`, { method: "DELETE" });
    setChecklist((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => ({
        ...c,
        items: c.items.filter((i) => i.id !== itemId),
      })),
    }));
  }

  async function handleAddItem(categoryId: string, text: string) {
    const item = await apiFetch(`/api/categories/${categoryId}/items`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    if (item) {
      setChecklist((prev) => ({
        ...prev,
        categories: prev.categories.map((c) =>
          c.id === categoryId ? { ...c, items: [...c.items, item] } : c
        ),
      }));
    }
  }

  async function handleAddCategory(name: string, icon?: string) {
    const category = await apiFetch(`/api/checklists/${checklist.shareToken}/categories`, {
      method: "POST",
      body: JSON.stringify({ name, icon }),
    });
    if (category) {
      setChecklist((prev) => ({
        ...prev,
        categories: [...prev.categories, { ...category, items: category.items || [] }],
      }));
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    await apiFetch(`/api/categories/${categoryId}`, { method: "DELETE" });
    setChecklist((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== categoryId),
    }));
  }

  const handleUpdateCategory = useCallback(async (categoryId: string, data: { name?: string; icon?: string }) => {
    const updated = await apiFetch(`/api/categories/${categoryId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (updated) {
      setChecklist((prev) => ({
        ...prev,
        categories: prev.categories.map((c) =>
          c.id === categoryId ? { ...c, ...updated } : c
        ),
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checklist.shareToken]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          {editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={updateTitle}
              onKeyDown={(e) => e.key === "Enter" && updateTitle()}
              className="text-2xl font-bold text-purple-700 bg-transparent border-b-2 border-purple-300 outline-none w-full"
            />
          ) : (
            <h1
              onClick={() => setEditingTitle(true)}
              className="text-2xl font-bold text-purple-700 cursor-pointer hover:text-purple-500 transition-colors"
            >
              {checklist.title}
            </h1>
          )}
        </div>
        <button
          onClick={handleCopyLink}
          className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          {copied ? "Copie !" : "Partager \uD83D\uDD17"}
        </button>
      </div>

      {/* Global progress */}
      <ProgressBar checked={checkedItems} total={totalItems} className="mb-8" />

      {/* Categories */}
      <div className="space-y-6">
        {checklist.categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onToggleItem={handleToggleItem}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onDeleteCategory={handleDeleteCategory}
            onUpdateCategory={handleUpdateCategory}
          />
        ))}
      </div>

      {/* Add category */}
      <AddCategoryButton onAdd={handleAddCategory} />

      <ToastContainer toasts={toasts} />
    </main>
  );
}

function AddCategoryButton({ onAdd }: { onAdd: (name: string, icon?: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
    setAdding(false);
  }

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="mt-6 w-full py-3 border-2 border-dashed border-purple-200 rounded-2xl text-purple-400 font-medium hover:border-purple-400 hover:text-purple-600 transition-colors"
      >
        + Ajouter une categorie
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 card flex gap-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de la categorie"
        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-purple-400"
      />
      <button type="submit" disabled={!name.trim()} className="btn-primary text-sm">
        Ajouter
      </button>
      <button type="button" onClick={() => setAdding(false)} className="px-3 py-2 text-gray-400 hover:text-gray-600">
        Annuler
      </button>
    </form>
  );
}
