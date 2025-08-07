'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Términos y Condiciones
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Última actualización: Enero 2024
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-300 mb-6">
              Al acceder y usar DropIA, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro servicio.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              2. Descripción del Servicio
            </h2>
            <p className="text-gray-300 mb-6">
              DropIA es un marketplace que conecta creadores de contenido generado por IA con compradores. Proporcionamos una plataforma para la venta y compra de productos digitales.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              3. Cuentas de Usuario
            </h2>
            <p className="text-gray-300 mb-6">
              Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. No debes compartir tus credenciales de acceso con terceros.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              4. Contenido del Usuario
            </h2>
            <p className="text-gray-300 mb-6">
              Los usuarios son responsables del contenido que suben. No permitimos contenido ilegal, ofensivo o que viole derechos de autor.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              5. Pagos y Comisiones
            </h2>
            <p className="text-gray-300 mb-6">
              DropIA cobra una comisión del 10% sobre las ventas. Los pagos se procesan a través de Stripe y se distribuyen según nuestros términos de pago.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              6. Propiedad Intelectual
            </h2>
            <p className="text-gray-300 mb-6">
              Los usuarios mantienen los derechos sobre su contenido. DropIA solo tiene licencia para mostrar y distribuir el contenido según estos términos.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              7. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-300 mb-6">
              DropIA no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso de nuestro servicio.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              8. Modificaciones
            </h2>
            <p className="text-gray-300 mb-6">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              9. Contacto
            </h2>
            <p className="text-gray-300 mb-6">
              Si tienes preguntas sobre estos términos, contáctanos a través de nuestro centro de ayuda.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
} 