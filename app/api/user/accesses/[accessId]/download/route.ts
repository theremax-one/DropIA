import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withAuth } from '@/lib/api-middlewares';
import { randomBytes } from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: { accessId: string } }
) {
  return withAuth(request, async (userId) => {
    try {
      // Verificar el acceso
      const accessRef = db.collection('user_accesses').doc(params.accessId);
      const accessDoc = await accessRef.get();

      if (!accessDoc.exists) {
        return NextResponse.json(
          { error: 'Acceso no encontrado' },
          { status: 404 }
        );
      }

      const access = accessDoc.data()!;

      // Verificar que el acceso pertenece al usuario
      if (access.userId !== userId) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 403 }
        );
      }

      // Verificar que es un producto de tipo descarga
      if (access.type !== 'download') {
        return NextResponse.json(
          { error: 'Este producto no es de tipo descarga' },
          { status: 400 }
        );
      }

      // Obtener el producto
      const productDoc = await db.collection('products')
        .doc(access.productId)
        .get();

      if (!productDoc.exists) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }

      const product = productDoc.data()!;

      // Generar URL de descarga temporal
      const downloadToken = randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // URL válida por 1 hora

      await db.collection('download_tokens').add({
        token: downloadToken,
        accessId: params.accessId,
        userId,
        productId: access.productId,
        expiresAt,
        createdAt: new Date(),
      });

      // Actualizar estadísticas de uso
      const stats = access.usageStats || {};
      await accessRef.update({
        usageStats: {
          ...stats,
          downloads: (stats.downloads || 0) + 1,
          lastUsed: new Date(),
        },
        updatedAt: new Date(),
      });

      // Devolver URL temporal
      const downloadUrl = `${product.deliveryInfo.downloadUrl}?token=${downloadToken}`;
      return NextResponse.json({ url: downloadUrl });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}