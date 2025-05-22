'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
}

type AccessRight = 'viewer' | 'editor';

interface GroupMember {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  accessRight: AccessRight;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  collaborativeNotes: string[];
  createdAt: string;
}

export default function AdminGroupsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role?: string } | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewGroupDialogOpen, setIsNewGroupDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    members: [] as GroupMember[],
    collaborativeNotes: [] as string[],
  });

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await fetch('/api/auth/me', { credentials: 'include' });
        if (!resUser.ok) throw new Error('Non autorisé');

        const currentUser = await resUser.json();
        if (!currentUser || currentUser.role !== 'admin') {
          toast.error('Accès non autorisé');
          router.push('/');
          return;
        }
        setUser(currentUser);

        const [usersRes, notesRes, groupsRes] = await Promise.all([
          fetch('/api/user?all=true'),
          fetch('/api/notes'),
          fetch('/api/groups'),
        ]);

        if (!usersRes.ok || !notesRes.ok || !groupsRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const usersData = await usersRes.json();
        const notesData = await notesRes.json();
        const groupsData = await groupsRes.json();

        setUsers(usersData);
        setNotes(notesData);
        setGroups(groupsData);
      } catch (error) {
        console.error(error);
        toast.error('Erreur lors du chargement des données');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const toggleUserSelection = (user: User) => {
    const isSelected = newGroup.members.some((m) => m.userId === user.id);
    if (isSelected) {
      setNewGroup((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.userId !== user.id),
      }));
    } else {
      setNewGroup((prev) => ({
        ...prev,
        members: [
          ...prev.members,
          {
            userId: user.id,
            name: user.name || 'Utilisateur',
            email: user.email,
            avatar: user.image,
            accessRight: 'viewer',
          },
        ],
      }));
    }
  };

  const updateMemberAccessRight = (userId: string, accessRight: AccessRight) => {
    setNewGroup((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.userId === userId ? { ...m, accessRight } : m
      ),
    }));
  };

  const handleGroupAdd = async () => {
    if (!newGroup.name.trim()) {
      toast.error('Veuillez saisir un nom pour le groupe');
      return;
    }

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup),
      });

      if (!res.ok) throw new Error('Erreur lors de l’ajout');

      const createdGroup = await res.json();
      setGroups((prev) => [...prev, createdGroup]);

      setNewGroup({ name: '', description: '', members: [], collaborativeNotes: [] });
      setIsNewGroupDialogOpen(false);
      toast.success('Groupe ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l’ajout du groupe');
    }
  };

  const handleDelete = async (groupId: string) => {
    if (!confirm('Confirmer la suppression du groupe ?')) return;

    try {
      const res = await fetch(`/api/groups/${groupId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');

      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      toast.success('Groupe supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression du groupe');
    }
  };

  const handleEditRedirect = (groupId: string) => {
    router.push(`/admin/groups/edit/${groupId}`);
  };

  const getInitials = (name?: string) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'UN';

  if (loading) return <div className="p-4">Chargement...</div>;

  if (!user)
    return (
      <div className="p-4 text-red-600">
        Utilisateur non trouvé ou accès non autorisé
      </div>
    );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des groupes</h1>
        <Dialog open={isNewGroupDialogOpen} onOpenChange={setIsNewGroupDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Ajouter un groupe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Ajouter un groupe</DialogTitle>
              <DialogDescription>
                Créez un nouveau groupe et assignez des membres.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="group-name">Nom du groupe</Label>
                  <Input
                    id="group-name"
                    value={newGroup.name}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea
                    id="group-description"
                    value={newGroup.description}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Membres</Label>
                  <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                    <div className="space-y-2">
                      {users.map((user) => {
                        const selected = newGroup.members.some(
                          (m) => m.userId === user.id
                        );
                        const currentAccess =
                          newGroup.members.find((m) => m.userId === user.id)
                            ?.accessRight || 'viewer';

                        return (
                          <div
                            key={user.id}
                            className="flex items-center justify-between hover:bg-gray-100 p-2 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selected}
                                onCheckedChange={() => toggleUserSelection(user)}
                              />
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.image} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <span>{user.name || user.email}</span>
                            </div>
                            {selected && (
                              <Select
                                value={currentAccess}
                                onValueChange={(value: AccessRight) =>
                                  updateMemberAccessRight(user.id, value)
                                }
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Accès" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="viewer">Lecteur</SelectItem>
                                  <SelectItem value="editor">Éditeur</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end">
              <Button onClick={handleGroupAdd}>Créer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des groupes */}
      <div className="space-y-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border p-4 rounded-lg shadow-sm flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{group.name}</h2>
              <p className="text-gray-600">{group.description}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleEditRedirect(group.id)} variant="outline">
                Modifier
              </Button>
              <Button onClick={() => handleDelete(group.id)} variant="destructive">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
