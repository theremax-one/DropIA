import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import { withRole } from '@/lib/api-middlewares';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  return withRole(request, ['seller', 'admin'], async (userId) => {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const price = parseFloat(formData.get('price') as string);
      const categoryId = formData.get('categoryId') as string;
      const stock = parseInt(formData.get('stock') as string);

      if (!file) {
        return NextResponse.json(
          { error: 'Archivo requerido' },
          { status: 400 }
        );
      }

      // Validar tamaño del archivo (máximo 100MB)
      if (file.size > 100 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El archivo no puede superar los 100MB' },
          { status: 400 }
        );
      }

      // Simular URL del archivo (en producción usarías Firebase Storage)
      const fileUrl = `https://example.com/uploads/${Date.now()}-${file.name}`;
      const filePath = `uploads/${Date.now()}-${file.name}`;

      // Crear el producto en la base de datos
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          categoryId,
          stock,
          sellerId: userId,
          downloadUrl: fileUrl,
          images: JSON.stringify([fileUrl]), // Simular array de imágenes
          features: JSON.stringify([]), // Array vacío de features
        },
        include: {
          category: true,
          seller: true,
        },
      });

      // Incrementar el contador de productos en la categoría
      if (categoryId) {
        await prisma.category.update({
          where: { id: categoryId },
          data: {
            productCount: {
              increment: 1,
            },
          },
        });
      }

      return NextResponse.json(product);
    } catch (error: any) {
      console.error('Error uploading product:', error);
      return NextResponse.json(
        { error: error.message || 'Error al subir el producto' },
        { status: 500 }
      );
    }
  });
} 