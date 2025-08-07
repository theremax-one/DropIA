'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { 
  Upload, 
  X, 
  File, 
  Loader2, 
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

interface UploadProductModalProps {
  categories: Category[];
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

// Configuración de formatos por categoría
const FILE_FORMATS = {
  '3d-models': ['.glb', '.fbx', '.obj', '.blend', '.stl'],
  'audio': ['.mp3', '.wav', '.ogg'],
  'code': ['.zip', '.js', '.py', '.html', '.css', '.ts', '.json'],
  'ebooks': ['.pdf', '.epub', '.docx'],
  'images': ['.jpg', '.jpeg', '.png', '.svg', '.webp'],
  'music': ['.mp3', '.wav', '.flac'],
  'templates': ['.fig', '.zip', '.pptx', '.docx', '.xlsx'],
  'videos': ['.mp4', '.mov', '.webm', '.avi'],
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function UploadProductModal({ categories, onSuccess, trigger }: UploadProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      categoryId: '',
      stock: '1',
    },
  });

  const selectedCategory = form.watch('categoryId');
  const allowedFormats = selectedCategory ? FILE_FORMATS[selectedCategory as keyof typeof FILE_FORMATS] || [] : [];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Archivo demasiado grande',
        description: 'El archivo no puede superar los 100MB.',
        variant: 'destructive',
      });
      return;
    }

    // Validar formato si hay categoría seleccionada
    if (selectedCategory && allowedFormats.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedFormats.includes(fileExtension)) {
        toast({
          title: 'Formato no válido',
          description: `Para la categoría seleccionada, solo se permiten: ${allowedFormats.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }
    }

    setUploadedFile(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadToFirebase = async (file: File): Promise<string> => {
    // Usar simulación para desarrollo
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;
        setUploadProgress(progress);
        
        if (progress === 100) {
          clearInterval(interval);
          // Simular URL de Firebase Storage
          resolve(`https://firebasestorage.googleapis.com/v0/b/dropia-f4c71.appspot.com/o/products%2F${file.name}?alt=media`);
        }
      }, 200);
    });
    
    // Para producción, usar Firebase Storage real:
    // import { FirebaseStorageService } from '@/lib/firebase/storage';
    // return FirebaseStorageService.uploadProductFile(
    //   file, 
    //   `temp_${Date.now()}`, 
    //   setUploadProgress
    // );
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

    if (!uploadedFile) {
      toast({
        title: 'Archivo requerido',
        description: 'Debes seleccionar un archivo para subir.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(0);

      // Subir archivo a Firebase Storage
      const fileUrl = await uploadToFirebase(uploadedFile);

      // Crear producto en la base de datos
      const productData = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        categoryId: values.categoryId,
        sellerId: user.uid,
        stock: parseInt(values.stock),
        images: JSON.stringify([fileUrl]),
        features: JSON.stringify([]),
        type: 'download',
        downloadUrl: fileUrl,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      toast({
        title: 'Producto creado exitosamente',
        description: 'Tu producto ha sido subido y está disponible en el marketplace.',
      });

      setIsOpen(false);
      form.reset();
      setUploadedFile(null);
      setUploadProgress(0);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al crear el producto.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subir Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa la información de tu producto y sube el archivo correspondiente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Zona de subida de archivos */}
            <div className="space-y-2">
              <FormLabel>Archivo del Producto</FormLabel>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-8 w-8 text-green-500" />
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
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Arrastra y suelta tu archivo aquí, o haz clic para seleccionar
                    </p>
                    {selectedCategory && allowedFormats.length > 0 && (
                      <p className="text-xs text-gray-400">
                        Formatos permitidos: {allowedFormats.join(', ')}
                      </p>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  className="hidden"
                  accept={allowedFormats.join(',')}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4"
                >
                  Buscar archivos
                </Button>
              </div>
            </div>

            {/* Selector de categoría */}
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

            {/* Nombre del producto */}
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
            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subiendo archivo...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
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
              {isLoading ? 'Creando Producto...' : 'Crear Producto'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 