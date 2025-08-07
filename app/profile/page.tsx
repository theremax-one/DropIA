'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  Camera,
  Shield,
  Bell,
  CreditCard,
  Download,
  Star,
  ShoppingCart,
  Package,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/use-toast';

interface UserProfile {
  displayName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  joinDate: string;
  totalPurchases: number;
  totalDownloads: number;
  averageRating: number;
  memberSince: string;
}

interface PurchaseHistory {
  id: string;
  productName: string;
  price: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
    joinDate: '',
    totalPurchases: 0,
    totalDownloads: 0,
    averageRating: 0,
    memberSince: '',
  });
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadProfileData();
  }, [user, router]);

  const loadProfileData = async () => {
    try {
      // Simular carga de datos del perfil
      setTimeout(() => {
        setProfile({
          displayName: user?.displayName || 'Usuario',
          email: user?.email || 'usuario@ejemplo.com',
          phone: '+34 123 456 789',
          location: 'Madrid, España',
          bio: 'Apasionado por la creatividad digital y el contenido generado por IA. Siempre buscando nuevas formas de expresión artística.',
          avatar: user?.photoURL || '/placeholder-user.jpg',
          joinDate: '2024-01-15',
          totalPurchases: 23,
          totalDownloads: 156,
          averageRating: 4.8,
          memberSince: 'Enero 2024',
        });

        setPurchaseHistory([
          {
            id: '1',
            productName: 'Paisaje Cyberpunk',
            price: 15.99,
            date: '2024-01-15',
            status: 'completed',
          },
          {
            id: '2',
            productName: 'Ambient Space Music',
            price: 8.50,
            date: '2024-01-14',
            status: 'completed',
          },
          {
            id: '3',
            productName: 'Motion Graphics Pack',
            price: 24.99,
            date: '2024-01-13',
            status: 'completed',
          },
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Aquí iría la lógica para guardar los cambios del perfil
      toast({
        title: 'Perfil actualizado',
        description: 'Los cambios se han guardado correctamente.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-8 bg-slate-800 animate-pulse rounded" />
            <div className="h-96 bg-slate-800 animate-pulse rounded-lg" />
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
              <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
              <p className="text-slate-400">Gestiona tu información personal y preferencias</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="border-slate-700 text-slate-300"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="profile" className="text-slate-300">Perfil</TabsTrigger>
            <TabsTrigger value="activity" className="text-slate-300">Actividad</TabsTrigger>
            <TabsTrigger value="purchases" className="text-slate-300">Compras</TabsTrigger>
            <TabsTrigger value="settings" className="text-slate-300">Configuración</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Información Personal</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="border-slate-600 text-slate-300"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? 'Cancelar' : 'Editar'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profile.avatar} alt={profile.displayName} />
                        <AvatarFallback className="bg-slate-600 text-white text-xl">
                          {profile.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white">{profile.displayName}</h3>
                        <p className="text-slate-400">Miembro desde {profile.memberSince}</p>
                        <Button variant="outline" size="sm" className="mt-2 border-slate-600 text-slate-300">
                          <Camera className="h-4 w-4 mr-2" />
                          Cambiar foto
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-slate-700" />

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Nombre completo</label>
                        <Input
                          value={profile.displayName}
                          onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                          disabled={!isEditing}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email</label>
                        <Input
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          disabled={!isEditing}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Teléfono</label>
                        <Input
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Ubicación</label>
                        <Input
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          disabled={!isEditing}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Biografía</label>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    {isEditing && (
                      <Button onClick={handleSaveProfile} className="bg-purple-600 hover:bg-purple-700">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar cambios
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                {/* User Stats */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-300">Compras</span>
                      </div>
                      <span className="text-white font-semibold">{profile.totalPurchases}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-green-400" />
                        <span className="text-slate-300">Descargas</span>
                      </div>
                      <span className="text-white font-semibold">{profile.totalDownloads}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-slate-300">Valoración</span>
                      </div>
                      <span className="text-white font-semibold">{profile.averageRating}/5</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-600 text-slate-300 justify-start"
                      onClick={() => router.push('/my-products')}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Mis Productos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-600 text-slate-300 justify-start"
                      onClick={() => router.push('/orders')}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Mis Órdenes
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-600 text-slate-300 justify-start"
                      onClick={() => router.push('/dashboard')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Actividad Reciente</CardTitle>
                <CardDescription className="text-slate-400">
                  Tu actividad en DropIA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Descargaste "Paisaje Cyberpunk"</p>
                      <p className="text-slate-400 text-sm">Hace 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Valoraste "Ambient Space Music"</p>
                      <p className="text-slate-400 text-sm">Hace 1 día</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Compraste "Motion Graphics Pack"</p>
                      <p className="text-slate-400 text-sm">Hace 3 días</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Historial de Compras</CardTitle>
                <CardDescription className="text-slate-400">
                  Todas tus compras en DropIA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{purchase.productName}</p>
                        <p className="text-slate-400 text-sm">{purchase.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">€{purchase.price}</p>
                        <Badge className="bg-green-100 text-green-800">
                          {purchase.status === 'completed' ? 'Completado' : purchase.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Notificaciones</CardTitle>
                  <CardDescription className="text-slate-400">
                    Configura tus preferencias de notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300">Notificaciones por email</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                      Activar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Notificaciones push</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                      Activar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Seguridad</CardTitle>
                  <CardDescription className="text-slate-400">
                    Configura la seguridad de tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Cambiar contraseña
                  </Button>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Métodos de pago
                  </Button>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración avanzada
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 