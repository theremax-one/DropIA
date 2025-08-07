import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { stripe } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature')!;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const { orderId } = paymentIntent.metadata;

        const batch = db.batch();

        // Obtener la orden
        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
          throw new Error('Orden no encontrada');
        }

        const order = orderDoc.data()!;

        // Actualizar estado de la orden
        batch.update(orderRef, {
          status: 'paid',
          updatedAt: new Date(),
        });

        // Agrupar items por vendedor
        const itemsBySeller = order.items.reduce((acc, item) => {
          if (!acc[item.sellerId]) {
            acc[item.sellerId] = [];
          }
          acc[item.sellerId].push(item);
          return acc;
        }, {});

        // Procesar comisiones y actualizar balances por vendedor
        for (const [sellerId, items] of Object.entries(itemsBySeller)) {
          const sellerTotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const platformFee = sellerTotal * 0.1; // 10% de comisión

          // Registrar comisión
          const feeRef = db.collection('platform_fees').doc();
          batch.set(feeRef, {
            orderId,
            sellerId,
            amount: platformFee,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Actualizar balance del vendedor
          const balanceRef = db.collection('seller_balances').doc(sellerId);
          const balanceDoc = await balanceRef.get();

          if (balanceDoc.exists) {
            const balance = balanceDoc.data()!;
            batch.update(balanceRef, {
              pendingAmount: balance.pendingAmount + (sellerTotal - platformFee),
              totalEarnings: balance.totalEarnings + (sellerTotal - platformFee),
              updatedAt: new Date(),
            });
          } else {
            batch.set(balanceRef, {
              sellerId,
              pendingAmount: sellerTotal - platformFee,
              totalEarnings: sellerTotal - platformFee,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }

        await batch.commit();
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const { orderId } = paymentIntent.metadata;

        // Actualizar estado de la orden
        await db.collection('orders').doc(orderId).update({
          status: 'pending',
          updatedAt: new Date(),
        });

        break;
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error('Error en webhook:', error.message);
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
}