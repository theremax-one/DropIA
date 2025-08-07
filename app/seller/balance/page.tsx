'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { SellerBalance, PayoutRequest } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SellerBalancePage() {
  const [balance, setBalance] = useState<SellerBalance | null>(null);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    bankInfo: {
      accountHolder: '',
      accountNumber: '',
      bankName: '',
      swiftCode: '',
    },
  });
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      router.push('/');
      return;
    }

    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      const [balanceRes, payoutsRes] = await Promise.all([
        fetch('/api/seller/balance'),
        fetch('/api/seller/payouts'),
      ]);

      if (!balanceRes.ok || !payoutsRes.ok) {
        throw new Error('Error al cargar datos');
      }

      const [balanceData, payoutsData] = await Promise.all([
        balanceRes.json(),
        payoutsRes.json(),
      ]);

      setBalance(balanceData);
      setPayouts(payoutsData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/seller/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          bankInfo: formData.bankInfo,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast({
        title: 'Éxito',
        description: 'Solicitud de pago enviada correctamente',
      });

      setFormData({
        amount: '',
        bankInfo: {
          accountHolder: '',
          accountNumber: '',
          bankName: '',
          swiftCode: '',
        },
      });

      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
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

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Balance y Pagos</h1>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Resumen de balance</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Disponible</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(balance?.pendingAmount || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ganancias totales</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(balance?.totalEarnings || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Último pago</p>
                <p className="text-2xl font-bold">
                  {balance?.lastPayout
                    ? formatCurrency(balance.lastPayout.amount)
                    : 'N/A'}
                </p>
                {balance?.lastPayout && (
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(balance.lastPayout.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Historial de pagos</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Solicitar pago</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Solicitar pago</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="amount">Monto</label>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            amount: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="accountHolder">Titular de la cuenta</label>
                      <Input
                        id="accountHolder"
                        value={formData.bankInfo.accountHolder}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bankInfo: {
                              ...prev.bankInfo,
                              accountHolder: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="accountNumber">Número de cuenta</label>
                      <Input
                        id="accountNumber"
                        value={formData.bankInfo.accountNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bankInfo: {
                              ...prev.bankInfo,
                              accountNumber: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bankName">Nombre del banco</label>
                      <Input
                        id="bankName"
                        value={formData.bankInfo.bankName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bankInfo: {
                              ...prev.bankInfo,
                              bankName: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="swiftCode">Código SWIFT</label>
                      <Input
                        id="swiftCode"
                        value={formData.bankInfo.swiftCode}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bankInfo: {
                              ...prev.bankInfo,
                              swiftCode: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Enviar solicitud
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {payouts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay solicitudes de pago
              </p>
            ) : (
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {formatCurrency(payout.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(payout.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          payout.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : payout.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : payout.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {payout.status === 'completed'
                          ? 'Completado'
                          : payout.status === 'pending'
                          ? 'Pendiente'
                          : payout.status === 'rejected'
                          ? 'Rechazado'
                          : 'Aprobado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Información</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Comisión de la plataforma</p>
                <p className="text-muted-foreground">
                  Se aplica una comisión del 10% sobre cada venta.
                </p>
              </div>
              <div>
                <p className="font-medium">Pagos</p>
                <p className="text-muted-foreground">
                  Los pagos se procesan dentro de los 3-5 días hábiles después de
                  la aprobación.
                </p>
              </div>
              <div>
                <p className="font-medium">Monto mínimo</p>
                <p className="text-muted-foreground">
                  El monto mínimo para solicitar un pago es de $100.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}