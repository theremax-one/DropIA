import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withAuth } from '@/lib/api-middlewares';

export async function GET(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      // Obtener todos los accesos del usuario
      const snapshot = await db.collection('user_accesses')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      // Obtener los productos asociados
      const accesses = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const access = {
            id: doc.id,
            ...doc.data()
          };

          const productDoc = await db.collection('products')
            .doc(access.productId)
            .get();

          return {
            ...access,
            product: {
              id: productDoc.id,
              ...productDoc.data()
            }
          };
        })
      );

      return NextResponse.json(accesses);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}