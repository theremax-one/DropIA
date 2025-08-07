import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Configuración de Firebase Admin usando variables de entorno
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID || "dropia-f4c71",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "test-key-id",
  private_key: process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB\n7VJUyugKtq5MdJ3FWCMoqtJ/ct5fblDwMp2bn7GuVDKxyutDqa5fBHHM1UyGcRc\n9yW/Te9DZPXQw3E8XahfqRfUKBu3MaiLtVPE8mQfk70LUtpk7pmOyB7HjGjvCH\n8ZEnk8wieimSkiV5OiCOJW3S6U7uCPTmu2vdgkR2VRmANjbaT+vMNLUwVWFWCg\nol28Vizh7YzQyontGv/ipuaemLXCNjKwTksw+p4qDxmmXc1OpxF9HbXjmYw2A3\nx1ZthITlp4jz1Daw0owR+LYxUmnCQVqycQwqcyXF6jmxJjb7a6z6e7qFh4U1e4\nZo5lHyAgAgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqasqsk\nlaSd8SfM6r0PdWf1JgU7Kn1MsnygM0R5LV2kS1CdFfRgxJ6mCz1umKj9NsH3t8\nMiKJqM4inzt80Vetf6jAq6F5c0Pq9Fk4XabZ0mi3QtyYFPQf5LwY7B3MvJz5D\nwJua51Mq/l8BkBmASNM1zDf4Qa/0YwMskzV0wC5FlwJvCrKpNqpkpBdJ1ny2I\nvgD5Vsq+c4Xw9lqg5i4yBrsBlwpR1xwBTwjjpeZAlXR9WnDTH7JwFurt4j6Rw\nWX4u3Qn39qsc8A+hnCmu2r9pKf3Sdud2fwpM1x5x\n-----END PRIVATE KEY-----\n",
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-test@dropia-f4c71.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID || "123456789",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-test%40dropia-f4c71.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Inicializar Firebase Admin
const apps = getApps();
const app = apps.length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dropia-f4c71.appspot.com",
    })
  : apps[0];

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;