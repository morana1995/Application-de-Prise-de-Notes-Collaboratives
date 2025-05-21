"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, FileText, Star, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { AdminStatsCard } from "@/components/Admin/AdminStatsCard";
import { AdminActivityChart } from "@/components/Admin/AdminActivityChart";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  image?: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  isPublic: boolean;
  updatedAt: string;
  [key: string]: any;
}

const Dashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les utilisateurs (admin uniquement)
        const userRes = await fetch("/api/user?all=true");
        if (userRes.status === 403) {
          toast.error("Accès non autorisé.");
          router.push("/");
          return;
        }
        const userData = await userRes.json();
        setUsers(userData.users || []);

        // Récupérer les notes
        const notesRes = await fetch("/api/notes");
        const notesData = await notesRes.json();
        setNotes(notesData || []);

        // Récupérer les catégories
    const catRes = await fetch("/api/categorie");
    const catData = await catRes.json();
    setCategories(catData || []);

        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement admin :", error);
        toast.error("Erreur lors du chargement des données.");
        router.push("/");
      }
    };

    fetchData();
  }, [router]);

  // Calculer les statistiques
  const totalUsers = users.length;
  const totalNotes = notes.length;
  const sharedNotes = notes.filter(note => note.isPublic).length;
  const favoriteNotes = notes.filter(note => note.isFavorite).length;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentActivities = notes
    .filter(note => {
      const updatedDate = new Date(note.updatedAt);
      return updatedDate >= sevenDaysAgo;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map(note => {
      const user = users.find(u => u.id === note.userId) || { id: "", name: "Inconnu" };
      return {
        ...note,
        updatedAt: new Date(note.updatedAt),
        user: {
          ...user,
          name: user.name ?? "Inconnu"
        }
      };
    });

  const statsCards = [
    {
      title: "Utilisateurs",
      value: totalUsers,
      description: "Nombre total d'utilisateurs",
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      title: "Notes",
      value: totalNotes,
      description: "Nombre total de notes",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      title: "Notes partagées",
      value: sharedNotes,
      description: "Notes en accès public",
      icon: <UserCheck className="h-5 w-5" />,
      color: "bg-violet-500",
    },
    {
      title: "Favoris",
      value: favoriteNotes,
      description: "Notes marquées en favoris",
      icon: <Star className="h-5 w-5" />,
      color: "bg-amber-500",
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="p-4">Chargement...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Administration</h1>

        {/* Statistiques */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Tableau de bord</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((card, index) => (
              <AdminStatsCard
                key={card.title}
                title={card.title}
                value={card.value}
                description={card.description}
                icon={card.icon}
                color={card.color}
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* Graphique des activités récentes */}
        <section className="mb-8">
          <Card className="overflow-hidden border-t-4 border-t-primary shadow-md">
            <CardContent className="pt-6">
              <AdminActivityChart activities={recentActivities} categories={categories} />
            </CardContent>
          </Card>
        </section>

        {/* Navigation vers les sections d'administration */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Gestion des utilisateurs
              </CardTitle>
              <CardDescription>
                Gérer les comptes utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#697386] mb-4">
                Créer, modifier ou supprimer des comptes utilisateurs.
              </p>
              <Button asChild>
                <Link href="/admin/users">Gérer les utilisateurs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" /> Gestion des groupes
              </CardTitle>
              <CardDescription>
                Gérer les groupes d'utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#697386] mb-4">
                Créer des groupes et attribuer des droits d'accès aux membres.
              </p>
              <Button asChild>
                <Link href="/admin/groups">Gérer les groupes</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
