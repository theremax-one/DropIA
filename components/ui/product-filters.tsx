'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types';
import { Search, Filter, X } from 'lucide-react';

interface ProductFiltersProps {
  categories: Category[];
  onFiltersChange?: (filters: any) => void;
}

export function ProductFilters({ categories, onFiltersChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
  });

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
    });
  };

  return (
    <div className="space-y-4 p-4 border border-white/20 rounded-lg bg-white/10">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-white" />
        <h3 className="font-semibold text-white">Filtros</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="ml-auto text-white hover:bg-white/10"
        >
          <X className="h-4 w-4 mr-1" />
          Limpiar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Categoría</label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="" className="text-white hover:bg-slate-700">Todas las categorías</SelectItem>
              {categories && categories.map((category) => (
                <SelectItem key={category.id} value={category.id} className="text-white hover:bg-slate-700">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Precio mínimo</label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Precio máximo</label>
          <Input
            type="number"
            placeholder="1000"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-white">Ordenar por:</label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleFilterChange('sortBy', value)}
        >
          <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="name" className="text-white hover:bg-slate-700">Nombre</SelectItem>
            <SelectItem value="price_asc" className="text-white hover:bg-slate-700">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price_desc" className="text-white hover:bg-slate-700">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="rating" className="text-white hover:bg-slate-700">Mejor Valorados</SelectItem>
            <SelectItem value="newest" className="text-white hover:bg-slate-700">Más Recientes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}