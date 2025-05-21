'use client';

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MoreVertical, Edit, Trash, Share, UserPlus } from "lucide-react";
import { cn } from "@/libs/utils";
import { toast } from "sonner";
import { notesApi } from "@/libs/api";
import { useRouter } from "next/navigation";

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
      name: string;
      image?: string | null;
    };
    category?: {
      name: string;
      color?: string; // à adapter si pas stocké
    };
    collaborators?: any[];
  };
  onNoteChanged?: () => void;
  onDelete?: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onNoteChanged, onDelete }) => {
  const formattedDate = formatDistanceToNow(new Date(note.updatedAt), {
    addSuffix: true,
    locale: fr
  });

  const router = useRouter();

  const handleOpenNote = () => {
    router.push(`/note/${note.id}`);
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedNote = await notesApi.toggleFavorite(note.id, note.isFavorite);
      if (updatedNote) {
        toast.success(updatedNote.isFavorite ? "Ajoutée aux favoris" : "Retirée des favoris");
        onNoteChanged?.();
      }
    } catch (error) {
      toast.error("Erreur lors de la modification des favoris");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notesApi.deleteNote(note.id);
      toast.success("Note supprimée");
      onDelete?.(note.id);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/note/${note.id}`);
  };

  return (
    <Card
      className="h-full flex flex-col cursor-pointer hover:shadow-md transition-all"
      onClick={handleOpenNote}
    >
      <CardHeader className="pb-2 relative">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {note.title}
          </CardTitle>
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
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit size={16} className="mr-2" /> Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success("Lien copié"); }}>
                  <Share size={16} className="mr-2" /> Partager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success("Invitation envoyée"); }}>
                  <UserPlus size={16} className="mr-2" /> Inviter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash size={16} className="mr-2" /> Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {note.category?.name && (
          <Badge variant="outline" className="mt-1 inline-flex items-center"
            style={note.category.color ? { borderColor: note.category.color + '80' } : {}}
          >
            {note.category.color && (
              <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: note.category.color }} />
            )}
            {note.category.name}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-3">
          {note.content}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={note.user.image || undefined} />
            <AvatarFallback>{note.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>
            {note.user.name}
            {note.collaborators && note.collaborators.length > 0 && (
              <span> +{note.collaborators.length}</span>
            )}
          </span>
        </div>
        <span>{formattedDate}</span>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
