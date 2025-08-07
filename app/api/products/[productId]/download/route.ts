import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// POST - Descargar producto
export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Verificar stock
    if (product.stock <= 0) {
      return NextResponse.json({ error: 'Producto sin stock' }, { status: 400 });
    }

    // Verificar que el usuario no sea el vendedor (no puede comprar sus propios productos)
    if (product.sellerId === userId) {
      return NextResponse.json({ error: 'No puedes comprar tus propios productos' }, { status: 400 });
    }

    // Aquí normalmente se procesaría el pago
    // Por ahora, simulamos una compra exitosa

    // Reducir stock
    await prisma.product.update({
      where: { id: params.productId },
      data: {
        stock: {
          decrement: 1,
        },
      },
    });

    // Crear orden
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'completed',
        total: product.price,
        items: {
          create: {
            productId: params.productId,
            quantity: 1,
            price: product.price,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Registrar acceso del usuario al producto
    // Esto se puede implementar en una tabla separada para tracking

    return NextResponse.json({
      message: 'Descarga exitosa',
      downloadUrl: product.downloadUrl,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Error al procesar descarga:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 