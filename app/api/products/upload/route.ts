import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withRole } from '@/lib/api-middlewares';
import { uploadFile, generateProductFilePath } from '@/lib/firebase/storage';

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

      // Crear el producto en Firestore primero
      const productData = {
        name,
        description,
        price,
        categoryId,
        stock,
        sellerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        fileUrl: '', // Se actualizará después de subir el archivo
        filePath: '', // Ruta del archivo en Storage
      };

      const docRef = await db.collection('products').add(productData);
      const productId = docRef.id;

      // Generar ruta del archivo
      const filePath = generateProductFilePath(userId, productId, file.name);

      // Subir archivo a Firebase Storage
      const fileUrl = await uploadFile(file, filePath);

      // Actualizar el producto con la URL del archivo
      await docRef.update({
        fileUrl,
        filePath,
      });

      // Obtener el producto actualizado
      const doc = await docRef.get();

      return NextResponse.json({
        id: doc.id,
        ...doc.data(),
      });
    } catch (error: any) {
      console.error('Error uploading product:', error);
      return NextResponse.json(
        { error: error.message || 'Error al subir el producto' },
        { status: 500 }
      );
    }
  });
} 