import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withAuth } from '@/lib/api-middlewares';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Obtener reseñas
    const snapshot = await db.collection('reviews')
      .where('productId', '==', params.productId)
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Obtener estadísticas
    const statsDoc = await db.collection('product_stats')
      .doc(params.productId)
      .get();

    const stats = statsDoc.exists ? statsDoc.data() : {
      averageRating: 0,
      totalReviews: 0,
      ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };

    return NextResponse.json({ reviews, stats });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  return withAuth(request, async (userId) => {
    try {
      // Verificar que el usuario ha comprado el producto
      const accessSnapshot = await db.collection('user_accesses')
        .where('userId', '==', userId)
        .where('productId', '==', params.productId)
        .limit(1)
        .get();

      if (accessSnapshot.empty) {
        return NextResponse.json(
          { error: 'Debes comprar el producto para poder reseñarlo' },
          { status: 403 }
        );
      }

      // Verificar que no haya reseñado antes
      const existingReviewSnapshot = await db.collection('reviews')
        .where('userId', '==', userId)
        .where('productId', '==', params.productId)
        .limit(1)
        .get();

      if (!existingReviewSnapshot.empty) {
        return NextResponse.json(
          { error: 'Ya has reseñado este producto' },
          { status: 400 }
        );
      }

      const data = await request.json();
      const reviewData = {
        productId: params.productId,
        userId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        usageTime: data.usageTime,
        pros: data.pros || [],
        cons: data.cons || [],
        verifiedPurchase: true,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Crear reseña
      const batch = db.batch();
      const reviewRef = db.collection('reviews').doc();
      batch.set(reviewRef, reviewData);

      // Actualizar estadísticas
      const statsRef = db.collection('product_stats').doc(params.productId);
      const statsDoc = await statsRef.get();

      if (statsDoc.exists) {
        const stats = statsDoc.data()!;
        const newTotal = stats.totalReviews + 1;
        const newAverage = (
          (stats.averageRating * stats.totalReviews + data.rating) /
          newTotal
        );
        
        batch.update(statsRef, {
          totalReviews: newTotal,
          averageRating: newAverage,
          [`ratingCounts.${data.rating}`]: stats.ratingCounts[data.rating] + 1,
          updatedAt: new Date(),
        });
      } else {
        batch.set(statsRef, {
          productId: params.productId,
          totalReviews: 1,
          averageRating: data.rating,
          ratingCounts: {
            1: data.rating === 1 ? 1 : 0,
            2: data.rating === 2 ? 1 : 0,
            3: data.rating === 3 ? 1 : 0,
            4: data.rating === 4 ? 1 : 0,
            5: data.rating === 5 ? 1 : 0,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await batch.commit();

      return NextResponse.json({
        id: reviewRef.id,
        ...reviewData,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}