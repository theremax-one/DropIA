'use client';

import { useEffect, useState } from 'react';

interface User {
  uid: string;
  email: string | null;
  name?: string;
  isAdmin: boolean;
  isSeller: boolean;
}

export function useAuthPersist() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('dropia-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('dropia-user');
      }
    }
    setLoading(false);
  }, []);

  const saveUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('dropia-user', JSON.stringify(userData));
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('dropia-user');
  };

  return {
    user,
    loading,
    saveUser,
    clearUser,
  };
} 