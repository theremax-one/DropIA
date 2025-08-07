'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

interface AddToCartProps {
  product: Product;
}

export function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const addToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      // Mostrar mensaje de éxito
      alert('Producto agregado al carrito');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Error al agregar al carrito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-sm font-medium">
          Cantidad:
        </label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20"
        />
      </div>
      
      <Button
        onClick={addToCart}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {loading ? 'Agregando...' : 'Agregar al Carrito'}
      </Button>
    </div>
  );
}