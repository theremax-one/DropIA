import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withRole } from '@/lib/api-middlewares';

export async function GET(request: NextRequest) {
  return withRole(request, ['admin'], async (userId) => {
    try {
      // Verificar que sea admin
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      if (userData?.email !== 'admin@dropia.com') {
        return NextResponse.json(
          { error: 'Acceso denegado' },
          { status: 403 }
        );
      }

      // Obtener todas las ventas con información de usuarios
      const salesSnapshot = await db.collection('sales').orderBy('createdAt', 'desc').get();
      const sales = [];

      for (const doc of salesSnapshot.docs) {
        const saleData = doc.data();
        
        // Obtener información del comprador
        let buyer = null;
        try {
          const buyerDoc = await db.collection('users').doc(saleData.buyerId).get();
          if (buyerDoc.exists) {
            buyer = buyerDoc.data();
          }
        } catch (error) {
          console.error('Error getting buyer data:', error);
        }

        // Obtener información del vendedor
        let seller = null;
        try {
          const sellerDoc = await db.collection('users').doc(saleData.sellerId).get();
          if (sellerDoc.exists) {
            seller = sellerDoc.data();
          }
        } catch (error) {
          console.error('Error getting seller data:', error);
        }

        sales.push({
          id: doc.id,
          ...saleData,
          buyer: buyer ? {
            displayName: buyer.displayName || buyer.name || 'Anónimo',
            email: buyer.email,
          } : null,
          seller: seller ? {
            displayName: seller.displayName || seller.name || 'Anónimo',
            email: seller.email,
          } : null,
          createdAt: saleData.createdAt,
        });
      }

      return NextResponse.json(sales);
    } catch (error: any) {
      console.error('Error getting admin sales:', error);
      return NextResponse.json(
        { error: error.message || 'Error al obtener ventas' },
        { status: 500 }
      );
    }
  });
} 