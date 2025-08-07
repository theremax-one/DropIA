import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Configurar Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: "dropia-f4c71",
  private_key_id: "614ff4f190f70134048aaf7c0d5fce870b1f999f",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCQdt/v6O0rKqDY\n/PNOF5IejsOqXNC+JZ4hxY8WiAv5KEbKBg+vQN1UEZZ9CNnT8Bq+2eqAwuSrPP4K\nsLqQchMol+MyuZYF2i0mIweDouKx3gHecQCUM2FsUfrFtElP3oH5uOwmyPVq/32z\nghZOgIe+jUk4swhltN3EJwrNV9shtX+WUwA1dJ1Ip7U4UTxnN/eY/eFPEI5jawJO\ntYxNgUU8AG+tBD5kcePXJgWCjL0bseYzuAFQWrVDlYp3f+DgRNsf8uV9ZSxUivCu\nE/GVpk0pCwCGPQPyT33yPZepO02O/zOkIEmvQ5zIKSxDXfjgjNm18oripHNXa2Z6\nR5cLLtkVAgMBAAECggEAE0Cka3ahVOVjdkePrVKa2JOyI9wmvZCJ2HpZrWkIH3Zs\nqLPSF0sPtAp8AcHSNdqD1fd4txxCGUgRmx8eXe21++zyDGqLQdBnv/NfJv3oNEgf\n+6MXrqiCTUtHnl1+f7RpofwxDKIvgsj12Zx2mJOsg4qUvYeukM9f1qpVWDRjMcSp\nL8pwTNnuzufm24SB3hmVjne8M1mSlzanuKu3Ah32Fb1Bsi5JV4W8poigjtDwPe7T\n0Ft/PCkCXRy8zT/uKp8LYe2xj1uYwTXpbyTmL6YEI4R08+ziRGRQFBXx3KOp8kMv\nH6qNkjoJEtYWZeS93fWOLSFXhuaI3DDNc6WdxG6+wQKBgQDBvICTHgEmeKa0suSI\nGmP/deGk4+wFt5QHK+Lutl/Mb2KNenykF/tO73dPEVaNJMeqAjX9doqZFEjvR8ic\n9lZHyYWZ20sSmbHuGCyTSWWOOJxnVCdaPbZYvOoABaYnoXcanmYkaFOPf2T4sp5z\nSWXLgWdwNGcTCEJj5SWjMFrMmQKBgQC+5I+JTzF3X8gWZ23WDFxGOC0ZcsUokU5s\nlp3dnCTOsENjeWdQ+ARDw9PJvrlZ6XWV934ocNCQT3M9gnfLmzn2cCFWRYE2X0Lr\nkzKKbH0h2OhIZ29ZH0W2k/DgE/lQqkJ5Mf7uU2+D95mqKEBR+6WOgfAW+vk02XVJ\ngFls9yCh3QKBgQCufGjMl3xvusBiBLChCCvB+9iDGqgLKiDPKK6VUnoLdNItHAFA\nBT1ZBYHOG455RoPxUVZw9p+zaTqbD2rWO2LP+ucx//ioQvamuu0Cplsp8UCkK33Z\n37ToTRTveicAkILl3X2fErsXhaRZ/P2KVbOxytVvkDK5SHoK4Gm6hSVyGQKBgDBf\nPJwfzDoitFIxDV0jLrLAg3UiZyF7iLLti71fVthlQ/5OAkc7QeFmGyHRSaimBxzk\nZTycMc2PxHT+vZqDkDGJgnkZDcAYbZ3CZBk3movcKihGxamAyiqU3IH7rb6qFkQd\nzirYS7bWJENBBeOAcBhnhs5b9JBW1mi0tHRvPv6lAoGAcHJ5SvsAk87IQT0NIl27\nb4cXTF4AnZ9xIUJrakFqihlxXCM/1b3eNCVZcej7wHq5fvJMnGpiK8I9CuC3d62L\nALCk89l1eBiGTeIMQZwmlsNMeBduce7acAp5z78EtywaqmcX7njEUO58/Ix4G+MZ\n3Pf2ysYxqdCL0pxoP6pJnhQ=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@dropia-f4c71.iam.gserviceaccount.com",
  client_id: "116736664554359669503",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40dropia-f4c71.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

const db = getFirestore();

const digitalProducts = [
  // Images Category
  {
    id: "ai-portrait-collection",
    name: "Colección de Retratos IA",
    description: "50 retratos profesionales generados con IA, perfectos para redes sociales y marketing",
    price: 29.99,
    categoryId: "images",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["50 imágenes en alta resolución", "Formato PNG y JPG", "Licencia comercial", "Descarga inmediata"],
    sellerId: "digital-creator-1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "landscape-wallpapers",
    name: "Paisajes Digitales Premium",
    description: "100 paisajes únicos generados con IA, ideales para fondos de pantalla y diseño",
    price: 19.99,
    categoryId: "images",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["100 imágenes 4K", "Múltiples formatos", "Sin marca de agua", "Uso ilimitado"],
    sellerId: "digital-creator-1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "business-logos-pack",
    name: "Pack de Logos Empresariales",
    description: "30 logos profesionales para diferentes tipos de negocios",
    price: 39.99,
    categoryId: "images",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["30 logos únicos", "Formato vectorial SVG", "Archivos editables", "Licencia comercial"],
    sellerId: "digital-creator-2",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Music Category
  {
    id: "ambient-music-pack",
    name: "Pack de Música Ambiental",
    description: "10 pistas de música ambiental perfectas para videos y podcasts",
    price: 24.99,
    categoryId: "music",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["10 pistas únicas", "Formato MP3 y WAV", "Sin derechos de autor", "Duración 2-5 min cada una"],
    sellerId: "music-producer-1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "corporate-jingles",
    name: "Jingles Corporativos",
    description: "15 jingles profesionales para empresas y marcas",
    price: 34.99,
    categoryId: "music",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["15 jingles únicos", "Diferentes estilos", "Formato MP3", "Licencia comercial"],
    sellerId: "music-producer-2",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Videos Category
  {
    id: "social-media-videos",
    name: "Videos para Redes Sociales",
    description: "20 videos cortos generados con IA para Instagram, TikTok y YouTube",
    price: 44.99,
    categoryId: "videos",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["20 videos únicos", "Formato MP4", "Duración 15-60 segundos", "Sin marca de agua"],
    sellerId: "video-creator-1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "product-showcase-templates",
    name: "Templates de Presentación de Productos",
    description: "10 templates de video para mostrar productos de manera profesional",
    price: 29.99,
    categoryId: "videos",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["10 templates editables", "Formato After Effects", "Incluye música", "Tutorial incluido"],
    sellerId: "video-creator-2",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Code Category
  {
    id: "react-components-pack",
    name: "Pack de Componentes React",
    description: "50 componentes React reutilizables para desarrollo web",
    price: 49.99,
    categoryId: "code",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["50 componentes", "TypeScript incluido", "Documentación completa", "Ejemplos de uso"],
    sellerId: "developer-1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "python-automation-scripts",
    name: "Scripts de Automatización Python",
    description: "25 scripts útiles para automatizar tareas comunes",
    price: 39.99,
    categoryId: "code",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["25 scripts únicos", "Documentación detallada", "Comentarios explicativos", "Ejemplos prácticos"],
    sellerId: "developer-2",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Templates Category
  {
    id: "website-templates",
    name: "Templates de Sitios Web",
    description: "15 templates modernos para diferentes tipos de negocios",
    price: 59.99,
    categoryId: "templates",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["15 templates únicos", "Responsive design", "HTML/CSS/JS", "Documentación incluida"],
    sellerId: "designer-1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "presentation-templates",
    name: "Templates de Presentaciones",
    description: "20 templates profesionales para PowerPoint y Google Slides",
    price: 24.99,
    categoryId: "templates",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["20 templates únicos", "Formato PPTX", "Fácil personalización", "Gráficos incluidos"],
    sellerId: "designer-2",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 3D Models Category
  {
    id: "3d-furniture-models",
    name: "Modelos 3D de Muebles",
    description: "30 modelos 3D de muebles modernos para visualización",
    price: 69.99,
    categoryId: "3d-models",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["30 modelos únicos", "Formato FBX y OBJ", "Texturas incluidas", "Listos para render"],
    sellerId: "3d-artist-1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3d-character-models",
    name: "Modelos 3D de Personajes",
    description: "15 personajes 3D estilizados para juegos y animaciones",
    price: 79.99,
    categoryId: "3d-models",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["15 personajes únicos", "Rigging incluido", "Múltiples poses", "Formato FBX"],
    sellerId: "3d-artist-2",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // eBooks Category
  {
    id: "digital-marketing-guide",
    name: "Guía Completa de Marketing Digital",
    description: "eBook de 200 páginas con estrategias modernas de marketing digital",
    price: 19.99,
    categoryId: "ebooks",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["200 páginas", "Formato PDF", "Casos de estudio", "Plantillas descargables"],
    sellerId: "author-1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "ai-business-strategies",
    name: "Estrategias de IA para Negocios",
    description: "Guía práctica para implementar IA en tu empresa",
    price: 24.99,
    categoryId: "ebooks",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["150 páginas", "Formato PDF y EPUB", "Ejemplos prácticos", "Recursos adicionales"],
    sellerId: "author-2",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Audio Category
  {
    id: "voice-over-pack",
    name: "Pack de Voice Over",
    description: "50 grabaciones de voice over profesionales en español",
    price: 39.99,
    categoryId: "audio",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["50 grabaciones únicas", "Formato MP3", "Diferentes tonos", "Sin derechos de autor"],
    sellerId: "voice-actor-1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "sound-effects-library",
    name: "Biblioteca de Efectos de Sonido",
    description: "200 efectos de sonido para videos y podcasts",
    price: 29.99,
    categoryId: "audio",
    stock: 999,
    images: ["/placeholder.jpg"],
    features: ["200 efectos únicos", "Formato WAV", "Categorizados", "Licencia comercial"],
    sellerId: "sound-designer-1",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedDigitalProducts() {
  try {
    console.log('🌱 Iniciando seed de productos digitales...');
    
    const batch = db.batch();
    
    for (const product of digitalProducts) {
      const productRef = db.collection('products').doc(product.id);
      batch.set(productRef, product);
    }
    
    await batch.commit();
    
    console.log(`✅ ${digitalProducts.length} productos digitales agregados exitosamente!`);
    
    // Mostrar resumen por categoría
    const categoryCount = digitalProducts.reduce((acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📊 Resumen por categoría:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} productos`);
    });
    
  } catch (error) {
    console.error('❌ Error al agregar productos digitales:', error);
  }
}

seedDigitalProducts(); 