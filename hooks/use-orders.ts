'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { useAuth } from '@/contexts/auth-context';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId: string): Promise<Order | null> => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error al obtener orden:', error);
      return null;
    }
  };

  const createOrder = async (orderData: any): Promise<Order | null> => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const newOrder = await response.json();
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
      }
      return null;
    } catch (error) {
      console.error('Error al crear orden:', error);
      return null;
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    getOrder,
    createOrder,
  };
}