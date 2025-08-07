'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Product } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

interface ProductRecommendationsProps {
  currentProductId?: string;
}

export function ProductRecommendations({ currentProductId }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations');
      if (response.ok) {
        const products = await response.json();
        // Filtrar el producto actual si está presente
        setRecommendations(
          currentProductId
            ? products.filter((p: Product) => p.id !== currentProductId)
            : products
        );
      }
    } catch (error) {
      console.error('Error al cargar recomendaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recomendados para ti</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.slice(0, 4).map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square">
              <Image
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{product.name}</h3>
              <div className="flex items-center mt-1">
                {product.stats?.averageRating ? (
                  <>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm ml-1">
                      {product.stats.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      ({product.stats.totalReviews})
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Sin reseñas
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-semibold text-primary">
                  {formatCurrency(product.price)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  Ver más
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}