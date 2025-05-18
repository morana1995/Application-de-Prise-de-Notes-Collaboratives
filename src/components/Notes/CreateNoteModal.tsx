'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          userId: session?.user?.id, // ou user._id si ça vient de la route /api/user
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la création');

      onNoteCreated?.();
      onClose();
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Création échouée :', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle note</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;
