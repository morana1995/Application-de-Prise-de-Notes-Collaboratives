'use client';

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import CreateNoteButton from "@/components/ui/CreateNoteButton";
import { authService } from "@/libs/auth-service";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import NoteList from "@/components/Notes/NoteList"; // à décommenter plus tard si nécessaire

const Index = () => {
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      if (!authService.isLoggedIn()) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Échec récupération utilisateur");
        const data = await res.json();
        setUserName(data.user.name || "Utilisateur");
      } catch (error) {
        console.error("Erreur récupération utilisateur :", error);
      }

      try {
        const res = await fetch("/api/notes");
        if (!res.ok) return;
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        // Erreur silencieuse
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
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
      <div className="flex flex-col gap-6 px-2 md:px-4">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  Bonjour, Bienvenue, {userName.split(" ")[0]}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Gérez et organisez vos notes facilement avec NoteNexus
                </p>
              </div>
              <CreateNoteButton onNoteCreated={handleNoteCreated} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="outline" className="text-sm font-normal flex items-center gap-1">
            Mis à jour <ChevronDown className="h-4 w-4" />
          </Button>

          <ToggleGroup type="single" defaultValue="grid" className="gap-1">
            <ToggleGroupItem value="grid" aria-label="Grille">Grille</ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Liste">Liste</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* 
          // TODO: Décommenter quand le composant NoteList est prêt
          <NoteList key={refresh} notes={notes} view="grid" />
        */}
      </div>
    </MainLayout>
  );
};

export default Index;
