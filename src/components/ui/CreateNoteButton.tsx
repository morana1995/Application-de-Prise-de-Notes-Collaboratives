
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateNoteModal from '@/components/Notes/CreateNoteModal';

interface CreateNoteButtonProps {
  onNoteCreated?: () => void;
}

const CreateNoteButton: React.FC<CreateNoteButtonProps> = ({ onNoteCreated }) => {
  return (
    <CreateNoteModal 
      trigger={
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nouvelle note</span>
        </Button>
      }
      onNoteCreated={onNoteCreated}
    />
  );
};

export default CreateNoteButton;
