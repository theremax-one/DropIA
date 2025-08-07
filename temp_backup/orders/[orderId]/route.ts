import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withAuth } from '@/lib/api-middlewares';
import type { Order } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  return withAuth(request, async (userId) => {
    try {
      const doc = await db.collection('orders').doc(params.orderId).get();
      
      if (!doc.exists) {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        );
      }

      const order = doc.data() as Order;
      if (order.userId !== userId) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        id: doc.id,
        ...order
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  return withAuth(request, async (userId) => {
    try {
      const doc = await db.collection('orders').doc(params.orderId).get();
      
      if (!doc.exists) {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        );
      }

      const order = doc.data() as Order;
      if (order.userId !== userId) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 403 }
        );
      }

      const data = await request.json();
      const { status } = data;

      // Solo permitir cancelar órdenes pendientes
      if (status === 'cancelled' && order.status !== 'pending') {
        return NextResponse.json(
          { error: 'Solo se pueden cancelar órdenes pendientes' },
          { status: 400 }
        );
      }

      // Si se está cancelando la orden, devolver el stock
      if (status === 'cancelled') {
        const batch = db.batch();
        
        // Actualizar estado de la orden
        const orderRef = db.collection('orders').doc(params.orderId);
        batch.update(orderRef, {
          status,
          updatedAt: new Date()
        });

        // Devolver stock de productos
        for (const item of order.items) {
          const productRef = db.collection('products').doc(item.productId);
          const productDoc = await productRef.get();
          
          if (productDoc.exists) {
            const product = productDoc.data()!;
            batch.update(productRef, {
              stock: product.stock + item.quantity
            });
          }
        }

        await batch.commit();
      } else {
        // Actualizar solo el estado
        await db.collection('orders').doc(params.orderId).update({
          status,
          updatedAt: new Date()
        });
      }

      const updatedDoc = await db.collection('orders').doc(params.orderId).get();
      return NextResponse.json({
        id: updatedDoc.id,
        ...updatedDoc.data()
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}