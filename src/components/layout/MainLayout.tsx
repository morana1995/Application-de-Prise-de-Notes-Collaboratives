"use client";
import React from "react";
import Sidebar from "./Sidebar";
import SearchBar from "../ui/SearchBar";
import ProfileMenu from "../ui/ProfileMenu";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    // Optionnel : afficher un loader ou rien tant que la session charge
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <ProfileMenu user={session?.user ?? null} />
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
