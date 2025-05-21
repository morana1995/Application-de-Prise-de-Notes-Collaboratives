'use client';

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CreateNoteButton from "@/components/ui/CreateNoteButton";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import NoteList from "@/components/notes/NoteList";
import { useSession } from "next-auth/react";

const Index = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const loadNotes = async () => {
      if (!session?.user?.id) return;

      try {
      const res = await fetch(`/api/notes?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Erreur lors de la récupération des notes");
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      loadNotes();
    }
  }, [session, status, refresh]);

  const handleNoteCreated = () => setRefresh((r) => r + 1);
  const handleNotesUpdated = (updatedNote) => {
    if (!updatedNote || !updatedNote.id) return;

    setNotes((prevNotes) => {
      const index = prevNotes.findIndex((n) => n.id === updatedNote.id);
      if (index !== -1) {
        const newNotes = [...prevNotes];
        newNotes[index] = updatedNote;
        return newNotes;
      }
      return [updatedNote, ...prevNotes];
    });
  };
  const handleNoteDeleted = (id: string) => {
  setNotes((prev) => prev.filter((note) => note.id !== id));
};


  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 px-2 md:px-4">
        <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  Bonjour, {session?.user?.name?.split(" ")[0]}
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  Gérez et organisez vos notes facilement avec NoteNexus
                </p>
              </div>
              <CreateNoteButton onNoteCreated={handleNoteCreated} />
            </div>
          </CardContent>
        </Card>

        <NoteList
  notes={notes}
  onNotesUpdated={handleNotesUpdated}
  onNoteDeleted={handleNoteDeleted}
/>

        
      </div>
    </MainLayout>
  );
};

export default Index;