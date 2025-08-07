import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import { withRole } from '@/lib/api-middlewares';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  return withRole(request, ['admin'], async () => {
    try {
      // Simular datos de payouts (en producción tendrías una tabla de payouts)
      const payouts = [
        {
          id: '1',
          sellerId: 'seller-1',
          amount: 150.00,
          status: 'pending',
          reason: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

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

      // Simular actualización de payout (en producción actualizarías la base de datos)
      const updatedPayout = {
        id: payoutId,
        sellerId: 'seller-1',
        amount: 150.00,
        status,
        reason,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return NextResponse.json(updatedPayout);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}