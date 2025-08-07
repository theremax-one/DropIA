'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ¿Tienes preguntas? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-slate-800/50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Envíanos un mensaje
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Nombre completo
                  </label>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Correo electrónico
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Asunto
                  </label>
                  <Input
                    type="text"
                    placeholder="¿En qué podemos ayudarte?"
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Mensaje
                  </label>
                  <Textarea
                    placeholder="Describe tu consulta..."
                    rows={5}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Enviar mensaje
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-slate-800/50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Información de contacto
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-purple-400 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">Email</h3>
                      <p className="text-gray-300">soporte@dropia.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MessageCircle className="w-6 h-6 text-purple-400 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">Chat en vivo</h3>
                      <p className="text-gray-300">Disponible 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-purple-400 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">Horario de atención</h3>
                      <p className="text-gray-300">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Preguntas frecuentes
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">
                      ¿Cómo puedo vender mis productos?
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Regístrate como vendedor y sigue nuestros pasos para subir tus productos.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-2">
                      ¿Cuáles son las comisiones?
                    </h3>
                    <p className="text-gray-300 text-sm">
                      DropIA cobra una comisión del 10% sobre cada venta realizada.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-2">
                      ¿Cómo funciona el sistema de pagos?
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Utilizamos Stripe para procesar pagos de forma segura y confiable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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