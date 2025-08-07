import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withRole } from '@/lib/api-middlewares';

export async function GET(request: NextRequest) {
  return withRole(request, ['admin'], async () => {
    try {
      const snapshot = await db.collection('payouts')
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'desc')
        .get();

      const payouts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json(payouts);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

export async function PUT(request: NextRequest) {
  return withRole(request, ['admin'], async () => {
    try {
      const data = await request.json();
      const { payoutId, status, reason } = data;

      const payoutRef = db.collection('payouts').doc(payoutId);
      const payoutDoc = await payoutRef.get();

      if (!payoutDoc.exists) {
        return NextResponse.json(
          { error: 'Solicitud de pago no encontrada' },
          { status: 404 }
        );
      }

      const payout = payoutDoc.data()!;
      const batch = db.batch();

      // Actualizar estado de la solicitud
      batch.update(payoutRef, {
        status,
        reason,
        updatedAt: new Date(),
      });

      // Si se aprueba, actualizar el balance del vendedor
      if (status === 'completed') {
        const balanceRef = db.collection('seller_balances').doc(payout.sellerId);
        const balanceDoc = await balanceRef.get();

        if (balanceDoc.exists) {
          const balance = balanceDoc.data()!;
          batch.update(balanceRef, {
            pendingAmount: balance.pendingAmount - payout.amount,
            lastPayout: {
              amount: payout.amount,
              date: new Date(),
            },
            updatedAt: new Date(),
          });
        }
      }

      await batch.commit();

      const updatedDoc = await payoutRef.get();
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