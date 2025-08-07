import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withAuth } from '@/lib/api-middlewares';

export async function GET(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const snapshot = await db.collection('notifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json(notifications);
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
      const batch = db.batch();
      const snapshot = await db.collection('notifications')
        .where('userId', '==', userId)
        .where('status', '==', 'unread')
        .get();

      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'read',
          updatedAt: new Date(),
        });
      });

      await batch.commit();

      return new NextResponse(null, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}