'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart,
  Eye,
  Star,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Settings,
  Bell,
  User,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency } from '@/lib/utils';
import { DashboardCharts } from '@/components/ui/dashboard-charts';
import { OnboardingWizard } from '@/components/ui/onboarding-wizard';

interface DashboardStats {
  totalSales: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  salesGrowth: number;
  revenueGrowth: number;
  customerGrowth: number;
  productGrowth: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  productName: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  rating: number;
  image: string;
}

interface SalesData {
  date: string;
  sales: number;
  revenue: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    salesGrowth: 0,
    revenueGrowth: 0,
    customerGrowth: 0,
    productGrowth: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadDashboardData();
    
    // Verificar si es un usuario nuevo (por ejemplo, si no tiene productos)
    if (user) {
      // Simular verificación de usuario nuevo
      setTimeout(() => {
        setIsNewUser(true);
        setShowOnboarding(true);
      }, 2000);
    }
  }, [user, router]);

  const loadDashboardData = async () => {
    try {
      // Simular carga de datos del dashboard
      // En una implementación real, estos datos vendrían de tu API
      setTimeout(() => {
        setStats({
          totalSales: 1247,
          totalProducts: 23,
          totalCustomers: 892,
          totalRevenue: 45678.90,
          salesGrowth: 12.5,
          revenueGrowth: 8.3,
          customerGrowth: 15.7,
          productGrowth: 4.2,
        });

        setRecentOrders([
          {
            id: '1',
            customerName: 'María García',
            productName: 'Paisaje Cyberpunk',
            amount: 15.99,
            status: 'completed',
            date: '2024-01-15',
          },
          {
            id: '2',
            customerName: 'Carlos López',
            productName: 'Ambient Space Music',
            amount: 8.50,
            status: 'pending',
            date: '2024-01-14',
          },
          {
            id: '3',
            customerName: 'Ana Martínez',
            productName: 'Motion Graphics Pack',
            amount: 24.99,
            status: 'completed',
            date: '2024-01-13',
          },
        ]);

        setTopProducts([
          {
            id: '1',
            name: 'Paisaje Cyberpunk',
            sales: 156,
            revenue: 2494.44,
            rating: 4.9,
            image: '/placeholder.jpg',
          },
          {
            id: '2',
            name: 'Ambient Space Music',
            sales: 89,
            revenue: 756.50,
            rating: 4.8,
            image: '/placeholder.jpg',
          },
          {
            id: '3',
            name: 'Motion Graphics Pack',
            sales: 67,
            revenue: 1674.33,
            rating: 5.0,
            image: '/placeholder.jpg',
          },
        ]);

        // Datos para gráficos
        setSalesData([
          { date: 'Ene 1', sales: 45, revenue: 1200 },
          { date: 'Ene 2', sales: 52, revenue: 1400 },
          { date: 'Ene 3', sales: 38, revenue: 980 },
          { date: 'Ene 4', sales: 67, revenue: 1800 },
          { date: 'Ene 5', sales: 73, revenue: 2100 },
          { date: 'Ene 6', sales: 89, revenue: 2400 },
          { date: 'Ene 7', sales: 95, revenue: 2800 },
        ]);

        setCategoryData([
          { name: 'Imágenes', value: 35, color: '#8884d8' },
          { name: 'Música', value: 25, color: '#82ca9d' },
          { name: 'Videos', value: 20, color: '#ffc658' },
          { name: 'eBooks', value: 15, color: '#ff7300' },
          { name: 'Código', value: 5, color: '#00C49F' },
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-8 bg-slate-800 animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-800 animate-pulse rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-slate-800 animate-pulse rounded-lg" />
              <div className="h-96 bg-slate-800 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <OnboardingWizard 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Dashboard
              </h1>
              <p className="text-slate-400">
                Bienvenido de vuelta, {user?.displayName || 'Usuario'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="border-slate-700 text-slate-300">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-slate-700 text-slate-300">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-slate-700 text-slate-300">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

              <div className="container mx-auto px-4 py-8">
          {/* Welcome Banner for New Users */}
          {isNewUser && (
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      ¡Bienvenido a DropIA! 🎉
                    </h2>
                    <p className="text-purple-100 mb-4">
                      Estás listo para comenzar tu viaje en el mundo del contenido generado por IA. 
                      Crea tu primer producto y comienza a monetizar tu creatividad.
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        className="bg-white text-purple-600 hover:bg-purple-50"
                        onClick={() => router.push('/seller/products')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primer Producto
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-white text-white hover:bg-white/10"
                        onClick={() => setIsNewUser(false)}
                      >
                        Entendido
                      </Button>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
              <div className="flex items-center text-xs text-slate-400 mt-1">
                {stats.revenueGrowth > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                )}
                {Math.abs(stats.revenueGrowth)}% desde el mes pasado
              </div>
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
              <div className="flex items-center text-xs text-slate-400 mt-1">
                {stats.salesGrowth > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                )}
                {Math.abs(stats.salesGrowth)}% desde el mes pasado
              </div>
            </CardContent>
          </Card>

          {/* Total Products */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Productos
              </CardTitle>
              <Package className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalProducts}
              </div>
              <div className="flex items-center text-xs text-slate-400 mt-1">
                {stats.productGrowth > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                )}
                {Math.abs(stats.productGrowth)}% desde el mes pasado
              </div>
            </CardContent>
          </Card>

          {/* Total Customers */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalCustomers.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-slate-400 mt-1">
                {stats.customerGrowth > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                )}
                {Math.abs(stats.customerGrowth)}% desde el mes pasado
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts and Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Charts Section */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Análisis de Ventas</CardTitle>
                <CardDescription className="text-slate-400">
                  Rendimiento detallado de ventas e ingresos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardCharts salesData={salesData} categoryData={categoryData} />
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Órdenes Recientes</CardTitle>
                <CardDescription className="text-slate-400">
                  Últimas transacciones de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.customerName}</p>
                          <p className="text-slate-400 text-sm">{order.productName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{formatCurrency(order.amount)}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => router.push('/seller/products')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                  <Activity className="h-4 w-4 mr-2" />
                  Ver Reportes
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendario
                </Button>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Productos Destacados</CardTitle>
                <CardDescription className="text-slate-400">
                  Tus productos más vendidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <span>{product.sales} ventas</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                            {product.rating}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-medium">
                          {formatCurrency(product.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Métricas de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Tasa de Conversión</span>
                    <span className="text-white">3.2%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Satisfacción del Cliente</span>
                    <span className="text-white">4.8/5</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Tiempo de Respuesta</span>
                    <span className="text-white">2.4h</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 