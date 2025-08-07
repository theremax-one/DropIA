'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserAccess, Product } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Download, Link2, Key } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function MyProductsPage() {
  const [accesses, setAccesses] = useState<(UserAccess & { product: Product })[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadAccesses();
  }, [user, router]);

  const loadAccesses = async () => {
    try {
      const response = await fetch('/api/user/accesses');
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setAccesses(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (access: UserAccess) => {
    try {
      const response = await fetch(`/api/user/accesses/${access.id}/download`);
      if (!response.ok) throw new Error('Error al obtener enlace de descarga');
      const { url } = await response.json();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="h-32 bg-muted animate-pulse rounded" />
          <div className="h-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (accesses.length === 0) {
    return (
      <div className="container py-10">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">No tienes productos</h2>
          <p className="text-muted-foreground mb-6">
            Explora nuestro catálogo y encuentra productos increíbles
          </p>
          <Button onClick={() => router.push('/products')}>
            Ver productos
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Mis Productos Digitales</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accesses.map((access) => (
          <Card key={access.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">{access.product.name}</h3>
              <Badge variant={access.type === 'download' ? 'default' : access.type === 'api_access' ? 'success' : 'warning'}>
                {access.type === 'download'
                  ? 'Descarga'
                  : access.type === 'api_access'
                  ? 'API'
                  : 'Suscripción'}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {access.product.description}
            </p>

            {access.validUntil && (
              <p className="text-sm mb-4">
                <span className="font-medium">Válido hasta:</span>{' '}
                {format(new Date(access.validUntil), "d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </p>
            )}

            {access.usageStats && (
              <div className="space-y-1 mb-4 text-sm">
                {access.usageStats.downloads !== undefined && (
                  <p>
                    <span className="font-medium">Descargas:</span>{' '}
                    {access.usageStats.downloads}
                  </p>
                )}
                {access.usageStats.apiCalls !== undefined && (
                  <p>
                    <span className="font-medium">Llamadas API:</span>{' '}
                    {access.usageStats.apiCalls}
                  </p>
                )}
                {access.usageStats.lastUsed && (
                  <p>
                    <span className="font-medium">Último uso:</span>{' '}
                    {format(new Date(access.usageStats.lastUsed), "d 'de' MMMM", {
                      locale: es,
                    })}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              {access.type === 'download' && (
                <Button
                  className="w-full"
                  onClick={() => handleDownload(access)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              )}

              {access.type === 'api_access' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Key className="h-4 w-4 mr-2" />
                      Ver API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Información de API</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">API Key</label>
                        <div className="mt-1 p-2 bg-muted rounded-md font-mono text-sm break-all">
                          {access.key}
                        </div>
                      </div>
                      {access.product.deliveryInfo.apiEndpoint && (
                        <div>
                          <label className="text-sm font-medium">Endpoint</label>
                          <div className="mt-1 p-2 bg-muted rounded-md font-mono text-sm break-all">
                            {access.product.deliveryInfo.apiEndpoint}
                          </div>
                        </div>
                      )}
                      {access.product.deliveryInfo.apiDocs && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            window.open(access.product.deliveryInfo.apiDocs, '_blank')
                          }
                        >
                          <Link2 className="h-4 w-4 mr-2" />
                          Ver documentación
                        </Button>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {access.type === 'subscription' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    window.open(access.product.deliveryInfo.apiEndpoint, '_blank')
                  }
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Acceder al servicio
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}