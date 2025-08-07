import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inicializar Firebase Admin
const serviceAccount = {
  projectId: "dropia-f4c71",
  clientEmail: "firebase-adminsdk-fbsvc@dropia-f4c71.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDXYdZul9U1Xe91\ntxtO4u1kjOjBb4mLr/zJvMByYQovBtAz+vRpAmau0wSe0w6tpielFSlhm0vrR738\n1FAY4xAKatesNb4VMoxGm0esmFVJJR1vIssaiBCvwiXJPrVfyPDmpTlTz4e3OpGm\nR61P1dd4AZ2TffDFvpBKG/GPsDULEKXEb38tSMQ+7Y9kuijVK4ro59aIL5ITEDlC\n4JllnOI+duLh+jsiEn9ISqoeO/qZhoJsdS+k39NmoA26pJHdiJiZK7MpdB5N2WCk\nDM4nMXn2Tn1PPWiD/1SXU6k/zSWyXMOv0Jpx1+N8p1UiY/i4avcUiDIdNoY5uprk\n1bw27lRrAgMBAAECggEAB35/qpDH5LfPBDE0gbXYUr5VvvKgPjxdDFvv9PWMGCoh\nhnLTRvAZczh5Ga74Uhx3lqvk07ZGmaTWZydas3L7H5GreBzVRKw3QKGt3cMzJydj\nyHZ/y1LerxmPR7BR4/JRnNo043Coz+b5eGgCuhtpCDjuKwVKd7xIuFC+l/mmmYA7\ncORj/gHM0h4ZyvldxXzmYjQIZm2s6g1wfb5KpNFNFwPdG75hI+XPQxLkjH5TRNj+\n22KKFSdJRMpvqJ+AORG68tywBvKSN6I1U5QsxTejR5a+A/7ruhvn8Yfx9zaB9BUn\nZqfRKD2UwmfPS/IhBQT9wxMKQ5zgSFQlGDG+XU1mOQKBgQDxSQYxI1120zVnDTwk\n8onYJcpqy9RkH0/Z1oKzPeOKWcuxcTIbtQ2kiupX5XHRs0tUdg1iO2GqIarkyeux\n6t0J0vBP7BL2NWDpyP/eeeOOx4blYLcPjL+lxDda6POcS/uagdiRj/sNLPNoT4q8\n29TFKOSUM8RyojhoMs8F9jxRhwKBgQDkhGlRXK5mULW8OQz+XP/KSeXIQ70JFc17\n6vzli08AhCBrrMnR24ezAuNNFtM+D3oxZmaW/5YQQ2G02jbHHGZ5yg1ovodO11jP\nay3T8OqfCscdLnKewOETXUhx6McRvBmYHjo3gL75kFcw2Ia5NO/+WKuDHqSlBqPB\nRTkOTNiu/QKBgQC3JPenOrHJ7N1fIEOjw9lvkJfJYngPm1jP/6vrg7GAJVKgmEwx\njccSO0NPfmBbjN1D+euEwZALREzkJoRZ4uzudQdlksp9ydyK97+Hzjs0+CxjVXr+\nOZaKq5pcze+DloUfLSoGqyQjRxhm9+FWIwKouLZv669UV9+6774GR3ZXZwKBgQDE\n1RDqVgyacLa5U+LPTke9dH2KTF6Nbsw6CqSfC6mW5jgOxxxnuNJf7QLgqeJ2uFom\nJvAC7E/T3lZQsw0v4FScXt/B8ysVTARhVQ56Wi+domjzx8hO2hCE33rBMyIVMpJR\nJug6Wpkk2aFgn4EcEm8OBE5neIOU6e0vUnLc0HBr+QKBgQDbz6THowfGo90hhcKf\nmrTYpGEQo+gmYFmH/kg8SCV3+CzkRHuq1ypTanigbAUnURrwiJxuUSaYL8du8ysE\nHZBqlIGBYuyC1he2wFhk3TXEPw33qJRb4VIU2VH79EkTAR4/1r2vift6HF5VwSZi\nJ65dG8v80tESfkWp9LvSbNqTTw==\n-----END PRIVATE KEY-----\n"
};

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

const products = [
  {
    id: 'smartphone-pro',
    name: 'Smartphone Pro X',
    description: 'El último smartphone con características premium',
    price: 999.99,
    categoryId: 'electronics',
    stock: 50,
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    features: [
      '6.7" OLED Display',
      '256GB Storage',
      '5G Compatible',
      'Triple Camera System'
    ],
    sellerId: 'NTO6CzlepZXp15JAlKyeA9f8fK53'
  },
  {
    id: 'laptop-pro',
    name: 'Laptop Pro Book',
    description: 'Laptop profesional para trabajo y gaming',
    price: 1499.99,
    categoryId: 'electronics',
    stock: 30,
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    features: [
      '15.6" 4K Display',
      '32GB RAM',
      '1TB SSD',
      'NVIDIA RTX 4070'
    ],
    sellerId: 'NTO6CzlepZXp15JAlKyeA9f8fK53'
  },
  {
    id: 'casual-shirt',
    name: 'Camisa Casual Premium',
    description: 'Camisa casual de algodón 100%',
    price: 49.99,
    categoryId: 'clothing',
    stock: 100,
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    features: [
      'Algodón 100%',
      'Slim Fit',
      'Disponible en varios colores',
      'Tallas S-XXL'
    ],
    sellerId: 'NTO6CzlepZXp15JAlKyeA9f8fK53'
  },
  {
    id: 'smart-watch',
    name: 'Smart Watch Pro',
    description: 'Reloj inteligente con múltiples funciones',
    price: 299.99,
    categoryId: 'electronics',
    stock: 75,
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    features: [
      'Monitor cardíaco',
      'GPS integrado',
      'Resistente al agua',
      'Batería de larga duración'
    ],
    sellerId: 'NTO6CzlepZXp15JAlKyeA9f8fK53'
  },
  {
    id: 'coffee-maker',
    name: 'Cafetera Automática',
    description: 'Cafetera premium con múltiples funciones',
    price: 199.99,
    categoryId: 'home',
    stock: 40,
    images: ['/placeholder.jpg', '/placeholder.jpg'],
    features: [
      'Programable',
      'Capacidad 12 tazas',
      'Filtro permanente',
      'Sistema antigoteo'
    ],
    sellerId: 'NTO6CzlepZXp15JAlKyeA9f8fK53'
  }
];

async function seedProducts() {
  try {
    const batch = db.batch();
    
    for (const product of products) {
      const docRef = db.collection('products').doc(product.id);
      batch.set(docRef, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await batch.commit();
    console.log('✅ Productos creados exitosamente');
  } catch (error) {
    console.error('❌ Error al crear los productos:', error);
  } finally {
    process.exit();
  }
}

seedProducts();