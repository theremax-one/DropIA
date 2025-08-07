'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Política de Privacidad
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Última actualización: Enero 2024
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Información que Recopilamos
            </h2>
            <p className="text-gray-300 mb-6">
              Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, realizas una compra o nos contactas. Esto incluye tu nombre, dirección de correo electrónico, información de pago y contenido que subes.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              2. Información Recopilada Automáticamente
            </h2>
            <p className="text-gray-300 mb-6">
              Recopilamos automáticamente información sobre tu uso de DropIA, incluyendo tu dirección IP, tipo de navegador, páginas visitadas y tiempo de permanencia en el sitio.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              3. Uso de la Información
            </h2>
            <p className="text-gray-300 mb-6">
              Utilizamos tu información para proporcionar y mejorar nuestros servicios, procesar transacciones, comunicarnos contigo y personalizar tu experiencia.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              4. Compartir Información
            </h2>
            <p className="text-gray-300 mb-6">
              No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto cuando es necesario para proporcionar nuestros servicios o cuando la ley lo requiere.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              5. Seguridad de Datos
            </h2>
            <p className="text-gray-300 mb-6">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              6. Cookies y Tecnologías Similares
            </h2>
            <p className="text-gray-300 mb-6">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              7. Tus Derechos
            </h2>
            <p className="text-gray-300 mb-6">
              Tienes derecho a acceder, corregir, eliminar y portar tu información personal. También puedes oponerte al procesamiento de tus datos o solicitar la limitación del mismo.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              8. Retención de Datos
            </h2>
            <p className="text-gray-300 mb-6">
              Conservamos tu información personal durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley requiera un período de retención más largo.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              9. Cambios a esta Política
            </h2>
            <p className="text-gray-300 mb-6">
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cualquier cambio significativo a través de la plataforma o por correo electrónico.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
              10. Contacto
            </h2>
            <p className="text-gray-300 mb-6">
              Si tienes preguntas sobre esta política de privacidad, contáctanos a través de nuestro centro de ayuda.
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