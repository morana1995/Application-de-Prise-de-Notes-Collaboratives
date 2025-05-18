// src/app/notes/NewNoteModal.tsx
import React, { useState } from "react";

interface NewNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (note: { title: string; category: string; content: string }) => void;
}

const categories = ["Personal", "Work", "Projects", "Ideas"];

export default function NewNoteModal({ open, onClose, onSave }: NewNoteModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [content, setContent] = useState("");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold text-violet-700 mb-4">New Note</h2>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-3"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-3"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <textarea
          placeholder="Start typing your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 min-h-[120px]"
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-violet-500 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              onSave({ title, category, content });
              onClose();
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
