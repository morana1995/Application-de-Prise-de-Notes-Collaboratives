import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Création note, body reçu:", body);

    const {
      title,
      content,
      isFavorite,
      isPublic,
      userId,
      categoryId,
      groupId,
    } = body;

    // TEST RAPIDE : Remplace userId par un ID valide de ta base pour tester
    const fixedUserId = "682a0575b0d1a11a472eeba0"; // <-- Remplace ici

    if (!title || !content) {
      return NextResponse.json({ message: "Titre et contenu obligatoires" }, { status: 400 });
    }

    if (!userId && !fixedUserId) {
      return NextResponse.json({ message: "userId manquant" }, { status: 400 });
    }

    const data: any = {
      title,
      content,
      isFavorite: isFavorite ?? false,
      isPublic: isPublic ?? false,
      userId: userId || fixedUserId,
    };

    if (categoryId && typeof categoryId === "string" && categoryId.trim() !== "") {
      data.categoryId = categoryId;
    }

    if (groupId && typeof groupId === "string" && groupId.trim() !== "") {
      data.groupId = groupId;
    }

    const newNote = await prisma.note.create({
      data,
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error: any) {
    console.error("Erreur lors de la création de la note :", error);
    return NextResponse.json(
      { message: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
