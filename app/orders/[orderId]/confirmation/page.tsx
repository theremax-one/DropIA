'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download, Mail, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

interface Sale {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  productName: string;
  invoiceNumber: string;
  createdAt: string;
  status: string;
  invoiceHtml?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  fileUrl?: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sale, setSale] = useState<Sale | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadOrderData();
  }, [user, params.orderId]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos de la venta
      const saleResponse = await fetch(`/api/sales/${params.orderId}`);
      if (!saleResponse.ok) {
        throw new Error('Orden no encontrada');
      }
      const saleData = await saleResponse.json();
      setSale(saleData);

      // Cargar datos del producto
      const productResponse = await fetch(`/api/products/${saleData.productId}`);
      if (productResponse.ok) {
        const productData = await productResponse.json();
        setProduct(productData);
      }
    } catch (error: any) {
      console.error('Error cargando orden:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar la orden',
        variant: 'destructive',
      });
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!product?.fileUrl) {
      toast({
        title: 'Error',
        description: 'Archivo no disponible para descarga',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(product.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${product.name}.${product.fileUrl.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Descarga iniciada',
        description: 'Tu producto se está descargando',
      });
    } catch (error) {
      toast({
        title: 'Error en la descarga',
        description: 'No se pudo descargar el archivo',
        variant: 'destructive',
      });
    }
  };

  const handlePrintInvoice = () => {
    if (sale?.invoiceHtml) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(sale.invoiceHtml);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Cargando confirmación...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Orden no encontrada</h1>
            <Button asChild>
              <Link href="/orders">Volver a mis órdenes</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a mis órdenes
            </Link>
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500 mr-3" />
              <h1 className="text-3xl font-bold text-white">¡Compra Exitosa!</h1>
            </div>
            <p className="text-white/80 text-lg">
              Tu producto ha sido comprado y la factura ha sido enviada a tu correo
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información de la orden */}
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Detalles de la Orden
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/70">Número de Orden:</span>
                <span className="font-semibold">{sale.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Número de Factura:</span>
                <span className="font-semibold">{sale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Fecha de Compra:</span>
                <span className="font-semibold">
                  {new Date(sale.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Estado:</span>
                <Badge variant="default" className="bg-green-600">
                  Completado
                </Badge>
              </div>
              <Separator className="bg-white/20" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-400">${sale.price.toFixed(2)} USD</span>
              </div>
            </CardContent>
          </Card>

          {/* Información del producto */}
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle>Producto Comprado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{sale.productName}</h3>
                {product && (
                  <p className="text-white/70 text-sm">{product.description}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Precio:</span>
                  <span className="font-semibold">${sale.price.toFixed(2)} USD</span>
                </div>
                {product?.categoryId && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Categoría:</span>
                    <span className="font-semibold">{product.categoryId}</span>
                  </div>
                )}
              </div>

              <Separator className="bg-white/20" />

              <div className="space-y-3">
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!product?.fileUrl}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Producto
                </Button>
                
                <Button 
                  onClick={handlePrintInvoice}
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Imprimir Factura
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Factura HTML */}
        {sale.invoiceHtml && (
          <Card className="mt-8 bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Vista Previa de la Factura</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="bg-white rounded-lg p-6 max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: sale.invoiceHtml }}
              />
            </CardContent>
          </Card>
        )}

        {/* Acciones adicionales */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-white/70">
            📧 Se ha enviado una copia de la factura a tu correo electrónico
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/dashboard">Ir al Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/orders">Ver Todas las Órdenes</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}