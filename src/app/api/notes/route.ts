// pages/api/notes.ts
import { NextApiRequest, NextApiResponse } from "next";
import  prisma  from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      title,
      content,
      isFavorite,
      isPublic,
      userId,
      categoryId,
      groupId,
    } = req.body;

    try {
      const newNote = await prisma.note.create({
        data: {
          title,
          content,
          isFavorite: isFavorite ?? false,
          isPublic: isPublic ?? false,
          userId,
          categoryId: categoryId || undefined,
          groupId: groupId || undefined,
        },
      });

      res.status(201).json(newNote);
    } catch (error) {
      console.error("Erreur lors de la création de la note :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
