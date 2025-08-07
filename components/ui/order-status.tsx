'use client';

import { Badge } from '@/components/ui/badge';

interface OrderStatusProps {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
}

export function OrderStatus({ status }: OrderStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pendiente',
          variant: 'secondary' as const,
        };
      case 'processing':
        return {
          label: 'Procesando',
          variant: 'default' as const,
        };
      case 'completed':
        return {
          label: 'Completada',
          variant: 'default' as const,
        };
      case 'failed':
        return {
          label: 'Fallida',
          variant: 'destructive' as const,
        };
      case 'refunded':
        return {
          label: 'Reembolsada',
          variant: 'outline' as const,
        };
      default:
        return {
          label: 'Desconocido',
          variant: 'secondary' as const,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}