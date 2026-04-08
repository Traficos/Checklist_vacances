"use client";

import { useState } from "react";
import { ChecklistItem } from "./ChecklistItem";
import { ProgressBar } from "./ProgressBar";

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

interface Props {
  category: Category;
  dragHandleProps?: any;
  onToggleItem: (id: string, checked: boolean) => void;
  onAddItem: (categoryId: string, text: string) => void;
  onUpdateItem: (id: string, data: Partial<Item>) => void;
  onDeleteItem: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateCategory: (id: string, data: { name?: string; icon?: string }) => void;
}

export function CategoryCard({
  category, dragHandleProps, onToggleItem, onAddItem, onUpdateItem, onDeleteItem, onDeleteCategory, onUpdateCategory,
}: Props) {
  const [newItemText, setNewItemText] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(category.name);

  const checkedCount = category.items.filter((i) => i.checked).length;

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(category.id, newItemText.trim());
    setNewItemText("");
  }

  function handleSaveName() {
    if (nameDraft.trim() && nameDraft.trim() !== category.name) {
      onUpdateCategory(category.id, { name: nameDraft.trim() });
    }
    setEditingName(false);
  }

  return (
    <div className="card">
      {/* Category header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <span {...dragHandleProps} className="cursor-grab text-gray-300 hover:text-gray-500">⠿</span>
          )}
          <span className="text-xl">{category.icon || "📋"}</span>
          {editingName ? (
            <input autoFocus value={nameDraft} onChange={(e) => setNameDraft(e.target.value)}
              onBlur={handleSaveName} onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              className="font-semibold text-gray-800 bg-transparent border-b-2 border-purple-300 outline-none" />
          ) : (
            <h3 onClick={() => setEditingName(true)}
              className="font-semibold text-gray-800 cursor-pointer hover:text-purple-600 transition-colors">
              {category.name}
            </h3>
          )}
        </div>
        <button onClick={() => onDeleteCategory(category.id)}
          className="text-gray-300 hover:text-red-500 transition-colors text-sm" title="Supprimer la categorie">🗑️</button>
      </div>

      {/* Category progress */}
      <ProgressBar checked={checkedCount} total={category.items.length} className="mb-4" />

      {/* Items */}
      <div className="space-y-2">
        {category.items.map((item) => (
          <ChecklistItem key={item.id} item={item} onToggle={onToggleItem} onUpdate={onUpdateItem} onDelete={onDeleteItem} />
        ))}
      </div>

      {/* Add item form */}
      <form onSubmit={handleAddItem} className="mt-3 flex gap-2">
        <input value={newItemText} onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Ajouter un element..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 transition-colors" />
        <button type="submit" disabled={!newItemText.trim()} className="btn-primary text-xs py-2 px-4">+</button>
      </form>
    </div>
  );
}
