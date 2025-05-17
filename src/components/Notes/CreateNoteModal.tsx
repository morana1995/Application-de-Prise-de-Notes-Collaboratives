import React, { useEffect, useState } from "react";
import { notesApi, categoriesApi } from "@/libs/api";

interface Category {
  id: string;
  name: string;
}

interface Props {
  userId: string;
  onClose: () => void;
  onNoteCreated: () => void;
}

const CreateNoteModal: React.FC<Props> = ({ userId, onClose, onNoteCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      if (!userId) return;
      const cats = await categoriesApi.getAllCategories(userId);
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    }
    fetchCategories();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) return;

    setLoading(true);
    try {
      await notesApi.createNote({
        title,
        content,
        userId,
        categoryId,
      });
      setTitle("");
      setContent("");
      setCategoryId(categories.length > 0 ? categories[0].id : null);
      onNoteCreated();
      onClose();
    } catch (error) {
      // erreur déjà affichée dans api.ts via toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Créer une nouvelle note</h2>

        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <select
          value={categoryId || ""}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer"}
        </button>
        <button type="button" onClick={onClose} disabled={loading}>
          Annuler
        </button>
      </form>
    </div>
  );
};

export default CreateNoteModal;
