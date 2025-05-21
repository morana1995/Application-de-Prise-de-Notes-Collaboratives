'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type CategoryType = {
  id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  note: {
    id: string;
    title: string;
    content: string;
    isPublic: boolean;
    category?: CategoryType | null; // category peut être undefined ou null
  };
  onNoteUpdated?: (updatedNote: any) => void;
};

const EditNoteModal = ({ isOpen, onClose, note, onNoteUpdated }: Props) => {
  // Protection avec opérateur optionnel et valeur par défaut
  const [title, setTitle] = useState(note.title ?? '');
  const [content, setContent] = useState(note.content ?? '');
  const [categoryId, setCategoryId] = useState(note.category?.id ?? '');
  const [isPublic, setIsPublic] = useState(note.isPublic ?? false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    setTitle(note.title ?? '');
    setContent(note.content ?? '');
    setCategoryId(note.category?.id ?? '');
    setIsPublic(note.isPublic ?? false);
  }, [note]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Erreur de chargement des catégories :', err);
      }
    };
    fetchCategories();
  }, []);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim() || !categoryId) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        content,
        isPublic,
        categoryId,
      };

      const res = await fetch(`/api/notes?id=${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erreur de mise à jour:', errorText);
        throw new Error('Erreur lors de la mise à jour');
      }

      const updatedNote = await res.json();
      onNoteUpdated?.(updatedNote);
      onClose();
    } catch (err) {
      console.error('Erreur :', err);
      alert('Erreur lors de la mise à jour de la note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier la note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
          <Select onValueChange={setCategoryId} value={categoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="bg-white">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            disabled={loading}
          />
          <div className="flex items-center space-x-3">
            <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="isPublic">{isPublic ? 'Note publique' : 'Note privée'}</Label>
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleUpdate} disabled={loading} className="bg-violet-600 text-white hover:bg-violet-700">
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteModal;
