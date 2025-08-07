import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withRole } from '@/lib/api-middlewares';

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const doc = await db.collection('categories').doc(params.categoryId).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    const category = {
      id: doc.id,
      ...doc.data()
    };

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  return withRole(request, ['admin'], async () => {
    try {
      const data = await request.json();
      const { name, description, slug, imageUrl } = data;

      const docRef = db.collection('categories').doc(params.categoryId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return NextResponse.json(
          { error: 'Categoría no encontrada' },
          { status: 404 }
        );
      }

      await docRef.update({
        name,
        description,
        slug,
        imageUrl,
        updatedAt: new Date(),
      });

      const updatedDoc = await docRef.get();
      const category = {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };

      return NextResponse.json(category);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  return withRole(request, ['admin'], async () => {
    try {
      const docRef = db.collection('categories').doc(params.categoryId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return NextResponse.json(
          { error: 'Categoría no encontrada' },
          { status: 404 }
        );
      }

      // Verificar si hay productos usando esta categoría
      const productsSnapshot = await db.collection('products')
        .where('categoryId', '==', params.categoryId)
        .limit(1)
        .get();

      if (!productsSnapshot.empty) {
        return NextResponse.json(
          { error: 'No se puede eliminar la categoría porque hay productos que la están usando' },
          { status: 400 }
        );
      }

      await docRef.delete();

      return new NextResponse(null, { status: 204 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}