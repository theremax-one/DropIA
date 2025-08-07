import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET - Obtener producto específico
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      categoryId,
      stock,
      images,
      features,
      type,
      downloadUrl,
      requirements,
      demoUrl,
      apiEndpoint,
      subscriptionDuration,
    } = body;

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Actualizar el producto
    const product = await prisma.product.update({
      where: { id: params.productId },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        categoryId,
        stock: stock ? parseInt(stock) : undefined,
        images,
        features,
        type,
        downloadUrl,
        requirements,
        demoUrl,
        apiEndpoint,
        subscriptionDuration: subscriptionDuration ? parseInt(subscriptionDuration) : undefined,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Eliminar el producto
    await prisma.product.delete({
      where: { id: params.productId },
    });

    // Actualizar contador de productos en la categoría
    if (existingProduct.categoryId) {
      await prisma.category.update({
        where: { id: existingProduct.categoryId },
        data: {
          productCount: {
            decrement: 1,
          },
        },
      });
    }

    return NextResponse.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}