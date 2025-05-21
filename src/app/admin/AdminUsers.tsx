"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Avatar, AvatarFallback, AvatarImage,
} from "@/components/ui/avatar";

type UserType = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
};

const AdminUsers: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        toast.error("Erreur de chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getInitials = (name?: string): string =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "UN";

  const handleUserAdd = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error("Échec de l'ajout");

      toast.success("Utilisateur ajouté !");
      setIsNewUserDialogOpen(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      const updated = await res.json();
      setUsers((prev) => [...prev, updated]);
    } catch (error: any) {
      toast.error(error.message || "Erreur");
    }
  };

  const handleUserUpdate = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedUser),
      });

      if (!res.ok) throw new Error("Mise à jour échouée");

      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
      toast.success("Utilisateur mis à jour !");
      setIsUserDialogOpen(false);
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };

  const handleUserDelete = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec suppression");
      toast.success("Utilisateur supprimé");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      toast.error("Erreur suppression");
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un utilisateur</DialogTitle>
              <DialogDescription>Formulaire de création</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Nom"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <Input
                placeholder="Mot de passe"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newUser.role === "admin"}
                  onCheckedChange={(checked) =>
                    setNewUser({ ...newUser, role: checked ? "admin" : "user" })
                  }
                />
                <label>Administrateur</label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUserAdd}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>Liste des utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={
                        user.role === "admin" ? "text-primary font-semibold" : ""
                      }
                    >
                      {user.role === "admin" ? "Admin" : "Utilisateur"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsUserDialogOpen(true);
                      }}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleUserDelete(user.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Nom"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedUser.role === "admin"}
                  onCheckedChange={(checked) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: checked ? "admin" : "user",
                    })
                  }
                />
                <label>Administrateur</label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUserUpdate}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
