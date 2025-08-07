import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withAuth } from '@/lib/api-middlewares';
import type { Cart, CartItem } from '@/types';

export async function GET(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const doc = await db.collection('carts').doc(userId).get();
      
      if (!doc.exists) {
        return NextResponse.json({
          id: userId,
          userId,
          items: [],
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      const cart = {
        id: doc.id,
        ...doc.data()
      };

      return NextResponse.json(cart);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const data = await request.json();
      const { productId, quantity } = data;

      // Verificar que el producto existe y tiene stock
      const productDoc = await db.collection('products').doc(productId).get();
      if (!productDoc.exists) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }

      const product = productDoc.data()!;
      if (product.stock < quantity) {
        return NextResponse.json(
          { error: 'No hay suficiente stock' },
          { status: 400 }
        );
      }

      // Obtener o crear el carrito
      const cartRef = db.collection('carts').doc(userId);
      const cartDoc = await cartRef.get();
      
      if (!cartDoc.exists) {
        const newCart: Cart = {
          id: userId,
          userId,
          items: [{
            id: productId,
            productId,
            quantity,
            price: product.price,
            createdAt: new Date(),
            updatedAt: new Date(),
          }],
          total: product.price * quantity,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await cartRef.set(newCart);
        return NextResponse.json(newCart);
      }

      // Actualizar carrito existente
      const cart = cartDoc.data() as Cart;
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

      if (existingItemIndex > -1) {
        // Actualizar cantidad si el producto ya está en el carrito
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].updatedAt = new Date();
      } else {
        // Agregar nuevo item al carrito
        cart.items.push({
          id: productId,
          productId,
          quantity,
          price: product.price,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Recalcular total
      cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      cart.updatedAt = new Date();

      await cartRef.update(cart);
      return NextResponse.json(cart);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const data = await request.json();
      const { productId, quantity } = data;

      if (quantity < 0) {
        return NextResponse.json(
          { error: 'La cantidad debe ser mayor o igual a 0' },
          { status: 400 }
        );
      }

      const cartRef = db.collection('carts').doc(userId);
      const cartDoc = await cartRef.get();

      if (!cartDoc.exists) {
        return NextResponse.json(
          { error: 'Carrito no encontrado' },
          { status: 404 }
        );
      }

      const cart = cartDoc.data() as Cart;
      const itemIndex = cart.items.findIndex(item => item.productId === productId);

      if (itemIndex === -1) {
        return NextResponse.json(
          { error: 'Producto no encontrado en el carrito' },
          { status: 404 }
        );
      }

      if (quantity === 0) {
        // Eliminar el producto del carrito
        cart.items.splice(itemIndex, 1);
      } else {
        // Verificar stock
        const productDoc = await db.collection('products').doc(productId).get();
        if (!productDoc.exists) {
          return NextResponse.json(
            { error: 'Producto no encontrado' },
            { status: 404 }
          );
        }

        const product = productDoc.data()!;
        if (product.stock < quantity) {
          return NextResponse.json(
            { error: 'No hay suficiente stock' },
            { status: 400 }
          );
        }

        // Actualizar cantidad
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].updatedAt = new Date();
      }

      // Recalcular total
      cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      cart.updatedAt = new Date();

      await cartRef.update(cart);
      return NextResponse.json(cart);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const cartRef = db.collection('carts').doc(userId);
      await cartRef.delete();
      
      return new NextResponse(null, { status: 204 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}