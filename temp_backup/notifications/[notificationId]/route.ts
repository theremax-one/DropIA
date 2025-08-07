import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withAuth } from '@/lib/api-middlewares';

export async function PUT(
  request: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  return withAuth(request, async (userId) => {
    try {
      const docRef = db.collection('notifications').doc(params.notificationId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return NextResponse.json(
          { error: 'Notificación no encontrada' },
          { status: 404 }
        );
      }

      const notification = doc.data()!;
      if (notification.userId !== userId) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 403 }
        );
      }

      await docRef.update({
        status: 'read',
        updatedAt: new Date(),
      });

      const updatedDoc = await docRef.get();
      return NextResponse.json({
        id: updatedDoc.id,
        ...updatedDoc.data()
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}