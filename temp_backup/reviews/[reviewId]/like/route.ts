import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withAuth } from '@/lib/api-middlewares';

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string; reviewId: string } }
) {
  return withAuth(request, async (userId) => {
    try {
      // Verificar si ya dio like
      const likeDoc = await db.collection('review_likes')
        .where('userId', '==', userId)
        .where('reviewId', '==', params.reviewId)
        .limit(1)
        .get();

      if (!likeDoc.empty) {
        return NextResponse.json(
          { error: 'Ya has dado like a esta reseña' },
          { status: 400 }
        );
      }

      // Registrar el like
      const batch = db.batch();

      // Crear registro de like
      const likeRef = db.collection('review_likes').doc();
      batch.set(likeRef, {
        userId,
        reviewId: params.reviewId,
        createdAt: new Date(),
      });

      // Incrementar contador de likes
      const reviewRef = db.collection('reviews').doc(params.reviewId);
      batch.update(reviewRef, {
        likes: db.FieldValue.increment(1),
        updatedAt: new Date(),
      });

      await batch.commit();

      return new NextResponse(null, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}