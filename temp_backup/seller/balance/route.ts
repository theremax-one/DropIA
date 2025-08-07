import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withRole } from '@/lib/api-middlewares';

export async function GET(request: NextRequest) {
  return withRole(request, ['seller'], async (userId) => {
    try {
      // Obtener el balance del vendedor
      const balanceDoc = await db.collection('seller_balances').doc(userId).get();
      
      if (!balanceDoc.exists) {
        // Crear balance inicial si no existe
        const initialBalance = {
          sellerId: userId,
          availableAmount: 0,
          pendingAmount: 0,
          totalEarnings: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection('seller_balances').doc(userId).set(initialBalance);
        return NextResponse.json(initialBalance);
      }

      // Obtener órdenes pagadas para calcular ganancias pendientes
      const ordersSnapshot = await db.collection('orders')
        .where('status', '==', 'paid')
        .get();

      let pendingAmount = 0;
      let totalEarnings = 0;

      ordersSnapshot.docs.forEach(doc => {
        const order = doc.data();
        const sellerItems = order.items.filter(item => item.sellerId === userId);
        const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const platformFee = sellerTotal * 0.1; // 10% de comisión
        const earnings = sellerTotal - platformFee;
        
        if (order.status === 'paid') {
          pendingAmount += earnings;
        }
        totalEarnings += earnings;
      });

      // Obtener pagos completados
      const payoutsSnapshot = await db.collection('payouts')
        .where('sellerId', '==', userId)
        .where('status', '==', 'completed')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      const lastPayout = payoutsSnapshot.empty ? null : {
        amount: payoutsSnapshot.docs[0].data().amount,
        date: payoutsSnapshot.docs[0].data().createdAt,
      };

      const balance = {
        ...balanceDoc.data(),
        pendingAmount,
        totalEarnings,
        lastPayout,
      };

      return NextResponse.json(balance);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}