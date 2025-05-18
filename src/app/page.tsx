'use client';

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import CreateNoteButton from "@/components/ui/CreateNoteButton";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import NoteList from "@/components/Notes/NoteList";

const Index = () => {
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const authRes = await fetch("/api/user");
        if (!authRes.ok) {
          router.push("/login");
          return;
        }

        const { user } = await authRes.json();
        setUser(user);

        const notesRes = await fetch(`/api/notes?userId=${user.id}`);
        if (!notesRes.ok) {
         console.error("Erreur API /api/notes:", await notesRes.text());
          return;
      }
        const notesData = await notesRes.json();
        setNotes(notesData);
      } catch (err) {
        console.error("Erreur chargement données :", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [refresh]);

  const handleNoteCreated = () => setRefresh((r) => r + 1);

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
                  Bonjour, {user?.name?.split(" ")[0]}
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  Gérez et organisez vos notes facilement avec NoteNexus
                </p>
              </div>
              <CreateNoteButton onNoteCreated={handleNoteCreated} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <ToggleGroup type="single" defaultValue="grid" className="gap-1">
            <ToggleGroupItem value="grid" aria-label="Grille">Grille</ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Liste">Liste</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <NoteList key={refresh} notes={notes} />
      </div>
    </MainLayout>
  );
};

export default Index;
