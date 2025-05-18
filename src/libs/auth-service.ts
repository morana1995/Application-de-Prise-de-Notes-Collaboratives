// libs/auth-service.ts
import { signIn, signOut } from "next-auth/react";

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  bio?: string | null;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  // Connexion via NextAuth (provider "credentials")
  login: async ({ email, password }: Credentials) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res || !res.ok) {
      throw new Error("Identifiants invalides");
    }

    return res;
  },

  // Inscription via l'API locale
  register: async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Erreur d'inscription");
    }

    return res.json();
  },

  // Déconnexion via NextAuth
  logout: async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  },

  // Récupérer l'utilisateur connecté via l'API GET /api/user
  getCurrentUser: async (): Promise<AuthUser | null> => {
  try {
    const res = await fetch("/api/user");

    if (!res.ok) return null;

    const data = await res.json();
    return data.user as AuthUser; // correction ici
  } catch (error) {
    console.error("Erreur lors de getCurrentUser:", error);
    return null;
  }
},

  // Vérifie si l'utilisateur est connecté
  isLoggedIn: async (): Promise<boolean> => {
    const user = await authService.getCurrentUser();
    return !!user;
  },

  // Optionnel (non utilisé pour l'instant)
  verifyToken: (token: string): any | null => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded;
    } catch {
      return null;
    }
  },
};
