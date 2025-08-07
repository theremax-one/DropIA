'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Category } from '@/types';
import { Upload, X, File, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'El nombre debe tener al menos 3 caracteres.',
  }),
  description: z.string().min(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
  }),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'El precio debe ser un número mayor a 0.',
  }),
  categoryId: z.string().min(1, {
    message: 'Debes seleccionar una categoría.',
  }),
  stock: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: 'El stock debe ser un número mayor o igual a 0.',
  }),
});

interface ProductFormProps {
  categories: Category[];
  editingProduct?: any;
  onSuccess?: () => void;
}

export function ProductForm({ categories, editingProduct, onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingProduct?.name || '',
      description: editingProduct?.description || '',
      price: editingProduct?.price?.toString() || '',
      categoryId: editingProduct?.categoryId || '',
      stock: editingProduct?.stock?.toString() || '1',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo (máximo 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: 'Archivo demasiado grande',
          description: 'El archivo no puede superar los 100MB.',
          variant: 'destructive',
        });
        return;
      }
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes estar autenticado para crear productos.',
        variant: 'destructive',
      });
      return;
    }

    if (!uploadedFile && !editingProduct) {
      toast({
        title: 'Archivo requerido',
        description: 'Debes subir un archivo para el producto.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      setFileUploadProgress(0);

      let fileUrl = editingProduct?.fileUrl || '';

      // Si hay un archivo nuevo, subirlo
      if (uploadedFile) {
        setFileUploadProgress(10);
        
        // Crear FormData para enviar el archivo
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('categoryId', values.categoryId);
        formData.append('stock', values.stock);
        formData.append('sellerId', user.uid);

        setFileUploadProgress(30);

        const response = await fetch('/api/products/upload', {
          method: 'POST',
          body: formData,
        });

        setFileUploadProgress(80);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al subir el producto');
        }

        const result = await response.json();
        fileUrl = result.fileUrl;
        setFileUploadProgress(100);
      } else {
        // Actualizar producto existente sin archivo
        const productData = {
          name: values.name,
          description: values.description,
          price: parseFloat(values.price),
          categoryId: values.categoryId,
          stock: parseInt(values.stock),
          updatedAt: new Date(),
        };

        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al actualizar el producto');
        }
      }

      toast({
        title: 'Éxito',
        description: editingProduct 
          ? 'Producto actualizado correctamente' 
          : 'Producto creado correctamente',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/seller/products');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setFileUploadProgress(0);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </CardTitle>
        <CardDescription>
          {editingProduct 
            ? 'Modifica la información de tu producto' 
            : 'Sube tu contenido y comienza a vender'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Archivo */}
            <div className="space-y-2">
              <FormLabel>Archivo del Producto</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <File className="h-8 w-8 text-blue-500" />
                      <span className="font-medium">{uploadedFile.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                      className="mt-2"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remover archivo
                    </Button>
                  </div>
                ) : editingProduct?.fileUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <File className="h-8 w-8 text-green-500" />
                      <span className="font-medium">Archivo actual subido</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Selecciona un nuevo archivo para reemplazarlo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Arrastra y suelta tu archivo aquí, o haz clic para seleccionar
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="*/*"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4"
                >
                  Seleccionar archivo
                </Button>
              </div>
            </div>

            {/* Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Paisaje Cyberpunk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu producto..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categoría */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Precio y Stock */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Progress Bar */}
            {fileUploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subiendo archivo...</span>
                  <span>{fileUploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${fileUploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 