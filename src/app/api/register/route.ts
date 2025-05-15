import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: email.endsWith("@notenexus.com") ? "admin" : "user",
      },
    });

    // Générer un JWT pour connecter automatiquement l'utilisateur
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "7d" }
    );

    // Envoyer le token dans un cookie
    const response = NextResponse.json(
      {
        message: "Utilisateur créé",
        user: {
          id: newUser.id,
          role: newUser.role,
          email: newUser.email,
          name: newUser.name,
        },
        token,
      },
      { status: 201 }
    );

    response.headers.set(
      "Set-Cookie",
      `next-auth.session-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
    );

    return response;
  } catch (error) {
    console.error("Erreur inscription :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
