'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, MessageCircle, FileText, Shield, CreditCard } from 'lucide-react';

export default function HelpPage() {
  const router = useRouter();

  const helpSections = [
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "Preguntas Frecuentes",
      description: "Encuentra respuestas a las preguntas más comunes sobre DropIA",
      link: "/help/faq"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Contacto",
      description: "Ponte en contacto con nuestro equipo de soporte",
      link: "/help/contact"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Guías de Uso",
      description: "Tutoriales y guías para usar DropIA efectivamente",
      link: "/help/guides"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Términos y Condiciones",
      description: "Lee nuestros términos de servicio y políticas",
      link: "/help/terms"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Política de Reembolso",
      description: "Información sobre reembolsos y garantías",
      link: "/help/refunds"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Centro de Ayuda
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Encuentra toda la información que necesitas para usar DropIA
          </p>
        </div>

        {/* Help Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {helpSections.map((section, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer"
              onClick={() => router.push(section.link)}
            >
              <div className="text-purple-400 mb-4">
                {section.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {section.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {section.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Contact */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-gray-300 mb-6">
            Nuestro equipo de soporte está aquí para ayudarte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => router.push('/help/contact')}
            >
              Contactar Soporte
            </Button>
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => router.push('/help/faq')}
            >
              Ver FAQ
            </Button>
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