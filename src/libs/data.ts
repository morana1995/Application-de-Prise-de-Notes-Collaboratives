
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  isFavorite: boolean;
  isPublic: boolean;
  author: User;
  collaborators: User[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
}

export const currentUser: User = {
  id: "user-1",
  name: "Marie Dupont",
  email: "marie.dupont@example.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: "user-2",
    name: "Jean Martin",
    email: "jean.martin@example.com",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "user-3",
    name: "Sophie Bernard",
    email: "sophie.bernard@example.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
];

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Personnel", color: "#9b87f5" },
  { id: "cat-2", name: "Travail", color: "#4ade80" },
  { id: "cat-3", name: "Projets", color: "#f97316" },
  { id: "cat-4", name: "Idées", color: "#0ea5e9" },
  { id: "cat-5", name: "À faire", color: "#f43f5e" },
];

export const mockGroups: Group[] = [
  {
    id: "group-1",
    name: "Équipe Marketing",
    members: [mockUsers[0], mockUsers[1]],
  },
  {
    id: "group-2",
    name: "Projet Web",
    members: [mockUsers[0], mockUsers[2]],
  },
];

export const mockNotes: Note[] = [
  {
    id: "note-1",
    title: "Planification stratégique Q3",
    content: "Objectifs principaux pour le trimestre Q3:\n\n1. Lancer la nouvelle campagne marketing\n2. Finaliser les partenariats stratégiques\n3. Optimiser le tunnel de conversion\n\nDéadline: 15 septembre",
    createdAt: "2023-06-15T09:30:00Z",
    updatedAt: "2023-06-16T14:20:00Z",
    category: "cat-2",
    isFavorite: true,
    isPublic: false,
    author: mockUsers[0],
    collaborators: [mockUsers[1]],
  },
  {
    id: "note-2",
    title: "Idées pour le blog",
    content: "Sujets potentiels pour les prochains articles:\n- Guide complet sur la collaboration d'équipe\n- Les meilleures pratiques de prise de notes\n- Comment organiser efficacement ses projets\n- Outils modernes pour la productivité",
    createdAt: "2023-06-10T15:45:00Z",
    updatedAt: "2023-06-10T15:45:00Z",
    category: "cat-4",
    isFavorite: false,
    isPublic: true,
    author: mockUsers[0],
    collaborators: [],
  },
  {
    id: "note-3",
    title: "Réunion d'équipe - 20/06",
    content: "Points à aborder:\n1. Suivi des projets en cours\n2. Planification des vacances d'été\n3. Budget Q3\n4. Questions diverses",
    createdAt: "2023-06-18T11:20:00Z",
    updatedAt: "2023-06-19T08:15:00Z",
    category: "cat-2",
    isFavorite: true,
    isPublic: false,
    author: mockUsers[0],
    collaborators: [mockUsers[1], mockUsers[2]],
  },
  {
    id: "note-4",
    title: "Recette crêpes",
    content: "Ingrédients:\n- 250g de farine\n- 4 œufs\n- 50cl de lait\n- 1 pincée de sel\n- 50g de beurre fondu\n\nPréparation: mélanger les ingrédients, laisser reposer 1h, cuire à feu moyen.",
    createdAt: "2023-05-28T19:10:00Z",
    updatedAt: "2023-05-28T19:30:00Z",
    category: "cat-1",
    isFavorite: false,
    isPublic: true,
    author: mockUsers[0],
    collaborators: [],
  },
  {
    id: "note-5",
    title: "Achats à faire",
    content: "- Nouveau cahier\n- Stylos\n- Adaptateur USB-C\n- Batterie externe\n- Cadeau anniversaire Thomas",
    createdAt: "2023-06-05T10:00:00Z",
    updatedAt: "2023-06-12T16:40:00Z",
    category: "cat-5",
    isFavorite: false,
    isPublic: false,
    author: mockUsers[0],
    collaborators: [],
  },
  {
    id: "note-6",
    title: "Planification site web",
    content: "Pages à créer:\n- Accueil\n- À propos\n- Services\n- Blog\n- Contact\n\nFonctionnalités importantes:\n- Formulaire de contact\n- Newsletter\n- Témoignages clients\n- Galerie de projets",
    createdAt: "2023-06-20T08:30:00Z",
    updatedAt: "2023-06-20T15:45:00Z",
    category: "cat-3",
    isFavorite: true,
    isPublic: false,
    author: mockUsers[0],
    collaborators: [mockUsers[2]],
  },
];
