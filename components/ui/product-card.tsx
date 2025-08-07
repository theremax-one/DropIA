'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Download, Star, Eye, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onDownload?: () => void;
}

export function ProductCard({ product, onDownload }: ProductCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleDownload = async () => {
    if (!user) {
      toast({
        title: 'Debes iniciar sesión',
        description: 'Necesitas estar autenticado para descargar productos.',
        variant: 'destructive',
      });
      return;
    }

    if (product.stock <= 0) {
      toast({
        title: 'Sin stock',
        description: 'Este producto no está disponible actualmente.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsDownloading(true);
      
      const response = await fetch(`/api/products/${product.id}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la descarga');
      }

      // Simular descarga del archivo
      if (data.downloadUrl) {
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = product.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: 'Descarga exitosa',
        description: 'El producto se ha descargado correctamente.',
      });

      onDownload?.();
    } catch (error: any) {
      toast({
        title: 'Error en la descarga',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewDetails = () => {
    router.push(`/products/${product.id}`);
  };

  const images = product.images ? JSON.parse(product.images) : [];
  const mainImage = images[0] || '/placeholder.jpg';

  return (
    <Card className="overflow-hidden bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] group">
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badge de categoría */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-purple-600 text-white">
            {product.category?.name || 'Sin categoría'}
          </Badge>
        </div>

        {/* Badge de stock */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant={product.stock > 0 ? "default" : "destructive"}
            className="text-xs"
          >
            {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
          </Badge>
        </div>

        {/* Overlay para sin stock */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Título y descripción */}
        <div>
          <h3 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Precio y rating */}
        <div className="flex items-center justify-between">
          <span className="text-purple-400 font-bold text-lg">
            {formatCurrency(product.price)}
          </span>
          <div className="flex items-center text-sm text-gray-400">
            <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
            <span>4.5</span>
          </div>
        </div>

        {/* Vendedor */}
        {product.seller && (
          <div className="text-xs text-gray-400">
            Por: <span className="text-purple-300">{product.seller.name}</span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={handleDownload}
            disabled={isDownloading || product.stock <= 0}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Descargando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {product.stock > 0 ? 'Descargar' : 'Sin stock'}
              </>
            )}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleViewDetails}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
} 