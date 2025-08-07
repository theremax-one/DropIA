'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle } from 'lucide-react';

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function CheckoutForm({ amount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Error al procesar el pago');
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message || 'Error al confirmar el pago');
      onError(confirmError.message || 'Error al confirmar el pago');
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Información de Pago</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <PaymentElement />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <span className="font-medium">Total a pagar:</span>
          <span className="text-xl font-bold">
            ${(amount / 100).toFixed(2)} DOP
          </span>
        </div>

        <Button
          type="submit"
          disabled={!stripe || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Procesando pago...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Pago
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Tu pago está protegido por Stripe. Nunca compartimos tu información de pago.
        </p>
      </form>
    </Card>
  );
}