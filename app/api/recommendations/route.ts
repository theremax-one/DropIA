import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-middlewares';
import { RecommendationService } from '@/lib/services/recommendations';

export async function GET(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const recommendationService = RecommendationService.getInstance();
      const products = await recommendationService.getRecommendations(userId);

      return NextResponse.json(products);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

// Endpoint para registrar interacciones
export async function POST(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const { categoryId, action } = await request.json();

      if (!categoryId || !action) {
        return NextResponse.json(
          { error: 'Faltan datos requeridos' },
          { status: 400 }
        );
      }

      const recommendationService = RecommendationService.getInstance();
      await recommendationService.updateUserInterests(userId, categoryId, action);
      await recommendationService.generateRecommendations(userId);

      return new NextResponse(null, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}