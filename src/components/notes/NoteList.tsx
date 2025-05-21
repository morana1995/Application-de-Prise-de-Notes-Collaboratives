'use client';

import React, { useState } from "react";
import NoteCard from "./NoteCard";
import { Note } from "@/libs/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { notesApi } from "@/libs/api";

interface NoteListProps {
  notes?: Note[];
  onNotesUpdated?: () => void; // Callback appelé quand les notes changent
}

const sortOptions = [
  { value: "updated", label: "Mis à jour" },
  { value: "created", label: "Date de création" },
  { value: "alphabetical", label: "Alphabétique" },
];

const NoteList: React.FC<NoteListProps> = ({ notes: propNotes = [], onNotesUpdated }) => {
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("updated");
  const [isLoading, setIsLoading] = useState(false);

  const getSortedNotes = () => {
    if (!Array.isArray(propNotes)) return [];
    return [...propNotes].sort((a, b) => {
      if (sortBy === "updated") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortBy === "created") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  };

  const handleNoteDeleted = async (noteId: string) => {
    setIsLoading(true);
    try {
      const success = await notesApi.deleteNote(noteId);
      if (success) {
        toast.success("Note supprimée avec succès");
        if (onNotesUpdated) onNotesUpdated(); // On relance la récupération
      } else {
        toast.error("Échec de la suppression");
      }
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  // Cette fonction sera appelée par NoteCard à chaque changement d'une note (édition, etc.)
  const handleNoteChanged = () => {
    if (onNotesUpdated) {
      onNotesUpdated();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes notes</h1>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tabs value={view} onValueChange={setView} className="w-[180px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grille</TabsTrigger>
              <TabsTrigger value="list">Liste</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {getSortedNotes().map((note) => (
           

            <NoteCard
  key={note.id}
  note={note}
  onNoteChanged={onNotesUpdated}
  onDelete={handleNoteDeleted}
/>

          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
