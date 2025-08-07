# Configuración de Firebase Storage

## 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Firebase Storage en tu proyecto

## 2. Configurar reglas de Storage

En Firebase Console > Storage > Rules, configura las siguientes reglas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de productos
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Permitir subida de archivos solo a usuarios autenticados
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 3. Obtener configuración

1. Ve a Project Settings > General
2. En la sección "Your apps", crea una nueva app web
3. Copia la configuración de Firebase

## 4. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 5. Actualizar configuración en el código

En `lib/firebase/storage.ts`, reemplaza la configuración hardcodeada:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
```

## 6. Habilitar Firebase Storage real

En `components/ui/upload-product-modal.tsx`, descomenta las líneas para usar Firebase Storage real:

```typescript
import { FirebaseStorageService } from '@/lib/firebase/storage';

const uploadToFirebase = async (file: File): Promise<string> => {
  return FirebaseStorageService.uploadProductFile(
    file, 
    `temp_${Date.now()}`, 
    setUploadProgress
  );
};
```

## 7. Instalar dependencias

```bash
pnpm add firebase
```

## 8. Configurar autenticación (opcional)

Si quieres usar autenticación de Firebase:

1. Ve a Authentication > Sign-in method
2. Habilita los métodos que necesites (Email/Password, Google, etc.)
3. Configura las reglas de autenticación

## Notas importantes

- **Seguridad**: Las reglas de Storage son cruciales para la seguridad
- **Límites**: Firebase Storage tiene límites de tamaño de archivo (5GB por defecto)
- **Costos**: Revisa los precios de Firebase Storage para tu caso de uso
- **Backup**: Considera implementar un sistema de backup para archivos importantes

## Estructura de archivos en Storage

```
products/
├── product_1_1234567890.zip
├── product_2_1234567891.pdf
└── product_3_1234567892.jpg
```

## Integración con la aplicación

La aplicación está configurada para usar Firebase Storage de forma modular. Puedes:

1. Usar la simulación para desarrollo
2. Cambiar a Firebase Storage real para producción
3. Implementar diferentes estrategias de almacenamiento
4. Agregar validaciones adicionales de archivos 