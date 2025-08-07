import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withRole } from '@/lib/api-middlewares';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ saleId: string }> }
) {
  return withRole(request, ['user', 'seller', 'admin'], async (userId) => {
    try {
      const { saleId } = await params;
      
      const saleDoc = await db.collection('sales').doc(saleId).get();
      
      if (!saleDoc.exists) {
        return NextResponse.json(
          { error: 'Venta no encontrada' },
          { status: 404 }
        );
      }

      const saleData = saleDoc.data()!;
      
      // Verificar que el usuario puede acceder a esta venta
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      // Solo el comprador, vendedor o admin pueden ver la venta
      if (saleData.buyerId !== userId && 
          saleData.sellerId !== userId && 
          userData?.email !== 'admin@dropia.com') {
        return NextResponse.json(
          { error: 'No autorizado para ver esta venta' },
          { status: 403 }
        );
      }

      // Obtener información adicional
      const [buyerDoc, sellerDoc, productDoc] = await Promise.all([
        db.collection('users').doc(saleData.buyerId).get(),
        db.collection('users').doc(saleData.sellerId).get(),
        db.collection('products').doc(saleData.productId).get(),
      ]);

      const buyer = buyerDoc.data();
      const seller = sellerDoc.data();
      const product = productDoc.data();

      const sale = {
        id: saleDoc.id,
        ...saleData,
        buyer: buyer ? {
          name: buyer.name || buyer.displayName || 'Usuario',
          email: buyer.email,
        } : null,
        seller: seller ? {
          name: seller.name || seller.displayName || 'Vendedor',
          email: seller.email,
        } : null,
        product: product ? {
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          fileUrl: product.fileUrl,
        } : null,
        createdAt: saleData.createdAt?.toDate?.() || saleData.createdAt,
        updatedAt: saleData.updatedAt?.toDate?.() || saleData.updatedAt,
      };

      return NextResponse.json(sale);
    } catch (error: any) {
      console.error('Error fetching sale:', error);
      return NextResponse.json(
        { error: error.message || 'Error al obtener la venta' },
        { status: 500 }
      );
    }
  });
} 