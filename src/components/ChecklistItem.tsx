"use client";

import { useState } from "react";

interface Item {
  id: string;
  text: string;
  checked: boolean;
  note: string | null;
  dueDate: string | null;
  position: number;
  categoryId: string;
}

interface Props {
  item: Item;
  onToggle: (id: string, checked: boolean) => void;
  onUpdate: (id: string, data: Partial<Item>) => void;
  onDelete: (id: string) => void;
}

export function ChecklistItem({ item, onToggle, onUpdate, onDelete }: Props) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 py-2.5 px-3 bg-white rounded-xl shadow-sm group">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle(item.id, !item.checked)}
          className="w-5 h-5 rounded-md border-2 border-purple-300 text-purple-600 focus:ring-purple-200 cursor-pointer accent-purple-600"
        />
        <div className="flex-1 min-w-0">
          <span className={`text-sm ${item.checked ? "line-through text-gray-400" : "text-gray-700"}`}>
            {item.text}
          </span>
          <div className="flex gap-2 mt-0.5">
            {item.note && <span className="text-xs text-purple-400">📝 Note</span>}
            {item.dueDate && (
              <span className="text-xs text-pink-400">
                📅 {new Date(item.dueDate).toLocaleDateString("fr-FR")}
              </span>
            )}
          </div>
        </div>
        <button onClick={() => setShowEdit(true)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-purple-500 transition-all text-sm">✏️</button>
        <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all text-sm">🗑️</button>
      </div>

      {showEdit && (
        <ItemEditInline item={item} onSave={(data) => { onUpdate(item.id, data); setShowEdit(false); }} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
}

function ItemEditInline({ item, onSave, onClose }: { item: Item; onSave: (data: Partial<Item>) => void; onClose: () => void }) {
  const [text, setText] = useState(item.text);
  const [note, setNote] = useState(item.note || "");
  const [dueDate, setDueDate] = useState(item.dueDate || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ text: text.trim(), note: note.trim() || null, dueDate: dueDate || null });
  }

  return (
    <form onSubmit={handleSubmit} className="ml-8 p-3 bg-purple-50 rounded-xl space-y-2 border border-purple-100">
      <input value={text} onChange={(e) => setText(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-purple-200 text-sm outline-none focus:border-purple-400" />
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ajouter une note..." rows={2} className="w-full px-3 py-1.5 rounded-lg border border-purple-200 text-sm outline-none focus:border-purple-400 resize-none" />
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">Date limite :</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="px-2 py-1 rounded-lg border border-purple-200 text-sm outline-none" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary text-xs py-1.5 px-4">Sauvegarder</button>
        <button type="button" onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600">Annuler</button>
      </div>
    </form>
  );
}
