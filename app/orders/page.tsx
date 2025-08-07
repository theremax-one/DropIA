'use client';

import { useOrders } from '@/hooks/use-orders';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/components/ui/order-status';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function OrdersPage() {
  const { orders, loading, cancelOrder } = useOrders();
  const router = useRouter();

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
          <Button onClick={() => router.push('/products')}>
            Ver productos
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Mis órdenes</h1>
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
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    Ver detalles
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      variant="destructive"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Productos</h4>
              <div className="grid gap-2">
                {order.items.map((item) => (
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