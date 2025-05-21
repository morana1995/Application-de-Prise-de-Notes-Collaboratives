"use client";

import React from "react";
import Sidebar from "./Sidebar";
import SearchBar from "../ui/SearchBar";
import ProfileMenu from "../ui/ProfileMenu";
import { Bell, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F2F2F2]">
        <Loader className="animate-spin w-8 h-8 text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F2F2F2]">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <Bell size={20} />
              </Button>
              <Separator orientation="vertical" className="h-8 bg-gray-300" />
              <ProfileMenu />
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
