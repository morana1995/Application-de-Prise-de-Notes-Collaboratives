import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";


// GET /api/user — Récupération du profil utilisateur OU de tous les utilisateurs si ?all=true
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const getAll = searchParams.get("all") === "true";

    if (getAll) {
      // Facultatif : autoriser seulement les admins à voir tous les utilisateurs
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (currentUser?.role !== "admin") {
        return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
      }

      const users = await prisma.user.findMany({
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

      const formattedUsers = users.map((user) => {
        let imageUrl = user.image;
        if (!imageUrl && user.imageData) {
          const base64 = Buffer.from(user.imageData).toString("base64");
          imageUrl = `data:image/png;base64,${base64}`;
        }
        return { ...user, image: imageUrl };
      });

      return NextResponse.json({ users: formattedUsers }, { status: 200 });
    }

    // Sinon : retourner uniquement l'utilisateur connecté
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

    return NextResponse.json({ user: { ...user, image: imageUrl } }, { status: 200 });

  } catch (error) {
    console.error("[GET_USER_ERROR]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}




// POST /api/user — Création d’un nouvel utilisateur
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "L'utilisateur existe déjà" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("[POST_USER_ERROR]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// PUT /api/user — Mise à jour du profil utilisateur
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, password, image, imageData } = body;

    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (bio) updatedData.bio = bio;

    // Si une image base64 est envoyée, on la stocke dans `imageData`
    if (imageData && typeof imageData === "string") {
      updatedData.imageData = Buffer.from(imageData, "base64");
      updatedData.image = null; // Pour éviter les conflits
    } else if (image && typeof image === "string") {
      updatedData.image = image;
      updatedData.imageData = null;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updatedData,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    // Si imageData est présent, on la reconvertit en base64 pour l'affichage
    let imageUrl = userWithoutPassword.image;
    if (!imageUrl && updatedUser.imageData) {
      const base64 = Buffer.from(updatedUser.imageData).toString("base64");
      imageUrl = `data:image/png;base64,${base64}`;
    }

    return NextResponse.json({ user: { ...userWithoutPassword, image: imageUrl } }, { status: 200 });
  } catch (error) {
    console.error("[PUT_USER_ERROR]", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}


// DELETE /api/user — Suppression du compte utilisateur
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await prisma.user.delete({
      where: { email: session.user.email },
    });

    return NextResponse.json({ message: "Compte supprimé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("[DELETE_USER_ERROR]", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
