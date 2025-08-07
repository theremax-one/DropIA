import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { withRole } from '@/lib/api-middlewares';

export async function GET(request: NextRequest) {
  return withRole(request, ['admin'], async (userId) => {
    try {
      // Verificar que sea admin
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      if (userData?.email !== 'admin@dropia.com') {
        return NextResponse.json(
          { error: 'Acceso denegado' },
          { status: 403 }
        );
      }

      // Obtener estadísticas de ventas
      const salesSnapshot = await db.collection('sales').get();
      const sales = salesSnapshot.docs.map(doc => doc.data());
      
      const totalSales = sales.length;
      const totalRevenue = sales.reduce((sum, sale) => sum + (sale.price || 0), 0);
      const totalCommission = totalRevenue * 0.1; // 10% de comisión

      // Ventas del mes actual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const salesThisMonth = sales.filter(sale => {
        const saleDate = sale.createdAt?.toDate?.() || new Date(sale.createdAt);
        return saleDate >= startOfMonth;
      });
      
      const salesThisMonthCount = salesThisMonth.length;
      const revenueThisMonth = salesThisMonth.reduce((sum, sale) => sum + (sale.price || 0), 0);

      // Obtener estadísticas de productos
      const productsSnapshot = await db.collection('products').get();
      const totalProducts = productsSnapshot.size;

      // Obtener estadísticas de usuarios
      const usersSnapshot = await db.collection('users').get();
      const users = usersSnapshot.docs.map(doc => doc.data());
      const totalUsers = users.length;
      const totalSellers = users.filter(user => user.isSeller).length;

      return NextResponse.json({
        totalSales,
        totalRevenue,
        totalCommission,
        totalProducts,
        totalUsers,
        totalSellers,
        salesThisMonth: salesThisMonthCount,
        revenueThisMonth,
      });
    } catch (error: any) {
      console.error('Error getting admin stats:', error);
      return NextResponse.json(
        { error: error.message || 'Error al obtener estadísticas' },
        { status: 500 }
      );
    }
  });
} 