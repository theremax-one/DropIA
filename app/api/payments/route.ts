import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { stripe } from '@/lib/stripe/config';
import { withAuth } from '@/lib/api-middlewares';
import type { Order } from '@/types';

export async function POST(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const data = await request.json();
      const { orderId } = data;

      // Obtener la orden
      const orderDoc = await db.collection('orders').doc(orderId).get();
      if (!orderDoc.exists) {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        );
      }

      const order = orderDoc.data() as Order;
      if (order.userId !== userId) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 403 }
        );
      }

      if (order.status !== 'pending') {
        return NextResponse.json(
          { error: 'La orden no está pendiente de pago' },
          { status: 400 }
        );
      }

      // Crear PaymentIntent con Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.total * 100), // Stripe usa centavos
        currency: 'usd',
        metadata: {
          orderId,
          userId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Actualizar orden con el ID del PaymentIntent
      await db.collection('orders').doc(orderId).update({
        paymentIntentId: paymentIntent.id,
        updatedAt: new Date(),
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}