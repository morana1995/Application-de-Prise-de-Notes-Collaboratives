import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

// GET /api/notes?userId=xxx
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "userId manquant" }, { status: 400 });
  }

  try {
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Erreur récupération notes :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/notes
export async function POST(req: NextRequest) {
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

    if (!title || !content || !userId) {
      return NextResponse.json(
        { message: "Champs requis manquants" },
        { status: 400 }
      );
    }

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
