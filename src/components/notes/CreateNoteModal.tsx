'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated?: () => void;
};

const CreateNoteModal = ({ isOpen, onClose, onNoteCreated }: Props) => {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // Récupération des catégories dynamiques
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
        setCategoryId(data[0]?.id || '');
      } catch (err) {
        console.error('Erreur lors du chargement des catégories :', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
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
        userEmail: session?.user?.email,
      };

      console.log('🟡 Données envoyées à l’API :', payload);

      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('🔴 Erreur API :', errorData);
        throw new Error(errorData?.message || 'Erreur lors de la création');
      }

      onNoteCreated?.();
      onClose();

      // Réinitialisation des champs
      setTitle('');
      setContent('');
      setCategoryId(categories[0]?.id || '');
      setIsPublic(false);
    } catch (err) {
      console.error('Création échouée :', err);
      alert('Erreur lors de la création de la note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
          <Select onValueChange={setCategoryId} value={categoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className='bg-white'>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Contenu"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            disabled={loading}
          />
          <div className="flex items-center space-x-3 ">
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="isPublic">{isPublic ? 'Note publique' : 'Note privée'}</Label>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={loading}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;
