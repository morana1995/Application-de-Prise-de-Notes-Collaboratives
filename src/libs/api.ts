
import { Note, Category, User, Group } from "./data";
import { toast } from "sonner";
import { authService } from "./auth-service";

const API_DELAY = 300; // Simulation du délai réseau

// Fonction utilitaire pour simuler des appels API
const simulateApiCall = async <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), API_DELAY);
  });
};

// API pour les notes
export const notesApi = {
  // Récupérer toutes les notes
  getAllNotes: async (): Promise<Note[]> => {
    try {
      const storedNotes = localStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      
      // Si l'utilisateur est connecté, filtrer les notes
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Afficher les notes publiques et les notes de l'utilisateur connecté
        const filteredNotes = mockNotes.filter(note => 
          note.isPublic || note.author.id === currentUser.id
        );
        return simulateApiCall(notes.length > 0 ? notes : filteredNotes);
      }
      
      return simulateApiCall(notes.length > 0 ? notes : mockNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Erreur lors du chargement des notes");
      return mockNotes;
    }
  },

  // Récupérer une note par ID
  getNoteById: async (id: string): Promise<Note | undefined> => {
    try {
      const storedNotes = localStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : mockNotes;
      const note = notes.find((n: Note) => n.id === id);
      return simulateApiCall(note);
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      toast.error("Erreur lors du chargement de la note");
      return undefined;
    }
  },

  // Créer une nouvelle note
  createNote: async (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> => {
    try {
      const storedNotes = localStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : mockNotes;
      
      const newNote: Note = {
        ...note,
        id: `note-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedNotes = [newNote, ...notes];
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      
      toast.success("Note créée avec succès");
      return simulateApiCall(newNote);
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Erreur lors de la création de la note");
      throw error;
    }
  },

  // Mettre à jour une note
  updateNote: async (id: string, updates: Partial<Note>): Promise<Note> => {
    try {
      const storedNotes = localStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : mockNotes;
      
      const updatedNotes = notes.map((note: Note) => {
        if (note.id === id) {
          return {
            ...note,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return note;
      });
      
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      const updatedNote = updatedNotes.find((note: Note) => note.id === id);
      
      toast.success("Note mise à jour avec succès");
      return simulateApiCall(updatedNote);
    } catch (error) {
      console.error(`Error updating note ${id}:`, error);
      toast.error("Erreur lors de la mise à jour de la note");
      throw error;
    }
  },

  // Supprimer une note
  deleteNote: async (id: string): Promise<boolean> => {
    try {
      const storedNotes = localStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : mockNotes;
      
      const updatedNotes = notes.filter((note: Note) => note.id !== id);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      
      toast.success("Note supprimée avec succès");
      return simulateApiCall(true);
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      toast.error("Erreur lors de la suppression de la note");
      return false;
    }
  },

  // Récupérer les notes favorites
  getFavorites: async (): Promise<Note[]> => {
    try {
      const storedNotes = localStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : mockNotes;
      const favorites = notes.filter((note: Note) => note.isFavorite);
      
      return simulateApiCall(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Erreur lors du chargement des favoris");
      return [];
    }
  },

  // Basculer le statut favori d'une note
  toggleFavorite: async (id: string): Promise<Note | undefined> => {
    try {
      const storedNotes = localStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : mockNotes;
      
      const updatedNotes = notes.map((note: Note) => {
        if (note.id === id) {
          return {
            ...note,
            isFavorite: !note.isFavorite,
            updatedAt: new Date().toISOString()
          };
        }
        return note;
      });
      
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      const updatedNote = updatedNotes.find((note: Note) => note.id === id);
      
      return simulateApiCall(updatedNote);
    } catch (error) {
      console.error(`Error toggling favorite for note ${id}:`, error);
      toast.error("Erreur lors de la modification des favoris");
      return undefined;
    }
  }
};

// API pour les catégories
export const categoriesApi = {
  // Récupérer toutes les catégories
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const storedCategories = localStorage.getItem("categories");
      const categories = storedCategories ? JSON.parse(storedCategories) : [];
      return simulateApiCall(categories.length > 0 ? categories : mockCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erreur lors du chargement des catégories");
      return mockCategories;
    }
  },

  // Créer une nouvelle catégorie
  createCategory: async (category: Omit<Category, "id">): Promise<Category> => {
    try {
      const storedCategories = localStorage.getItem("categories");
      const categories = storedCategories ? JSON.parse(storedCategories) : mockCategories;
      
      const newCategory: Category = {
        ...category,
        id: `cat-${Date.now()}`
      };
      
      const updatedCategories = [...categories, newCategory];
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
      
      toast.success("Catégorie créée avec succès");
      return simulateApiCall(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Erreur lors de la création de la catégorie");
      throw error;
    }
  }
};

// API pour les groupes
export const groupsApi = {
  // Récupérer tous les groupes
  getAllGroups: async (): Promise<Group[]> => {
    try {
      const storedGroups = localStorage.getItem("groups");
      const groups = storedGroups ? JSON.parse(storedGroups) : [];
      return simulateApiCall(groups.length > 0 ? groups : mockGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Erreur lors du chargement des groupes");
      return mockGroups;
    }
  }
};

// Importer les données mock pour l'initialisation
import { mockNotes, mockCategories, mockGroups } from "./data";

// Initialiser le stockage local au premier chargement
export const initializeLocalStorage = () => {
  if (!localStorage.getItem("notes")) {
    // Adapter les notes pour utiliser l'utilisateur courant
    const currentUser = authService.getCurrentUser() || window.currentUser;
    const notesWithCurrentUser = mockNotes.map(note => {
      if (note.author.id === "user-1") {
        return {
          ...note,
          author: currentUser
        };
      }
      return note;
    });
    
    localStorage.setItem("notes", JSON.stringify(notesWithCurrentUser));
  }
  
  if (!localStorage.getItem("categories")) {
    localStorage.setItem("categories", JSON.stringify(mockCategories));
  }
  
  if (!localStorage.getItem("groups")) {
    localStorage.setItem("groups", JSON.stringify(mockGroups));
  }
};
