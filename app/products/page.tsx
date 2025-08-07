'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, Product } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { ProductCard } from '@/components/ui/product-card';

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Actualizar categoría seleccionada desde URL
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar categorías y productos
      const [categoriesRes, productsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || productsData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const url = new URL(window.location.href);
    if (categoryId === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', categoryId);
    }
    router.push(url.pathname + url.search);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleCreateProduct = () => {
    if (user) {
      router.push('/seller/products');
    } else {
      router.push('/login');
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-white/10 animate-pulse rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-white/10 animate-pulse rounded w-1/2"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-white/10 animate-pulse rounded w-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Explorar Productos Digitales
          </h1>
          <p className="text-gray-300">
            Descubre productos digitales increíbles creados con IA
          </p>
        </div>

        {/* Categories Quick Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Categorías</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleCategoryClick('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Todos
            </button>
            {categories && categories.slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card className="p-12 text-center bg-white/10 border-white/20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                No hay productos disponibles
              </h2>
              <p className="text-gray-300 mb-6">
                {selectedCategory !== 'all' 
                  ? `No hay productos en la categoría "${getCategoryName(selectedCategory)}" aún.`
                  : 'Aún no hay productos disponibles en el marketplace.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleCreateProduct}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors"
                >
                  Crear Primer Producto
                </button>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-6 py-3 border border-white/20 text-white hover:bg-white/10 rounded-lg font-medium transition-colors"
                >
                  Ver Todas las Categorías
                </button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDownload={loadData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}