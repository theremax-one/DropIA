'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Review, ProductStats } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Star, ThumbsUp, MessageSquare, Clock, Plus, Minus } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  stats: ProductStats;
  canReview: boolean;
}

export function ProductReviews({ productId, reviews, stats, canReview }: ProductReviewsProps) {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    usageTime: 'less_than_month' as const,
    pros: [''],
    cons: [''],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pros: formData.pros.filter(Boolean),
          cons: formData.cons.filter(Boolean),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setShowReviewForm(false);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      await fetch(`/api/products/${productId}/reviews/${reviewId}/like`, {
        method: 'POST',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addField = (field: 'pros' | 'cons') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeField = (field: 'pros' | 'cons', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateField = (field: 'pros' | 'cons', index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              {stats.averageRating.toFixed(1)}
              <span className="text-lg text-muted-foreground ml-2">
                de 5
              </span>
            </h2>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`h-5 w-5 ${
                    rating <= stats.averageRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                ({stats.totalReviews} reseñas)
              </span>
            </div>
          </div>
          {canReview && (
            <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
              <DialogTrigger asChild>
                <Button>Escribir reseña</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Escribir reseña</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Calificación</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, rating }))
                          }
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              rating <= formData.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título</label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Resume tu experiencia"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comentario</label>
                    <Textarea
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Comparte los detalles de tu experiencia..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Tiempo de uso
                    </label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={formData.usageTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          usageTime: e.target.value as any,
                        }))
                      }
                      required
                    >
                      <option value="less_than_month">Menos de 1 mes</option>
                      <option value="one_to_three_months">1-3 meses</option>
                      <option value="more_than_three_months">Más de 3 meses</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pros</label>
                    {formData.pros.map((pro, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={pro}
                          onChange={(e) =>
                            updateField('pros', index, e.target.value)
                          }
                          placeholder="Añade un punto positivo"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeField('pros', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addField('pros')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir pro
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contras</label>
                    {formData.cons.map((con, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={con}
                          onChange={(e) =>
                            updateField('cons', index, e.target.value)
                          }
                          placeholder="Añade un punto negativo"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeField('cons', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addField('cons')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir contra
                    </Button>
                  </div>

                  <Button type="submit" className="w-full">
                    Publicar reseña
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-5 gap-4">
          {Object.entries(stats.ratingCounts)
            .reverse()
            .map(([rating, count]) => {
              const percentage =
                (count / stats.totalReviews) * 100 || 0;
              return (
                <div
                  key={rating}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="w-3">{rating}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
        </div>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-4 w-4 ${
                          rating <= review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {review.verifiedPurchase && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Compra verificada
                    </span>
                  )}
                </div>
                <h3 className="font-semibold mt-2">{review.title}</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(review.createdAt), "d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </div>
            </div>

            <p className="mt-2 text-sm">{review.comment}</p>

            {(review.pros?.length > 0 || review.cons?.length > 0) && (
              <div className="mt-4 space-y-2">
                {review.pros?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Lo bueno:</span>
                    <ul className="mt-1 space-y-1">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <Plus className="h-3 w-3 text-green-500 mr-2" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.cons?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Lo malo:</span>
                    <ul className="mt-1 space-y-1">
                      {review.cons.map((con, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <Minus className="h-3 w-3 text-red-500 mr-2" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => handleLike(review.id)}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {review.likes}
              </Button>
              {review.usageTime && (
                <span className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {review.usageTime === 'less_than_month'
                    ? 'Menos de 1 mes de uso'
                    : review.usageTime === 'one_to_three_months'
                    ? '1-3 meses de uso'
                    : 'Más de 3 meses de uso'}
                </span>
              )}
            </div>

            {review.userResponse && (
              <div className="mt-4 pl-4 border-l-2">
                <div className="text-sm">
                  <span className="font-medium">Respuesta del vendedor</span>
                  <p className="mt-1">{review.userResponse.comment}</p>
                  <span className="text-muted-foreground text-xs">
                    {format(
                      new Date(review.userResponse.createdAt),
                      "d 'de' MMMM 'de' yyyy",
                      { locale: es }
                    )}
                  </span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}