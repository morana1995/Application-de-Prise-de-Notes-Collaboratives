import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // Trouver l'utilisateur pour récupérer son id
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Erreur récupération notes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
