'use client';

import { createContext, useContext, useState } from 'react';
import { useAuthPersist } from '@/hooks/use-auth-persist';

interface User {
  uid: string;
  email: string | null;
  name?: string;
  isAdmin: boolean;
  isSeller: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, saveUser, clearUser } = useAuthPersist();
  const [authLoading, setAuthLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      console.log('Intentando login:', email);
      setAuthLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      const userData = {
        uid: data.user.id,
        email: data.user.email,
        name: data.user.name,
        isAdmin: data.user.isAdmin,
        isSeller: data.user.isSeller,
      };
      
      saveUser(userData);
      
      console.log('Login exitoso');
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      console.log('Intentando registro:', email, name);
      setAuthLoading(true);
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }

      const userData = {
        uid: data.id,
        email: data.email,
        name: data.name,
        isAdmin: data.isAdmin,
        isSeller: data.isSeller,
      };
      
      saveUser(userData);
      
      console.log('Registro exitoso');
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Intentando logout');
      setAuthLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      clearUser();
      console.log('Logout exitoso');
    } catch (error: any) {
      console.error('Error en logout:', error);
      throw new Error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading: loading || authLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}