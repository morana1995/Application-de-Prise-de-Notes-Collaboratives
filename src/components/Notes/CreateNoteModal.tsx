'use client';
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Category, mockCategories, currentUser } from "@/libs/data";
import { notesApi, categoriesApi } from "@/lib/api";
import { Loader2 } from "lucide-react";
import NoteEditor from "./NoteEditor";

interface CreateNoteModalProps {
  trigger: React.ReactNode;
  onNoteCreated?: () => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ trigger, onNoteCreated }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const data = await categoriesApi.getAllCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategory(data[0].id);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      loadCategories();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSaving(true);
    try {
      await notesApi.createNote({
        title,
        content,
        category,
        isFavorite: false,
        isPublic: false,
        author: currentUser,
        collaborators: []
      });
      
      // Réinitialiser le formulaire et fermer le modal
      setTitle("");
      setContent("");
      setCategory(categories.length > 0 ? categories[0].id : "");
      setOpen(false);
      
      // Callback pour actualiser la liste des notes
      if (onNoteCreated) {
        onNoteCreated();
      }
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle note</DialogTitle>
            <DialogDescription>
              Ajoutez une note à votre collection. Cliquez sur enregistrer quand vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la note"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm text-muted-foreground">Chargement des catégories...</span>
                </div>
              ) : (
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: cat.color }}
                          ></div>
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Contenu</Label>
              <NoteEditor initialValue={content} onChange={setContent} />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving || !title.trim()}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Créer la note"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;
