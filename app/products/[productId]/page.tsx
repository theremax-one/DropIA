'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency } from '@/lib/utils';
import { 
  Download, 
  Star, 
  User, 
  Calendar, 
  Package, 
  DollarSign,
  ShoppingCart,
  Loader2,
  ArrowLeft,
  File
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  sellerId: string;
  fileUrl: string;
  createdAt: any;
  seller?: {
    displayName: string;
    email: string;
  };
  category?: {
    name: string;
  };
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const { productId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Producto no encontrado');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: 'Debes iniciar sesión',
        description: 'Necesitas estar autenticado para comprar productos.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      setPurchasing(true);

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const sale = await response.json();

      toast({
        title: '¡Compra exitosa!',
        description: `Has comprado "${product.name}" por ${formatCurrency(product.price)}`,
      });

      // Redirigir a la página de confirmación con factura
      router.push(`/orders/${sale.id}/confirmation`);
    } catch (error: any) {
      toast({
        title: 'Error en la compra',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setPurchasing(false);
    }
  };

  const handleDownload = () => {
    if (product?.fileUrl) {
      window.open(product.fileUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Producto no encontrado</h1>
            <Button onClick={() => router.push('/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a productos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.uid === product.sellerId;
  const canPurchase = user && !isOwner && product.stock > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/products')}
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a productos
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image/Preview */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="aspect-square bg-slate-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <File className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300 font-medium">{product.name}</p>
                    <p className="text-slate-400 text-sm">Archivo digital</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">{product.name}</CardTitle>
                <CardDescription className="text-slate-300">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Precio:</span>
                  <span className="text-2xl font-bold text-white">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Stock:</span>
                  <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                    {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Categoría:</span>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {product.category?.name || 'Sin categoría'}
                  </Badge>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">Vendedor:</span>
                    <span className="text-white">{product.seller?.displayName || 'Anónimo'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">Fecha:</span>
                    <span className="text-white">
                      {product.createdAt?.toDate?.()?.toLocaleDateString() || 'Fecha no disponible'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Section */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Comprar Producto</CardTitle>
                <CardDescription className="text-slate-300">
                  Acceso instantáneo al contenido digital
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {formatCurrency(product.price)}
                  </div>
                  <p className="text-slate-400 text-sm">
                    Pago único • Acceso inmediato
                  </p>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Descarga inmediata</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-blue-400" />
                    <span className="text-slate-300">Archivo digital</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                    <span className="text-slate-300">Sin comisiones ocultas</span>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {isOwner ? (
                  <div className="text-center space-y-3">
                    <p className="text-slate-400">Este es tu producto</p>
                    <Button 
                      variant="outline" 
                      onClick={handleDownload}
                      className="w-full border-slate-600 text-slate-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                ) : canPurchase ? (
                  <Button 
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {purchasing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Comprar Ahora
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center space-y-3">
                    {!user ? (
                      <>
                        <p className="text-slate-400">Debes iniciar sesión para comprar</p>
                        <Button 
                          onClick={() => router.push('/login')}
                          className="w-full"
                        >
                          Iniciar Sesión
                        </Button>
                      </>
                    ) : (
                      <p className="text-slate-400">
                        {product.stock > 0 ? 'No puedes comprar tu propio producto' : 'Producto sin stock'}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Detalles del Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-white mb-2">Descripción</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <Separator className="bg-slate-700" />
                  
                  <div>
                    <h4 className="font-medium text-white mb-2">Información del Archivo</h4>
                    <div className="space-y-1 text-sm text-slate-300">
                      <p>• Descarga instantánea después de la compra</p>
                      <p>• Sin límites de descarga</p>
                      <p>• Compatible con todos los dispositivos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}