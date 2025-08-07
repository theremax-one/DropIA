'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, ArrowRight, Zap, Palette, Music, Video, BookOpen, Code, Target, Headphones, FileText, Star, TrendingUp, DollarSign, Package, Users, ShoppingCart, Plus, Activity, BarChart3, ArrowUpRight, ArrowDownRight, Bell, Settings, User, LogOut } from 'lucide-react';
import { Category } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    salesGrowth: 0,
    revenueGrowth: 0,
    customerGrowth: 0,
    productGrowth: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) throw new Error('Error al cargar categorías');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Si el usuario está autenticado, cargar datos del dashboard
        if (user) {
          loadDashboardData();
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Simular carga de datos del dashboard
      setTimeout(() => {
        setDashboardStats({
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
          },
          {
            id: '2',
            customerName: 'Carlos López',
            productName: 'Ambient Space Music',
            amount: 8.50,
            status: 'pending',
          },
          {
            id: '3',
            customerName: 'Ana Martínez',
            productName: 'Motion Graphics Pack',
            amount: 24.99,
            status: 'completed',
          },
        ]);

        setTopProducts([
          {
            id: '1',
            name: 'Paisaje Cyberpunk',
            sales: 156,
            revenue: 2494.44,
            rating: 4.9,
          },
          {
            id: '2',
            name: 'Ambient Space Music',
            sales: 89,
            revenue: 756.50,
            rating: 4.8,
          },
          {
            id: '3',
            name: 'Motion Graphics Pack',
            sales: 67,
            revenue: 1674.33,
            rating: 5.0,
          },
        ]);
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'images':
        return <Palette className="w-8 h-8" />;
      case 'music':
        return <Music className="w-8 h-8" />;
      case 'videos':
        return <Video className="w-8 h-8" />;
      case 'ebooks':
        return <BookOpen className="w-8 h-8" />;
      case 'code':
        return <Code className="w-8 h-8" />;
      case '3d-models':
        return <Target className="w-8 h-8" />;
      case 'audio':
        return <Headphones className="w-8 h-8" />;
      case 'templates':
        return <FileText className="w-8 h-8" />;
      default:
        return <Palette className="w-8 h-8" />;
    }
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'images':
        return 'bg-gradient-to-br from-pink-500 to-red-500';
      case 'music':
        return 'bg-gradient-to-br from-purple-500 to-indigo-500';
      case 'videos':
        return 'bg-gradient-to-br from-blue-500 to-cyan-500';
      case 'ebooks':
        return 'bg-gradient-to-br from-green-500 to-emerald-500';
      case 'code':
        return 'bg-gradient-to-br from-orange-500 to-red-500';
      case '3d-models':
        return 'bg-gradient-to-br from-purple-500 to-pink-500';
      case 'audio':
        return 'bg-gradient-to-br from-teal-500 to-cyan-500';
      case 'templates':
        return 'bg-gradient-to-br from-orange-500 to-yellow-500';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const formatProductCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
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

  const handleStartSelling = () => {
    if (user) {
      router.push('/seller/products');
    } else {
      router.push('/login');
    }
  };

  // Filtrar solo las categorías que tienen colores vibrantes (no las grises)
  const colorfulCategories = categories.filter(category => 
    ['images', 'music', 'videos', 'ebooks', 'code', '3d-models', 'audio', 'templates'].includes(category.id)
  );



  // Si el usuario está autenticado, mostrar el dashboard
  if (!authLoading && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header del Dashboard */}
        <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Bienvenido de vuelta, {user.displayName || 'Usuario'}!
                </h1>
                <p className="text-slate-400">
                  Gestiona tus productos y rastrea tus ventas.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  className="border-slate-700 text-slate-300"
                  onClick={() => router.push('/dashboard')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Dashboard Completo
                </Button>
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
                  {formatCurrency(dashboardStats.totalRevenue)}
                </div>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                  {dashboardStats.revenueGrowth > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                  )}
                  {Math.abs(dashboardStats.revenueGrowth)}% desde el mes pasado
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
                  {dashboardStats.totalSales.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                  {dashboardStats.salesGrowth > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                  )}
                  {Math.abs(dashboardStats.salesGrowth)}% desde el mes pasado
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
                  {dashboardStats.totalProducts}
                </div>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                  {dashboardStats.productGrowth > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                  )}
                  {Math.abs(dashboardStats.productGrowth)}% desde el mes pasado
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
                  {dashboardStats.totalCustomers.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                  {dashboardStats.customerGrowth > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                  )}
                  {Math.abs(dashboardStats.customerGrowth)}% desde el mes pasado
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Charts and Analytics */}
            <div className="lg:col-span-2 space-y-8">
              {/* Sales Chart */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Ventas Recientes</CardTitle>
                  <CardDescription className="text-slate-400">
                    Rendimiento de ventas en los últimos 30 días
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">Gráfico de ventas</p>
                      <p className="text-sm text-slate-500">Integración con librería de gráficos</p>
                    </div>
                  </div>
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
                    <BarChart3 className="h-4 w-4 mr-2" />
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

  // Si el usuario NO está autenticado o está cargando, mostrar la página de inicio normal
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Cargando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            #1 AI Marketplace
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="text-white">The future of</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              digital creativity
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Discover, buy and sell unique AI-generated content. From images to music, everything in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold"
              onClick={() => router.push('/products')}
            >
              Explore Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
              onClick={handleStartSelling}
            >
              Start Selling
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search images, music, videos, eBooks..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Popular Categories Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Popular Categories
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/10 rounded-xl h-32 mb-4"></div>
                <div className="bg-white/10 rounded h-4 w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {colorfulCategories.map((category) => (
              <div
                key={category.id}
                className="group cursor-pointer"
                onClick={() => router.push(`/products?categoryId=${category.id}`)}
              >
                <div className={`${getCategoryColor(category.id)} rounded-xl h-32 mb-4 flex items-center justify-center group-hover:scale-105 transition-all duration-300`}>
                  <div className="text-white">
                    {getCategoryIcon(category.id)}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {formatProductCount(category.productCount || 0)} productos
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1: Explore */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              1. Explore
            </h3>
            <p className="text-gray-300 text-lg">
              Discover thousands of unique AI-generated products across different categories.
            </p>
          </div>

          {/* Step 2: Purchase */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              2. Purchase
            </h3>
            <p className="text-gray-300 text-lg">
              Get the content you need with instant downloads and clear licenses.
            </p>
          </div>

          {/* Step 3: Sell */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              3. Sell
            </h3>
            <p className="text-gray-300 text-lg">
              Monetize your creativity by selling your own AI creations to our community.
            </p>
          </div>
        </div>
      </div>



      {/* Call to Action Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-blue-900/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are already monetizing their AI talent on DropIA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold"
              onClick={handleStartSelling}
            >
              Start Selling
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
              onClick={() => router.push('/products')}
            >
              Explore Marketplace
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Information */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="text-white font-bold text-xl">DropIA</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                The leading marketplace for AI-generated content.
              </p>
              <div className="flex gap-4">
                <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="w-6 h-6 border border-white rounded flex items-center justify-center">
                  <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>

            {/* Marketplace Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Marketplace</h3>
              <ul className="space-y-2">
                <li><a href="/products" className="text-gray-300 hover:text-white transition-colors">Explore</a></li>
                <li><a href="/products" className="text-gray-300 hover:text-white transition-colors">Categories</a></li>
                <li><a href="/products" className="text-gray-300 hover:text-white transition-colors">New Products</a></li>
                <li><a href="/products" className="text-gray-300 hover:text-white transition-colors">Best Sellers</a></li>
              </ul>
            </div>

            {/* Creators Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Creators</h3>
              <ul className="space-y-2">
                <li><button onClick={handleStartSelling} className="text-gray-300 hover:text-white transition-colors">Start Selling</button></li>
                <li><a href="/seller/products" className="text-gray-300 hover:text-white transition-colors">Guides</a></li>
                <li><a href="/seller/products" className="text-gray-300 hover:text-white transition-colors">Resources</a></li>
                <li><a href="/seller/products" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-700 mb-8"></div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              © 2024 DropIA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}