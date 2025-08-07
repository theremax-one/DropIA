import { PrismaClient } from '../lib/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de categorías...');

  // Crear categorías
  const categories = [
    {
      id: '3d-models',
      name: '3D Models',
      description: 'Modelos 3D y assets para diseño y desarrollo',
      image: '/categories/3d-models.jpg',
      productCount: 0,
    },
    {
      id: 'audio',
      name: 'Audio',
      description: 'Efectos de sonido y audio profesional',
      image: '/categories/audio.jpg',
      productCount: 0,
    },
    {
      id: 'code',
      name: 'Code',
      description: 'Scripts, librerías y código reutilizable',
      image: '/categories/code.jpg',
      productCount: 0,
    },
    {
      id: 'ebooks',
      name: 'eBooks',
      description: 'Libros digitales y guías especializadas',
      image: '/categories/ebooks.jpg',
      productCount: 0,
    },
    {
      id: 'images',
      name: 'Images',
      description: 'Imágenes, ilustraciones y gráficos',
      image: '/categories/images.jpg',
      productCount: 0,
    },
    {
      id: 'music',
      name: 'Music',
      description: 'Música y composiciones originales',
      image: '/categories/music.jpg',
      productCount: 0,
    },
    {
      id: 'templates',
      name: 'Templates',
      description: 'Plantillas y recursos de diseño',
      image: '/categories/templates.jpg',
      productCount: 0,
    },
    {
      id: 'videos',
      name: 'Videos',
      description: 'Videos, animaciones y contenido multimedia',
      image: '/categories/videos.jpg',
      productCount: 0,
    },
  ];

  for (const categoryData of categories) {
    try {
      const existingCategory = await prisma.category.findUnique({
        where: { id: categoryData.id },
      });

      if (existingCategory) {
        console.log(`✅ Categoría ${categoryData.name} ya existe`);
        continue;
      }

      const category = await prisma.category.create({
        data: categoryData,
      });

      console.log(`✅ Categoría creada: ${category.name}`);
    } catch (error) {
      console.error(`❌ Error creando categoría ${categoryData.name}:`, error);
    }
  }

  console.log('🎉 Seed de categorías completado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });