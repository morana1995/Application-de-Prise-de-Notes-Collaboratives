'use client';

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Note, mockCategories } from "@/libs/data";
import { notesApi } from "@/libs/api";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  MoreVertical,
  Edit,
  Trash,
  Share,
  UserPlus
} from "lucide-react";
import { cn } from "@/libs/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import EditNoteModal from './EditNoteModal'; // adapte le chemin si besoin

interface NoteCardProps {
  note: Note;
  onNoteChanged?: () => void;
  onDelete?: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onNoteChanged }) => {
  const category = mockCategories.find(cat => cat.id === note.category);
  const formattedDate = formatDistanceToNow(new Date(note.updatedAt), {
    addSuffix: true,
    locale: fr
  });

  const router = useRouter();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleOpenNote = () => {
   router.push(`/note/${note.id}`);

  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedNote = await notesApi.toggleFavorite(note.id);
      if (updatedNote) {
        toast.success(updatedNote.isFavorite ? "Ajoutée aux favoris" : "Retirée des favoris");
        onNoteChanged?.(); // <-- rafraîchir la liste dans le parent
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Erreur lors de la modification des favoris");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditModalOpen(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Lien de partage copié");
  };

  const handleInvite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Invitation envoyée");
  };

  
const handleDelete = async (e: React.MouseEvent) => {
  e.stopPropagation();
  try {
    const success = await notesApi.deleteNote(note.id);
    if (success) {
      toast.success("Note supprimée avec succès");
      onDelete(note.id);
    }
  } catch {
    toast.error("Erreur lors de la suppression");
  }
};




  return (
    <>
      <Card className="h-full flex flex-col cursor-pointer hover:shadow-md transition-all" onClick={handleOpenNote}>
        <CardHeader className="pb-2 relative">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold line-clamp-1">{note.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", note.isFavorite ? "text-yellow-500" : "text-muted-foreground")}
                onClick={handleFavoriteToggle}
              >
                <Star size={16} fill={note.isFavorite ? "currentColor" : "none"} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={handleEdit}>
                    <Edit size={16} />
                    <span>Modifier</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={handleShare}>
                    <Share size={16} />
                    <span>Partager</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-2 cursor-pointer" onClick={handleInvite}>
                    <UserPlus size={16} />
                    <span>Inviter</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-2 cursor-pointer text-red-500" onClick={handleDelete}>
                    <Trash size={16} />
                    <span>Supprimer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {category && (
            <Badge
              variant="outline"
              className="mt-1 inline-flex items-center"
              style={{ borderColor: category.color + '80' }}
            >
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="py-2 flex-grow">
          <p className="text-sm text-muted-foreground note-content whitespace-pre-line line-clamp-3">
            {note.content}
          </p>
        </CardContent>
        <CardFooter className="pt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{category?.name ?? "Aucune catégorie"}</span>
          <span className="ml-auto">{formattedDate}</span>
        </CardFooter>
      </Card>

      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        note={note}
        onNoteUpdated={() => {
          setEditModalOpen(false);
          onNoteChanged?.(); // <-- rafraîchir la liste dans le parent
        }}
      />
    </>
  );
};

export default NoteCard;