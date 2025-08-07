import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';

// Middleware para verificar autenticación
export async function withAuth(
  request: NextRequest,
  handler: (userId: string) => Promise<NextResponse>
) {
  try {
    // Obtener token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Verificar token con Firebase Auth
    const decodedToken = await auth.verifyIdToken(token);
    return await handler(decodedToken.uid);
  } catch (error: any) {
    console.error('Error de autenticación:', error);
    return NextResponse.json(
      { error: 'Error de autenticación' },
      { status: 401 }
    );
  }
}

// Middleware para verificar rol de administrador
export async function withAdmin(
  request: NextRequest,
  handler: (userId: string) => Promise<NextResponse>
) {
  return withAuth(request, async (userId) => {
    try {
      // Obtener usuario de Firebase Auth
      const user = await auth.getUser(userId);
      
      // Verificar si es administrador (usando claims)
      const isAdmin = user.customClaims?.isAdmin === true;
      
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Acceso denegado' },
          { status: 403 }
        );
      }

      return await handler(userId);
    } catch (error: any) {
      console.error('Error de verificación de admin:', error);
      return NextResponse.json(
        { error: 'Error de verificación de permisos' },
        { status: 500 }
      );
    }
  });
}

// Middleware para verificar rol de vendedor
export async function withSeller(
  request: NextRequest,
  handler: (userId: string) => Promise<NextResponse>
) {
  return withAuth(request, async (userId) => {
    try {
      // Obtener usuario de Firebase Auth
      const user = await auth.getUser(userId);
      
      // Verificar si es vendedor (usando claims)
      const isSeller = user.customClaims?.isSeller === true;
      
      if (!isSeller) {
        return NextResponse.json(
          { error: 'Acceso denegado' },
          { status: 403 }
        );
      }

      return await handler(userId);
    } catch (error: any) {
      console.error('Error de verificación de vendedor:', error);
      return NextResponse.json(
        { error: 'Error de verificación de permisos' },
        { status: 500 }
      );
    }
  });
}

// Middleware para verificar roles específicos
export async function withRole(
  request: NextRequest,
  allowedRoles: string[],
  handler: (userId: string) => Promise<NextResponse>
) {
  return withAuth(request, async (userId) => {
    try {
      // Obtener usuario de Firebase Auth
      const user = await auth.getUser(userId);
      
      // Verificar si tiene alguno de los roles permitidos
      const hasRole = allowedRoles.some(role => {
        switch (role) {
          case 'admin':
            return user.customClaims?.isAdmin === true;
          case 'seller':
            return user.customClaims?.isSeller === true;
          default:
            return false;
        }
      });
      
      if (!hasRole) {
        return NextResponse.json(
          { error: 'Acceso denegado' },
          { status: 403 }
        );
      }

      return await handler(userId);
    } catch (error: any) {
      console.error('Error de verificación de rol:', error);
      return NextResponse.json(
        { error: 'Error de verificación de permisos' },
        { status: 500 }
      );
    }
  });
}