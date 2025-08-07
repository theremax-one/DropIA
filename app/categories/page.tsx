'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Palette, Music, Video, BookOpen, Code, Target, Headphones, FileText } from 'lucide-react';

// Definir las categorías directamente
const defaultCategories = [
  {
    id: 'images',
    name: 'Imágenes',
    description: 'Imágenes generadas por IA',
    productCount: 0,
    image: null
  },
  {
    id: 'music',
    name: 'Música',
    description: 'Composiciones musicales con IA',
    productCount: 0,
    image: null
  },
  {
    id: 'videos',
    name: 'Videos',
    description: 'Contenido audiovisual generado',
    productCount: 0,
    image: null
  },
  {
    id: 'ebooks',
    name: 'eBooks',
    description: 'Libros electrónicos y documentos',
    productCount: 0,
    image: null
  },
  {
    id: 'code',
    name: 'Código',
    description: 'Scripts y aplicaciones',
    productCount: 0,
    image: null
  },
  {
    id: '3d-models',
    name: 'Modelos 3D',
    description: 'Modelos tridimensionales',
    productCount: 0,
    image: null
  },
  {
    id: 'audio',
    name: 'Audio',
    description: 'Archivos de audio y podcasts',
    productCount: 0,
    image: null
  },
  {
    id: 'templates',
    name: 'Plantillas',
    description: 'Plantillas y recursos reutilizables',
    productCount: 0,
    image: null
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Intentar cargar desde la API, pero usar las categorías por defecto si falla
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.log('Usando categorías por defecto');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'images':
        return <Palette className="w-8 h-8" />;
      case 'music':
        return <Music className="w-8 h-8" />;
      case 'videos':
        return <Video className="w-8 h-8" />;
      case 'ebooks':
        return <BookOpen className="w-8 h-8" />;
      case 'code':
        return <Code className="w-8 h-8" />;
      case '3d-models':
        return <Target className="w-8 h-8" />;
      case 'audio':
        return <Headphones className="w-8 h-8" />;
      case 'templates':
        return <FileText className="w-8 h-8" />;
      default:
        return <Palette className="w-8 h-8" />;
    }
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'images':
        return 'bg-gradient-to-br from-pink-500 to-red-500';
      case 'music':
        return 'bg-gradient-to-br from-purple-500 to-indigo-500';
      case 'videos':
        return 'bg-gradient-to-br from-blue-500 to-cyan-500';
      case 'ebooks':
        return 'bg-gradient-to-br from-green-500 to-emerald-500';
      case 'code':
        return 'bg-gradient-to-br from-orange-500 to-red-500';
      case '3d-models':
        return 'bg-gradient-to-br from-purple-500 to-pink-500';
      case 'audio':
        return 'bg-gradient-to-br from-teal-500 to-cyan-500';
      case 'templates':
        return 'bg-gradient-to-br from-orange-500 to-yellow-500';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const formatProductCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Categorías
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explora todas las categorías de contenido generado por IA
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/10 rounded-xl h-48 mb-4"></div>
                <div className="bg-white/10 rounded h-6 w-3/4 mb-2"></div>
                <div className="bg-white/10 rounded h-4 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group cursor-pointer"
                onClick={() => router.push(`/products?categoryId=${category.id}`)}
              >
                <div className={`${getCategoryColor(category.id)} rounded-xl h-48 mb-4 flex items-center justify-center group-hover:scale-105 transition-all duration-300`}>
                  <div className="text-white">
                    {getCategoryIcon(category.id)}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold text-xl mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {category.description}
                  </p>
                  <p className="text-purple-400 font-medium">
                    {formatProductCount(category.productCount || 0)} productos
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => router.push('/')}
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
} 