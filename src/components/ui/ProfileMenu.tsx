"use client";
import MainLayout from "@/components/Layout/MainLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";



type UserProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

function getInitials(fullName: string | null | undefined): string {
  if (!fullName) return "??";

  const nameParts = fullName.trim().split(" ");

  if (nameParts.length === 1) {
    const firstLetter = nameParts[0][0]?.toUpperCase() || "?";
    const secondLetter = nameParts[0][1]?.toUpperCase() || "S";
    return firstLetter + secondLetter;
  }

  return (
    (nameParts[0][0]?.toUpperCase() || "?") +
    (nameParts[1][0]?.toUpperCase() || "?")
  );
}

const fallbackColors = [
  "bg-red-200",
  "bg-orange-200",
  "bg-amber-200",
  "bg-yellow-200",
  "bg-lime-200",
  "bg-green-200",
  "bg-emerald-200",
  "bg-cyan-200",
  "bg-sky-200",
  "bg-blue-200",
  "bg-indigo-200",
  "bg-violet-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-rose-200",
];

function getRandomColor(): string {
  const index = Math.floor(Math.random() * fallbackColors.length);
  return fallbackColors[index];
}

export default function ProfileMenu() {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

 const fetchUser = async () => {
    try {
      const res = await fetch("/api/user?" + new Date().getTime()); // éviter cache navigateur
      if (!res.ok) throw new Error("Échec de récupération de l'utilisateur");
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Erreur de chargement du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // Optionnel : écouter l’événement personnalisé si déclenché depuis la page /profile
    const handleProfileUpdated = () => {
      setRefreshKey((prev) => prev + 1); // déclenche une relecture via useEffect
      fetchUser(); // recharge les données
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, []);

 const initials = useMemo(() => getInitials(user?.name), [user?.name]);  
 const fallbackColor = useMemo(() => getRandomColor(), []);

 const hasImage =user?.image?.startsWith("http") || user?.image?.startsWith("data:image");

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
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="bg-gray-100">
           {hasImage ? (
            <AvatarImage src={user.image!} alt="avatar" />
          ) : (
            <AvatarFallback className={`${fallbackColor} text-black font-bold`}>
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="mt-2">
        <DropdownMenuItem className="cursor-pointer transition duration-200 hover:bg-purple-400 hover:text-white rounded-md">
          <Link href="/profile" className="flex items-center w-full">
            <User className="w-4 h-4 mr-2" />
            Profil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="cursor-pointer transition duration-200 hover:bg-purple-400 hover:text-white rounded-md text-rose-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
