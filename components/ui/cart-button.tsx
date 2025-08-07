'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function CartButton() {
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItemCount(0);
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setItemCount(data.items?.length || 0);
      } else if (response.status === 401) {
        // Usuario no autenticado, no mostrar error
        setItemCount(0);
      } else {
        console.error('Error al cargar el carrito:', response.status);
        setItemCount(0);
      }
    } catch (error) {
      // Solo mostrar error si no es un error de red
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Error de red al cargar el carrito:', error);
      }
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCartClick = () => {
    if (!user) {
      // Si no hay usuario, redirigir al login
      router.push('/login');
      return;
    }
    router.push('/cart');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-white hover:bg-white/10"
      onClick={handleCartClick}
      disabled={loading}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white font-medium">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
}