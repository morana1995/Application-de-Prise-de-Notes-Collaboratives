import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import prisma from "@/libs/prismadb";

// GET /api/groups
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const ownedGroups = await prisma.group.findMany({
      where: { ownerId: user.id },
      include: { groupMembers: { include: { user: true } } },
    });

    const memberGroups = await prisma.group.findMany({
      where: {
        groupMembers: { some: { userId: user.id } },
        NOT: { ownerId: user.id },
      },
      include: { groupMembers: { include: { user: true } } },
    });

    const groups = [...ownedGroups, ...memberGroups];

    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.error("[GET_GROUPS_ERROR]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/groups
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, description = "", memberIds = [] } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const group = await prisma.group.findUnique({
      where: { id },
    });

    if (!group || group.ownerId !== user?.id) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    // Mise à jour du groupe
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        name,
       
        groupMembers: {
          deleteMany: {}, // Supprime tous les anciens membres
          create: memberIds.map((userId: string) => ({
            user: { connect: { id: userId } },
          })),
        },
      },
      include: {
        groupMembers: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    console.error("[PUT_GROUP_ERROR]", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}


// POST /api/groups
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { name, memberIds = [] } = body;

    if (!name) {
      return NextResponse.json({ error: "Nom du groupe requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const group = await prisma.group.create({
      data: {
        name,
        ownerId: user.id,
        groupMembers: {
          create: memberIds.map((id: string) => ({
            user: { connect: { id } },
          })),
        },
      },
      include: {
        groupMembers: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error("[POST_GROUP_ERROR]", error);
    return NextResponse.json({ error: "Erreur lors de la création du groupe" }, { status: 500 });
  }
}

// DELETE /api/groups?id=GROUP_ID
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("id");

    if (!groupId) {
      return NextResponse.json({ error: "ID du groupe manquant" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const group = await prisma.group.findUnique({ where: { id: groupId } });

    if (!group || group.ownerId !== user.id) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    await prisma.group.delete({ where: { id: groupId } });

    return NextResponse.json({ message: "Groupe supprimé" }, { status: 200 });
  } catch (error) {
    console.error("[DELETE_GROUP_ERROR]", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
