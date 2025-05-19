import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ✅ Met ici ton vrai userId
  const userId = "682a0575b0d1a11a472eeba0"

  // 🔁 Supprimer les anciennes données
  await prisma.category.deleteMany()
  await prisma.group.deleteMany()

  // ✅ Catégories à insérer
  const categories = ["Personnel", "Travail", "Idées", "À Faire"]
  for (const name of categories) {
    await prisma.category.create({
      data: {
        name,
        userId
      }
    })
  }

  // ✅ Groupes à insérer
  const groups = ["Groupe 1", "Projet X"]
  for (const name of groups) {
    await prisma.group.create({
      data: {
        name,
        ownerId: userId
      }
    })
  }

  console.log("📦 Données de base insérées avec succès avec le bon userId !")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
