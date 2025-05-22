import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

/**
 * GET: Récupérer une note par ID
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        category: true,
        group: true,
        collaborators: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json({ message: "Note non trouvée" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Erreur lors de la récupération de la note :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * PUT: Mettre à jour une note par ID
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      title,
      content,
      isFavorite,
      isPublic,
      categoryId,
      groupId,
    } = body;

    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: {
        title,
        content,
        isFavorite,
        isPublic,
        categoryId: categoryId || undefined,
        groupId: groupId || undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la note :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * DELETE: Supprimer une note par ID
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.note.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Note supprimée" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la note :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
