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
import { cn } from "@/libs/utils";
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
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div className="flex items-center">
            <Book className="h-6 w-6 text-primary" />
            <span className="ml-2 font-semibold text-lg">NoteNexus</span>
          </div>
        )}
        {isCollapsed && <Book className="h-6 w-6 text-primary mx-auto" />}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full p-1 hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <Separator className="my-2" />
      
      {/* New note button */}
      <div className="px-3 py-2">
        <Button className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2">
          <Plus size={16} />
          {!isCollapsed && <span>Nouvelle note</span>}
        </Button>
      </div>
      
      <Separator className="my-2" />
      
      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-2">
        <Link href="/" className={cn("sidebar-item", pathname === "/" && "active")}>
          <Book size={20} />
          {!isCollapsed && <span>Mes notes</span>}
        </Link>
        <Link href="/favorites" className={cn("sidebar-item", pathname === "/favorites" && "active")}>
          <Star size={20} />
          {!isCollapsed && <span>Favoris</span>}
        </Link>
        <Link href="/groups" className={cn("sidebar-item", pathname === "/groups" && "active")}>
          <Users size={20} />
          {!isCollapsed && <span>Groupes</span>}
        </Link>
        
        {!isCollapsed && (
          <>
            <div className="px-3 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-sidebar-foreground/70">CATÉGORIES</span>
                <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
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
                        <Label htmlFor="name" className="text-right">
                          Nom
                        </Label>
                        <Input id="name" placeholder="Nom de la catégorie" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="color" className="text-right">
                          Couleur
                        </Label>
                        <Input id="color" type="color" defaultValue="#9b87f5" className="col-span-3 h-10" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Créer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-1">
                {mockCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="flex items-center gap-2 px-2 py-1 rounded-md text-sm hover:bg-sidebar-accent"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </nav>
      
      <div className="p-3">
        <Link 
          href="/settings" 
          className={cn("sidebar-item", pathname === "/settings" && "active")}
        >
          <Settings size={20} />
          {!isCollapsed && <span>Paramètres</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
