'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Package, 
  DollarSign, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  Palette,
  Music,
  Video,
  BookOpen,
  Code
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
  completed: boolean;
}

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingWizard({ isOpen, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Completa tu perfil',
      description: 'Añade tu información personal y foto de perfil para que los clientes te conozcan mejor.',
      icon: <User className="h-8 w-8" />,
      action: 'Completar Perfil',
      completed: false,
    },
    {
      id: 2,
      title: 'Explora las categorías',
      description: 'Descubre los diferentes tipos de contenido que puedes crear y vender en DropIA.',
      icon: <Package className="h-8 w-8" />,
      action: 'Explorar Categorías',
      completed: false,
    },
    {
      id: 3,
      title: 'Crea tu primer producto',
      description: 'Sube tu primer contenido y comienza a monetizar tu creatividad.',
      icon: <DollarSign className="h-8 w-8" />,
      action: 'Crear Producto',
      completed: false,
    },
    {
      id: 4,
      title: 'Configura tu método de pago',
      description: 'Añade tu información bancaria para recibir los pagos de tus ventas.',
      icon: <CheckCircle className="h-8 w-8" />,
      action: 'Configurar Pagos',
      completed: false,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAction = (step: OnboardingStep) => {
    switch (step.id) {
      case 1:
        router.push('/profile');
        break;
      case 2:
        router.push('/categories');
        break;
      case 3:
        router.push('/seller/products');
        break;
      case 4:
        router.push('/seller/balance');
        break;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/90 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            ¡Bienvenido a DropIA!
          </CardTitle>
          <CardDescription className="text-slate-300">
            Te guiaremos a través de los pasos para comenzar tu viaje como creador
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Paso {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Step */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                {steps[currentStep].icon}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {steps[currentStep].title}
              </h3>
              <p className="text-slate-300">
                {steps[currentStep].description}
              </p>
            </div>
          </div>

          {/* Action Button */}
          {steps[currentStep].action && (
            <div className="text-center">
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => handleAction(steps[currentStep])}
              >
                {steps[currentStep].action}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-slate-600 text-slate-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-slate-600 text-slate-300"
              >
                Saltar
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 