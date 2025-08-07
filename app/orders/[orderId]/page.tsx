'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/use-orders';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/components/ui/order-status';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderPage({ params }: OrderPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getOrder, cancelOrder } = useOrders();
  const router = useRouter();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderData = await getOrder(params.orderId);
        if (!orderData) {
          throw new Error('Orden no encontrada');
        }
        setOrder(orderData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params.orderId, getOrder]);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="h-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-10">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'No se pudo cargar la orden'}
          </p>
          <Button onClick={() => router.push('/orders')}>
            Volver a mis órdenes
          </Button>
        </Card>
      </div>
    );
  }

  const handleCancel = async () => {
    await cancelOrder(order.id);
    router.push('/orders');
  };

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Orden #{order.id}</h1>
          <OrderStatus status={order.status} />
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Información general</h2>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de orden</span>
                <span>{format(new Date(order.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última actualización</span>
                <span>{format(new Date(order.updatedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado</span>
                <OrderStatus status={order.status} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold mb-4">Dirección de envío</h2>
            <p className="text-sm">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold mb-4">Productos</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => router.push('/orders')}
            >
              Volver a mis órdenes
            </Button>
            {order.status === 'pending' && (
              <Button
                variant="destructive"
                onClick={handleCancel}
              >
                Cancelar orden
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}