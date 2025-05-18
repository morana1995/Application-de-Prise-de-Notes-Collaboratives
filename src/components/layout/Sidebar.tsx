'use client';
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Book,
  Users,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  Plus
} from "lucide-react";
import { mockCategories } from "@/libs/data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`h-screen flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out bg-purple-50 
        ${isCollapsed ? "w-[60px]" : "w-[240px]"}`}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div className="flex items-center">
            <Book className="h-6 w-6 text-purple-600" />
            <span className="ml-2 font-semibold text-lg text-gray-800">NoteNexus</span>
          </div>
        )}
        {isCollapsed && <Book className="h-6 w-6 text-purple-600 mx-auto" />}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full p-1 text-purple-600 hover:bg-purple-200"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <Separator className="my-2" />

      {/* New note button */}
      <div className="px-3 py-2">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
          <Plus size={16} />
          {!isCollapsed && <span>Nouvelle note</span>}
        </Button>
      </div>

      <Separator className="my-2" />

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-2 px-1">
        <SidebarLink href="/" icon={<Book size={20} />} label="Mes notes" active={pathname === "/"} collapsed={isCollapsed} />
        <SidebarLink href="/favorites" icon={<Star size={20} />} label="Favoris" active={pathname === "/favorites"} collapsed={isCollapsed} />
        <SidebarLink href="/groups" icon={<Users size={20} />} label="Groupes" active={pathname === "/groups"} collapsed={isCollapsed} />

        {!isCollapsed && (
          <div className="px-2 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">CATÉGORIES</span>
              <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-purple-600 hover:bg-purple-100">
                    <FolderPlus size={14} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
                    <DialogDescription>
                      Ajoutez une nouvelle catégorie pour organiser vos notes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Nom</Label>
                      <Input id="name" placeholder="Nom de la catégorie" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="color" className="text-right">Couleur</Label>
                      <Input id="color" type="color" defaultValue="#9b87f5" className="col-span-3 h-10" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Créer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-1">
              {mockCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="flex items-center gap-2 px-2 py-1 rounded-md text-sm hover:bg-purple-100 text-gray-700"
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="p-3">
        <SidebarLink href="/settings" icon={<Settings size={20} />} label="Paramètres" active={pathname === "/settings"} collapsed={isCollapsed} />
      </div>
    </div>
  );
};

const SidebarLink = ({ href, icon, label, active, collapsed }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
        ${active ? "bg-purple-200 text-purple-800 font-semibold" : "text-gray-700 hover:bg-purple-100"}
      `}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

export default Sidebar;
