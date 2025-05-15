import { User } from "./data";
import { toast } from "sonner";

// Clés de stockage local
const AUTH_USER_KEY = "auth_user";
const USERS_KEY = "users_db";

// Types pour les utilisateurs stockés et les rôles
export type UserRole = "admin" | "user" | "visitor";

interface StoredUser extends User {
  password: string;
  role: UserRole;
}

// Vérifier si un utilisateur est connecté
const isLoggedIn = (): boolean => {
  return localStorage.getItem(AUTH_USER_KEY) !== null;
};

// Récupérer l'utilisateur actuellement connecté
const getCurrentUser = (): (User & { role: UserRole }) | null => {
  const userJson = localStorage.getItem(AUTH_USER_KEY);
  if (!userJson) return null;

  try {
    // Convertir de JSON et supprimer le mot de passe pour la sécurité
    const user = JSON.parse(userJson) as StoredUser;
    const { password, ...secureUser } = user;
    return secureUser as User & { role: UserRole };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};

// Déterminer le rôle en fonction de l'email
const determineRole = (email: string): UserRole => {
  if (email.endsWith("@notenexus.com")) {
    return "admin";
  }
  return "user";
};

// Initialiser la base de données des utilisateurs
const initUserDatabase = (): void => {
  if (!localStorage.getItem(USERS_KEY)) {
    // Convertir l'utilisateur actuel en utilisateur stocké avec mot de passe et rôle
    const adminUser: StoredUser = {
      ...window.currentUser,
      password: "password123", // Mot de passe par défaut pour l'utilisateur admin
      role: "admin",
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
  }
};

// Récupérer tous les utilisateurs (pour l'administration)
const getAllUsers = (): StoredUser[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  if (!usersJson) return [];
  return JSON.parse(usersJson);
};

// Enregistrer un nouvel utilisateur
const register = async (
  name: string,
  email: string,
  password: string
): Promise<User & { role: UserRole }> => {
  // Simuler une latence réseau
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = getAllUsers();

  // Vérifier si l'email existe déjà
  if (users.some((user) => user.email === email)) {
    throw new Error("Cet email est déjà utilisé");
  }

  // Déterminer le rôle en fonction de l'email
  const role = determineRole(email);

  // Créer un nouvel utilisateur
  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    role,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`,
  };

  // Ajouter l'utilisateur à la base de données
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Connecter automatiquement l'utilisateur
  const { password: _, ...secureUser } = newUser;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));

  return secureUser;
};

// Connecter un utilisateur
const login = async (
  email: string,
  password: string
): Promise<User & { role: UserRole }> => {
  // Simuler une latence réseau
  await new Promise((resolve) => setTimeout(resolve, 800));

  const users = getAllUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  // Stocker l'utilisateur connecté
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

  // Retourner l'utilisateur sans son mot de passe
  const { password: _, ...secureUser } = user;
  return secureUser as User & { role: UserRole };
};

// Déconnecter l'utilisateur
const logout = (): void => {
  localStorage.removeItem(AUTH_USER_KEY);
  toast.success("Vous avez été déconnecté");
};

// Vérifier si l'utilisateur est un admin
const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

// Mettre à jour un utilisateur
const updateUser = (userId: string, userData: Partial<StoredUser>): boolean => {
  try {
    const users = getAllUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      return false;
    }

    users[index] = { ...users[index], ...userData };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Si l'utilisateur mis à jour est l'utilisateur courant, mettre à jour la session
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(users[index]));
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return false;
  }
};

// Supprimer un utilisateur
const deleteUser = (userId: string): boolean => {
  try {
    const users = getAllUsers();
    const filteredUsers = users.filter((u) => u.id !== userId);

    if (filteredUsers.length === users.length) {
      return false; // Aucun utilisateur n'a été supprimé
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));

    // Si l'utilisateur supprimé est l'utilisateur courant, le déconnecter
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      logout();
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return false;
  }
};

// Exporter l'objet service
export const authService = {
  isLoggedIn,
  getCurrentUser,
  register,
  login,
  logout,
  initUserDatabase,
  getAllUsers,
  isAdmin,
  updateUser,
  deleteUser,
};

// Initialiser la base de données des utilisateurs
initUserDatabase();

// Exposer l'utilisateur actuel pour le reste de l'application
declare global {
  interface Window {
    currentUser: User & { role?: UserRole };
  }
}

// Si l'utilisateur est connecté, mettre à jour l'utilisateur courant
const loggedInUser = getCurrentUser();
if (loggedInUser) {
  window.currentUser = loggedInUser;
}
