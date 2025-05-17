'use client';
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Note, mockCategories } from "@/libs/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MoreVertical, Edit, Trash, Share, UserPlus } from "lucide-react";
import { cn } from "@/libs/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { notesApi } from "@/libs/api";

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const category = mockCategories.find(cat => cat.id === note.category);
  const formattedDate = formatDistanceToNow(new Date(note.updatedAt), {
    addSuffix: true,
    locale: fr
  });
  const navigate = useNavigate();

  const handleOpenNote = () => {
    navigate(`/note/${note.id}`);
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Pour éviter d'ouvrir la note
    try {
      const updatedNote = await notesApi.toggleFavorite(note.id);
      if (updatedNote) {
        toast.success(updatedNote.isFavorite ? "Ajoutée aux favoris" : "Retirée des favoris");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Erreur lors de la modification des favoris");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/note/${note.id}`);
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
      await notesApi.deleteNote(note.id);
      toast.success("Note supprimée");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Erreur lors de la suppression de la note");
    }
  };

  return (
    <Card className="h-full flex flex-col cursor-pointer hover:shadow-md transition-all" onClick={handleOpenNote}>
      <CardHeader className="pb-2 relative">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">{note.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8", 
                note.isFavorite ? "text-yellow-500" : "text-muted-foreground"
              )}
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
              <DropdownMenuContent align="end">
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
                <DropdownMenuItem className="flex gap-2 cursor-pointer text-destructive" onClick={handleDelete}>
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
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={note.author.avatar} />
            <AvatarFallback>{note.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>
            {note.author.name}
            {note.collaborators.length > 0 && (
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
