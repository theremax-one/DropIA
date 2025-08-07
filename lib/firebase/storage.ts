import { initializeApp } from 'firebase/app';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';

// Configuración de Firebase (deberías usar variables de entorno)
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "dropia-f4c71.firebaseapp.com",
  projectId: "dropia-f4c71",
  storageBucket: "dropia-f4c71.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export interface UploadProgress {
  progress: number;
  downloadURL?: string;
  error?: string;
}

export class FirebaseStorageService {
  /**
   * Subir archivo a Firebase Storage
   */
  static async uploadFile(
    file: File, 
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Subir archivo de producto
   */
  static async uploadProductFile(
    file: File,
    productId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${productId}_${Date.now()}.${fileExtension}`;
    const path = `products/${fileName}`;
    
    return this.uploadFile(file, path, onProgress);
  }

  /**
   * Eliminar archivo de Firebase Storage
   */
  static async deleteFile(url: string): Promise<void> {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Obtener URL de descarga
   */
  static async getDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }
}

// Función helper para simular subida (para desarrollo)
export const simulateFileUpload = (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress > 100) progress = 100;
      onProgress?.(progress);
      
      if (progress === 100) {
        clearInterval(interval);
        // Simular URL de Firebase Storage
        const fakeUrl = `https://firebasestorage.googleapis.com/v0/b/dropia-f4c71.appspot.com/o/products%2F${file.name}?alt=media`;
        resolve(fakeUrl);
      }
    }, 200);
  });
}; 