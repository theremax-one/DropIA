import { db } from '@/lib/firebase/admin';
import {
  Product,
  UserInterest,
  ProductRelation,
  ProductRecommendation,
} from '@/types';

export class RecommendationService {
  private static instance: RecommendationService;
  private batchSize = 100;

  private constructor() {}

  static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  async updateUserInterests(userId: string, categoryId: string, action: 'view' | 'purchase' | 'review'): Promise<void> {
    const interestRef = db.collection('user_interests')
      .where('userId', '==', userId)
      .where('categoryId', '==', categoryId)
      .limit(1);

    const snapshot = await interestRef.get();
    const batch = db.batch();

    if (snapshot.empty) {
      const newInterestRef = db.collection('user_interests').doc();
      batch.set(newInterestRef, {
        userId,
        categoryId,
        interactionCount: 1,
        lastInteraction: new Date(),
        averageTimeSpent: 0,
        purchaseCount: action === 'purchase' ? 1 : 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      const doc = snapshot.docs[0];
      const data = doc.data() as UserInterest;
      
      batch.update(doc.ref, {
        interactionCount: data.interactionCount + 1,
        lastInteraction: new Date(),
        purchaseCount: action === 'purchase' ? data.purchaseCount + 1 : data.purchaseCount,
        updatedAt: new Date(),
      });
    }

    await batch.commit();
  }

  async updateProductRelations(productId: string, relatedProductId: string, type: ProductRelation['type']): Promise<void> {
    const relationRef = db.collection('product_relations')
      .where('productId', '==', productId)
      .where('relatedProductId', '==', relatedProductId)
      .limit(1);

    const snapshot = await relationRef.get();
    const batch = db.batch();

    if (snapshot.empty) {
      const newRelationRef = db.collection('product_relations').doc();
      batch.set(newRelationRef, {
        productId,
        relatedProductId,
        strength: 1,
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      const doc = snapshot.docs[0];
      const data = doc.data() as ProductRelation;
      
      batch.update(doc.ref, {
        strength: data.strength + 1,
        updatedAt: new Date(),
      });
    }

    await batch.commit();
  }

  async generateRecommendations(userId: string): Promise<void> {
    const batch = db.batch();

    // 1. Obtener intereses del usuario
    const interests = await db.collection('user_interests')
      .where('userId', '==', userId)
      .orderBy('interactionCount', 'desc')
      .limit(5)
      .get();

    const categoryIds = interests.docs.map(doc => doc.data().categoryId);

    // 2. Obtener productos en categorías de interés
    const categoryProducts = await Promise.all(
      categoryIds.map(categoryId =>
        db.collection('products')
          .where('categoryId', '==', categoryId)
          .limit(10)
          .get()
      )
    );

    // 3. Obtener compras del usuario
    const purchases = await db.collection('orders')
      .where('userId', '==', userId)
      .where('status', '==', 'completed')
      .get();

    const purchasedProductIds = new Set(
      purchases.docs.flatMap(doc => doc.data().items.map(item => item.productId))
    );

    // 4. Obtener productos relacionados con las compras
    const relatedProducts = await Promise.all(
      Array.from(purchasedProductIds).map(productId =>
        db.collection('product_relations')
          .where('productId', '==', productId)
          .orderBy('strength', 'desc')
          .limit(5)
          .get()
      )
    );

    // 5. Calcular puntuaciones y generar recomendaciones
    const recommendations = new Map<string, { score: number; reason: ProductRecommendation['reason'] }>();

    // Por categorías de interés
    categoryProducts.forEach((snapshot, index) => {
      const interestScore = (5 - index) / 5; // 1.0 to 0.2
      snapshot.docs.forEach(doc => {
        const productId = doc.id;
        if (!purchasedProductIds.has(productId)) {
          const current = recommendations.get(productId) || { score: 0, reason: 'category_interest' };
          recommendations.set(productId, {
            score: current.score + interestScore,
            reason: 'category_interest',
          });
        }
      });
    });

    // Por productos relacionados
    relatedProducts.forEach(snapshot => {
      snapshot.docs.forEach(doc => {
        const data = doc.data() as ProductRelation;
        const productId = data.relatedProductId;
        if (!purchasedProductIds.has(productId)) {
          const current = recommendations.get(productId) || { score: 0, reason: data.type === 'complementary' ? 'complementary' : 'similar_purchases' };
          recommendations.set(productId, {
            score: current.score + (data.strength / 10),
            reason: data.type === 'complementary' ? 'complementary' : 'similar_purchases',
          });
        }
      });
    });

    // 6. Guardar recomendaciones
    // Primero eliminar recomendaciones anteriores
    const oldRecs = await db.collection('product_recommendations')
      .where('userId', '==', userId)
      .get();

    oldRecs.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Crear nuevas recomendaciones
    Array.from(recommendations.entries())
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(0, 20)
      .forEach(([productId, { score, reason }]) => {
        const recRef = db.collection('product_recommendations').doc();
        batch.set(recRef, {
          userId,
          productId,
          score,
          reason,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

    await batch.commit();
  }

  async getRecommendations(userId: string, limit: number = 10): Promise<Product[]> {
    // Obtener recomendaciones
    const recsSnapshot = await db.collection('product_recommendations')
      .where('userId', '==', userId)
      .orderBy('score', 'desc')
      .limit(limit)
      .get();

    if (recsSnapshot.empty) {
      // Si no hay recomendaciones, devolver productos mejor valorados
      const productsSnapshot = await db.collection('product_stats')
        .orderBy('averageRating', 'desc')
        .limit(limit)
        .get();

      const productIds = productsSnapshot.docs.map(doc => doc.data().productId);
      const products = await Promise.all(
        productIds.map(id =>
          db.collection('products').doc(id).get()
        )
      );

      return products
        .filter(doc => doc.exists)
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
    }

    // Obtener productos recomendados
    const productIds = recsSnapshot.docs.map(doc => doc.data().productId);
    const products = await Promise.all(
      productIds.map(id =>
        db.collection('products').doc(id).get()
      )
    );

    return products
      .filter(doc => doc.exists)
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
  }
}