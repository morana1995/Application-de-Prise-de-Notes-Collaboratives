"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, ShieldCheck } from "lucide-react";
import { authService } from "@/libs/auth-service";
import { toast } from "sonner";

type UserType = {
  name: string;
  email: string;
  role?: string;
  image?: string;
};

const ProfileMenu = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };
    fetchUser();
  }, []);

  if (!user) return null;

  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ?? "";

  const isAdmin = user.role === "admin";

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Déconnexion réussie");
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none hover:bg-accent/50 rounded-full p-1 transition-colors">
        <Avatar>
          <AvatarImage src={user.image || ""} alt={user.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          {isAdmin && (
            <span className="text-xs text-primary font-medium">
              Administrateur
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
            {isAdmin && (
              <span className="text-xs text-primary font-medium">
                Administrateur
              </span>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        {isAdmin && (
          <Link href="/admin" passHref>
            <DropdownMenuItem asChild>
              <a className="cursor-pointer">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Administration</span>
              </a>
            </DropdownMenuItem>
          </Link>
        )}
        <Link href="/settings" passHref>
          <DropdownMenuItem asChild>
            <a className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </a>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
