//src/app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';

// GET: /api/notes?userId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }

  try {
    const notes = await prisma.note.findMany({
      where: { userId: String(userId) },
      include: {
        category: true,
        group: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// POST: /api/notes
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, categoryId, isPublic, userEmail } = body;

    if (!title || !content || !userEmail) {
      return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        isPublic,
        categoryId,
        userId: user.id,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT: /api/notes/[id]
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const body = await req.json();
    const { title, content, categoryId, isPublic } = body;

    if (!id || !title || !content || !categoryId) {
      return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        categoryId,
        isPublic,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Erreur serveur lors de la mise à jour' }, { status: 500 });
  }
}

// DELETE: /api/notes/[id]
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID manquant' }, { status: 400 });
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Note supprimée avec succès' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Erreur serveur lors de la suppression' }, { status: 500 });
  }
}
