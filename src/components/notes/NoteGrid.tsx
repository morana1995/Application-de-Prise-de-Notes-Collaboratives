
import React from 'react';
import NoteCard, { NoteCardProps } from './NoteCard';

interface NoteGridProps {
  notes: Omit<NoteCardProps, 'onToggleFavorite' | 'onEdit' | 'onDelete' | 'onShare'>[];
  onToggleFavorite?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

const NoteGrid: React.FC<NoteGridProps> = ({ 
  notes, 
  onToggleFavorite, 
  onEdit, 
  onDelete, 
  onShare 
}) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
          No notes found
        </h3>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
          Get started by creating a new note
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {notes.map((note) => (
        <NoteCard 
          key={note.id}
          {...note}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
        />
      ))}
    </div>
  );
};

export default NoteGrid;
