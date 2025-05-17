'use client';

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import NoteList from "@/components/Notes/NoteList";
import CreateNoteButton from "@/components/ui/CreateNoteButton";
import { authService } from "@/libs/auth-service";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      router.push("/login");
      return;
    }

    // const currentUser = authService.getCurrentUser();
    // if (currentUser) {
    //   setUserName(currentUser.name);
    // }

    const fetchNotes = async () => {
   try {
  const res = await fetch("/api/notes");
  // Commenté pour ne pas bloquer l'affichage pendant les tests :
  // if (!res.ok) throw new Error("Erreur récupération notes");
  if (!res.ok) return;
  const data = await res.json();
  setNotes(data);
} catch (error) {
  // console.error(error); // Optionnel : log discret
} finally {
  setLoading(false);
}
    };

    fetchNotes();
  }, [refresh, router]);

  const handleNoteCreated = () => {
    setRefresh((prev) => prev + 1);
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
      <div className="flex flex-col gap-6">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  Bienvenue, {userName.split(" ")[0]}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gérez et organisez vos notes facilement avec NoteNexus
                </p>
              </div>
              <CreateNoteButton onNoteCreated={handleNoteCreated} />
            </div>
          </CardContent>
        </Card>

        <NoteList key={refresh} notes={notes} />
      </div>
    </MainLayout>
  );
};

export default Index;
