import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

/**
 * GET: Récupérer toutes les notes ou les notes d’un utilisateur spécifique
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const notes = await prisma.note.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: true,
        category: true,
        group: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des notes :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * POST: Créer une nouvelle note
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      content,
      isFavorite,
      isPublic,
      userId,
      categoryId,
      groupId,
    } = body;

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

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la note :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
