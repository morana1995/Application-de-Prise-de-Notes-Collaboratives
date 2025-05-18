'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateNoteModal from '@/components/Notes/CreateNoteModal';

type Props = {
  onNoteCreated?: () => void;
};

const CreateNoteButton = ({ onNoteCreated }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Nouvelle note</Button>
      <CreateNoteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onNoteCreated={onNoteCreated}
      />
    </>
  );
};

export default CreateNoteButton;
