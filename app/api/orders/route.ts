import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withAuth } from '@/lib/api-middlewares';
import type { Order, Cart } from '@/types';

export async function GET(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status');

      let ordersRef = db.collection('orders').where('userId', '==', userId);

      if (status) {
        ordersRef = ordersRef.where('status', '==', status);
      }

      const snapshot = await ordersRef.orderBy('createdAt', 'desc').get();
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json(orders);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const data = await request.json();
      const { shippingAddress } = data;

      // Obtener el carrito del usuario
      const cartDoc = await db.collection('carts').doc(userId).get();
      if (!cartDoc.exists) {
        return NextResponse.json(
          { error: 'Carrito no encontrado' },
          { status: 404 }
        );
      }

      const cart = cartDoc.data() as Cart;
      if (cart.items.length === 0) {
        return NextResponse.json(
          { error: 'El carrito está vacío' },
          { status: 400 }
        );
      }

      // Verificar stock de todos los productos
      const batch = db.batch();
      const productUpdates: { id: string; newStock: number }[] = [];

      for (const item of cart.items) {
        const productDoc = await db.collection('products').doc(item.productId).get();
        if (!productDoc.exists) {
          return NextResponse.json(
            { error: `Producto ${item.productId} no encontrado` },
            { status: 404 }
          );
        }

        const product = productDoc.data()!;
        if (product.stock < item.quantity) {
          return NextResponse.json(
            { error: `No hay suficiente stock para ${product.name}` },
            { status: 400 }
          );
        }

        productUpdates.push({
          id: item.productId,
          newStock: product.stock - item.quantity
        });
      }

      // Calcular comisión de la plataforma (10%)
      const platformFee = cart.total * 0.1;

      // Crear la orden
      const orderData: Omit<Order, 'id'> = {
        userId,
        items: cart.items,
        total: cart.total,
        status: 'pending',
        shippingAddress,
        platformFee,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const orderRef = db.collection('orders').doc();
      batch.set(orderRef, orderData);

      // Actualizar stock de productos
      for (const update of productUpdates) {
        const productRef = db.collection('products').doc(update.id);
        batch.update(productRef, { stock: update.newStock });
      }

      // Limpiar carrito
      const cartRef = db.collection('carts').doc(userId);
      batch.delete(cartRef);

      // Ejecutar todas las operaciones
      await batch.commit();

      const order = {
        id: orderRef.id,
        ...orderData
      };

      return NextResponse.json(order);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}