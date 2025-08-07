'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  Package, 
  Tag, 
  ShoppingCart, 
  MessageSquare, 
  Database,
  RefreshCw,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface DatabaseStats {
  users: number;
  products: number;
  categories: number;
  orders: number;
  reviews: number;
}

export default function AdminDatabasePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar que el usuario es administrador
    if (!user || !user.isAdmin) {
      router.push('/');
      return;
    }

    loadStats();
  }, [user, router]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas de la base de datos
      const [usersRes, productsRes, categoriesRes, ordersRes, reviewsRes] = await Promise.all([
        fetch('/api/admin/stats?type=users'),
        fetch('/api/admin/stats?type=products'),
        fetch('/api/admin/stats?type=categories'),
        fetch('/api/admin/stats?type=orders'),
        fetch('/api/admin/stats?type=reviews'),
      ]);

      const stats = {
        users: await usersRes.json().then(data => data.count || 0),
        products: await productsRes.json().then(data => data.count || 0),
        categories: await categoriesRes.json().then(data => data.count || 0),
        orders: await ordersRes.json().then(data => data.count || 0),
        reviews: await reviewsRes.json().then(data => data.count || 0),
      };

      setStats(stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las estadísticas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/seed?type=${type}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al ejecutar seed');
      }

      toast({
        title: 'Éxito',
        description: `Datos de ${type} creados correctamente`,
      });

      loadStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al ejecutar seed',
        variant: 'destructive',
      });
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground mt-2">
            Gestión de base de datos y estadísticas del sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          <Badge variant="outline" className="text-green-600 border-green-600">
            Administrador
          </Badge>
        </div>
      </div>

      {/* Advertencia de Seguridad */}
      <Card className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                Acceso Restringido
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Esta página es solo para administradores. Las operaciones aquí pueden afectar 
                directamente la base de datos del sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de la Base de Datos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.users || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.products || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Productos disponibles en el marketplace
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.categories || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Categorías de productos disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.orders || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Órdenes procesadas en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reseñas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.reviews || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Reseñas de productos en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base de Datos</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SQLite</div>
            <p className="text-xs text-muted-foreground">
              Motor de base de datos actual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones de Administración */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones de Administración</CardTitle>
          <CardDescription>
            Herramientas para gestionar la base de datos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Datos de Prueba</h4>
              <p className="text-sm text-muted-foreground">
                Crear datos de prueba para desarrollo
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSeedData('users')}
              >
                Crear Usuarios
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSeedData('categories')}
              >
                Crear Categorías
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSeedData('products')}
              >
                Crear Productos
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Prisma Studio</h4>
              <p className="text-sm text-muted-foreground">
                Interfaz visual para gestionar la base de datos
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open('http://localhost:5556', '_blank')}
            >
              Abrir Studio
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Actualizar Estadísticas</h4>
              <p className="text-sm text-muted-foreground">
                Recargar datos de la base de datos
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={loadStats}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 