import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withRole } from '@/lib/api-middlewares';
import { sendInvoiceEmail } from '@/lib/services/email-service';
import { generateInvoiceNumber, generateInvoiceHtml, type InvoiceData } from '@/lib/services/invoice-generator';

export async function GET(request: NextRequest) {
  return withRole(request, ['user', 'seller', 'admin'], async (userId) => {
    try {
      const { searchParams } = new URL(request.url);
      const sellerId = searchParams.get('sellerId');
      const buyerId = searchParams.get('buyerId');

      let query = db.collection('sales');

      // Filtrar por vendedor o comprador según el rol
      if (sellerId) {
        query = query.where('sellerId', '==', sellerId);
      } else if (buyerId) {
        query = query.where('buyerId', '==', buyerId);
      }

      const snapshot = await query.orderBy('createdAt', 'desc').get();
      const sales = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      }));

      return NextResponse.json(sales);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withRole(request, ['user', 'seller', 'admin'], async (buyerId) => {
    try {
      const { productId } = await request.json();

      if (!productId) {
        return NextResponse.json(
          { error: 'ID del producto requerido' },
          { status: 400 }
        );
      }

      // Obtener el producto
      const productDoc = await db.collection('products').doc(productId).get();
      
      if (!productDoc.exists) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }

      const product = productDoc.data()!;

      // Verificar stock
      if (product.stock <= 0) {
        return NextResponse.json(
          { error: 'Producto sin stock disponible' },
          { status: 400 }
        );
      }

      // Verificar que no se compre a sí mismo
      if (product.sellerId === buyerId) {
        return NextResponse.json(
          { error: 'No puedes comprar tu propio producto' },
          { status: 400 }
        );
      }

      const invoiceNumber = generateInvoiceNumber();
      
      // Crear la venta
      const saleData = {
        productId,
        buyerId,
        sellerId: product.sellerId,
        price: product.price,
        productName: product.name,
        invoiceNumber,
        createdAt: new Date(),
        status: 'completed',
      };

      const saleRef = await db.collection('sales').add(saleData);

      // Actualizar stock del producto
      await productDoc.ref.update({
        stock: product.stock - 1,
        updatedAt: new Date(),
      });

      // Obtener información del comprador y vendedor
      const buyerDoc = await db.collection('users').doc(buyerId).get();
      const sellerDoc = await db.collection('users').doc(product.sellerId).get();
      const categoryDoc = await db.collection('categories').doc(product.categoryId).get();

      const buyer = buyerDoc.data();
      const seller = sellerDoc.data();
      const category = categoryDoc.data();

      // Generar factura
      const invoiceData: InvoiceData = {
        invoiceNumber,
        buyerName: buyer?.name || buyer?.displayName || 'Usuario',
        buyerEmail: buyer?.email || '',
        productName: product.name,
        productId: productId,
        price: product.price,
        purchaseDate: new Date(),
        sellerName: seller?.name || seller?.displayName || 'Vendedor',
        category: category?.name,
      };

      const invoiceHtml = generateInvoiceHtml(invoiceData);

      // Enviar email con factura
      if (buyer?.email) {
        try {
          await sendInvoiceEmail(
            buyer.email,
            buyer.name || buyer.displayName || 'Usuario',
            {
              invoiceNumber,
              productName: product.name,
              price: product.price,
              purchaseDate: new Date(),
              productId: productId,
            },
            invoiceHtml
          );
        } catch (error) {
          console.error('Error enviando email de factura:', error);
          // No fallar la venta si el email falla
        }
      }

      // Obtener la venta creada
      const saleDoc = await saleRef.get();

      return NextResponse.json({
        id: saleDoc.id,
        ...saleDoc.data(),
        invoiceNumber,
        invoiceHtml,
      });
    } catch (error: any) {
      console.error('Error creating sale:', error);
      return NextResponse.json(
        { error: error.message || 'Error al procesar la venta' },
        { status: 500 }
      );
    }
  });
} 