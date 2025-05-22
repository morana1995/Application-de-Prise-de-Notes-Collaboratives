import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import prisma from "@/libs/prismadb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        imageData: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    let imageUrl = user.image;
    if (!imageUrl && user.imageData) {
      const base64 = Buffer.from(user.imageData).toString("base64");
      imageUrl = `data:image/png;base64,${base64}`;
    }

    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      include: {
        user: true,
        category: true,
        group: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ user: { ...user, image: imageUrl }, notes }, { status: 200 });
  } catch (error) {
    console.error("[GET_DASHBOARD_ERROR]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
