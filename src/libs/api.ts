//src/libs/api.ts
import prisma from "@/libs/prismadb";
import { toast } from "sonner";

// API Notes avec Prisma + MongoDB
export const notesApi = {
  // Obtenir toutes les notes d’un utilisateur ou les publiques
  getAllNotes: async (userId: string | null = null) => {
    try {
      const notes = await prisma.note.findMany({
        where: userId
          ? {
              OR: [
                { userId }, // notes de l'utilisateur
                { isPublic: true } // à activer si tu veux aussi les notes publiques
              ],
            }
          : {},
        include: {
          user: true,
          category: true, // 🔧 RECONNU maintenant que Prisma a été généré
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return notes;
    } catch (error) {
      console.error("Erreur lors du chargement des notes", error);
      toast.error("Erreur lors du chargement des notes");
      return [];
    }
  },

  // Obtenir une note par ID
  getNoteById: async (id: string) => {
    try {
      const note = await prisma.note.findUnique({
        where: { id },
        include: {
          user: true,
          category: true,
        },
      });
      return note;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la note ${id}`, error);
      toast.error("Erreur lors du chargement de la note");
      return null;
    }
  },

  // Créer une note
  createNote: async ({
    title,
    content,
    userId,
    categoryId,
  }: {
    title: string;
    content: string;
    userId: string;
    categoryId?: string | null;
  }) => {
    try {
      const newNote = await prisma.note.create({
        data: {
          title,
          content,
          userId,
          categoryId: categoryId ?? null,
        },
      });
      toast.success("Note créée avec succès");
      return newNote;
    } catch (error) {
      console.error("Erreur lors de la création de la note", error);
      toast.error("Erreur lors de la création de la note");
      throw error;
    }
  },

  // Mettre à jour une note
  updateNote: async (
    id: string,
    updates: { title?: string; content?: string; categoryId?: string | null }
  ) => {
    try {
      const updatedNote = await prisma.note.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });
      toast.success("Note mise à jour avec succès");
      return updatedNote;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la note ${id}`, error);
      toast.error("Erreur lors de la mise à jour de la note");
      throw error;
    }
  },

  // Supprimer une note
 deleteNote: async (id: string) => {
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Échec de la suppression de la note");
      }

      toast.success("Note supprimée avec succès");
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la note ${id}`, error);
      toast.error("Erreur lors de la suppression de la note");
      return false;
    }
  },
}
// API Categories avec Prisma + MongoDB
    export const categoriesApi = {
  // Obtenir toutes les catégories d’un utilisateur
  getAllCategories: async (userId: string) => {
    try {
      const categories = await prisma.category.findMany({
        where: { userId },
        orderBy: {
          name: "asc",
        },
      });
      return categories;
    } catch (error) {
      console.error("Erreur lors du chargement des catégories", error);
      toast.error("Erreur lors du chargement des catégories");
      return [];
    }
  },
};
