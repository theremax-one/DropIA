import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withRole } from '@/lib/api-middlewares';

export async function GET(request: NextRequest) {
  return withRole(request, ['seller'], async (userId) => {
    try {
      const snapshot = await db.collection('payouts')
        .where('sellerId', '==', userId)
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

export async function POST(request: NextRequest) {
  return withRole(request, ['seller'], async (userId) => {
    try {
      const data = await request.json();
      const { amount, bankInfo } = data;

      // Verificar que el monto solicitado esté disponible
      const balanceDoc = await db.collection('seller_balances').doc(userId).get();
      if (!balanceDoc.exists) {
        return NextResponse.json(
          { error: 'Balance no encontrado' },
          { status: 404 }
        );
      }

      const balance = balanceDoc.data()!;
      if (amount > balance.pendingAmount) {
        return NextResponse.json(
          { error: 'Monto solicitado mayor al disponible' },
          { status: 400 }
        );
      }

      // Crear la solicitud de pago
      const payoutData = {
        sellerId: userId,
        amount,
        status: 'pending',
        bankInfo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db.collection('payouts').add(payoutData);
      const doc = await docRef.get();

      return NextResponse.json({
        id: doc.id,
        ...doc.data()
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}