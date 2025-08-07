import { NextRequest, NextResponse } from 'next/server';

// Middleware simple para verificar roles sin Firebase
export function withRole(
  request: NextRequest,
  allowedRoles: string[],
  handler: (userId: string) => Promise<NextResponse>
) {
  return async () => {
    try {
      // Simular autenticación (en producción usarías JWT o sesiones)
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 401 }
        );
      }

      // Simular userId (en producción extraerías del token)
      const userId = 'user-123';
      
      return await handler(userId);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Error interno del servidor' },
        { status: 500 }
      );
    }
  };
}