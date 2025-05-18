'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateNoteModal from '@/components/Notes/CreateNoteModal';
import { Plus } from 'lucide-react'; // 👈 import icône

type Props = {
  onNoteCreated?: () => void;
};

const CreateNoteButton = ({ onNoteCreated }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> Nouvelle note
      </Button>
      <CreateNoteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onNoteCreated={onNoteCreated}
      />
    </>
  );
};

export default CreateNoteButton;
