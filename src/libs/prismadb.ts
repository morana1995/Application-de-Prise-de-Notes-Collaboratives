import { PrismaClient } from "@prisma/client";

declare global {

  var prisma: PrismaClient | undefined;
}

// Utilise l'instance globale si elle existe (dev mode), sinon en crée une nouvelle
const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  // En mode développement, conserve l'instance dans la variable globale pour éviter les multiples connexions
  globalThis.prisma = prisma;
}

export default prisma;
