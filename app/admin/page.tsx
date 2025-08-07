'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency } from '@/lib/utils';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  BarChart3,
  Download,
  Calendar,
  User,
  Star
} from 'lucide-react';

interface AdminStats {
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  totalProducts: number;
  totalUsers: number;
  totalSellers: number;
  salesThisMonth: number;
  revenueThisMonth: number;
}

interface Sale {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  productName: string;
  createdAt: any;
  status: string;
  buyer?: {
    displayName: string;
    email: string;
  };
  seller?: {
    displayName: string;
    email: string;
  };
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalSales: 0,
    totalRevenue: 0,
    totalCommission: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalSellers: 0,
    salesThisMonth: 0,
    revenueThisMonth: 0,
  });
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Verificar si es admin (email específico)
    if (user.email !== 'admin@dropia.com') {
      toast({
        title: 'Acceso denegado',
        description: 'Solo los administradores pueden acceder a esta página.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    loadAdminData();
  }, [user, router]);

  const loadAdminData = async () => {
    try {
      // Cargar estadísticas
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Cargar ventas
      const salesResponse = await fetch('/api/admin/sales');
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setSales(salesData);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Cargando panel de administración...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Panel de Administración
              </h1>
              <p className="text-slate-400">
                Gestiona la plataforma DropIA
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-green-500 text-green-400">
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-slate-400">
                +{formatCurrency(stats.revenueThisMonth)} este mes
              </p>
            </CardContent>
          </Card>

          {/* Commission */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Comisiones (10%)
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(stats.totalCommission)}
              </div>
              <p className="text-xs text-slate-400">
                Comisión de la plataforma
              </p>
            </CardContent>
          </Card>

          {/* Total Sales */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Ventas Totales
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalSales.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">
                +{stats.salesThisMonth} este mes
              </p>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Usuarios
              </CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">
                {stats.totalSellers} vendedores
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="sales" className="text-slate-300">Ventas</TabsTrigger>
            <TabsTrigger value="products" className="text-slate-300">Productos</TabsTrigger>
            <TabsTrigger value="users" className="text-slate-300">Usuarios</TabsTrigger>
          </TabsList>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Todas las Ventas</CardTitle>
                <CardDescription className="text-slate-400">
                  Historial completo de transacciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{sale.productName}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <span>Comprador: {sale.buyer?.displayName || 'Anónimo'}</span>
                            <span>Vendedor: {sale.seller?.displayName || 'Anónimo'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{formatCurrency(sale.price)}</p>
                        <p className="text-sm text-slate-400">
                          {sale.createdAt?.toDate?.()?.toLocaleDateString() || 'Fecha no disponible'}
                        </p>
                        <Badge className="bg-green-100 text-green-800">
                          {sale.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas de Productos</CardTitle>
                <CardDescription className="text-slate-400">
                  Información general de productos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {stats.totalProducts}
                    </div>
                    <p className="text-slate-400">Productos totales</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {stats.totalSellers}
                    </div>
                    <p className="text-slate-400">Vendedores activos</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {formatCurrency(stats.totalRevenue / Math.max(stats.totalProducts, 1))}
                    </div>
                    <p className="text-slate-400">Promedio por producto</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas de Usuarios</CardTitle>
                <CardDescription className="text-slate-400">
                  Información de la comunidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {stats.totalUsers}
                    </div>
                    <p className="text-slate-400">Usuarios registrados</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {stats.totalSellers}
                    </div>
                    <p className="text-slate-400">Vendedores</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {stats.totalUsers - stats.totalSellers}
                    </div>
                    <p className="text-slate-400">Compradores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 