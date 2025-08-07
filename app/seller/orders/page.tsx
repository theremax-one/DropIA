'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/components/ui/order-status';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      router.push('/');
      return;
    }

    loadOrders();
  }, [user, router]);

  const loadOrders = async () => {
    try {
      const response = await fetch(`/api/orders?sellerId=${user?.uid}`);
      if (!response.ok) throw new Error('Error al cargar órdenes');
      const data = await response.json();
      setOrders(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast({
        title: 'Éxito',
        description: 'Estado de la orden actualizado',
      });

      loadOrders();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="h-32 bg-muted animate-pulse rounded" />
          <div className="h-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-10">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">No tienes órdenes</h2>
          <p className="text-muted-foreground">
            Aquí aparecerán las órdenes de tus productos
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Órdenes de mis productos</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-semibold">Orden #{order.id}</h3>
                  <OrderStatus status={order.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">
                  Total: {formatCurrency(order.total)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/seller/orders/${order.id}`)}
                  >
                    Ver detalles
                  </Button>
                  {order.status === 'paid' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                    >
                      Marcar como entregada
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Productos</h4>
              <div className="grid gap-2">
                {order.items
                  .filter((item) => item.sellerId === user?.uid)
                  .map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}