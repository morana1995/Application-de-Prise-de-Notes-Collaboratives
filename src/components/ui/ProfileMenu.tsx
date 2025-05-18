"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useMemo } from "react";

function getInitials(fullName: string | null | undefined): string {
  if (!fullName) return "??";

  const nameParts = fullName.trim().split(" ");

  if (nameParts.length === 1) {
    const firstLetter = nameParts[0][0]?.toUpperCase() || "?";
    const secondLetter = nameParts[0][1]?.toUpperCase() || "S"; // par défaut "S"
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

export default function ProfileMenu({ user }: { user: any }) {
  if (!user) return null;

  const initials = useMemo(() => getInitials(user?.name), [user?.name]);
  const fallbackColor = useMemo(() => getRandomColor(), []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="bg-gray-100">
          {user.image ? (
            <AvatarImage src={user.image} alt="avatar" />
          ) : (
            <AvatarFallback className={`${fallbackColor} text-black font-bold`}>
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2">
        <DropdownMenuItem className="cursor-pointer hover:border-gray-800">
          <Link href="/profile" className="flex items-center w-full">
            <User className="w-4 h-4 mr-2" />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="cursor-pointer  hover:border-gray-800 text-rose-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
