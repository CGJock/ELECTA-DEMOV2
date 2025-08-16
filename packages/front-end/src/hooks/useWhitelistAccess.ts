"use client";

import { useState, useEffect } from 'react';

interface WhitelistUser {
  id: number;
  name: string;
  email: string;
  status: 'approved' | 'denied' | 'pending';
  created_at: string;
  updated_at: string;
  created_by?: number;
  notes?: string;
}

interface UseWhitelistAccessReturn {
  isVerified: boolean;
  isLoading: boolean;
  user: WhitelistUser | null;
  error: string | null;
  verifyAccess: (name: string, email: string, password: string) => Promise<boolean>;
  clearVerification: () => void;
}

export function useWhitelistAccess(): UseWhitelistAccessReturn {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<WhitelistUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verificar si ya hay una sesión activa al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('whitelistUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsVerified(true);
      } catch (error) {
        console.error('Error al cargar sesión de usuario:', error);
        localStorage.removeItem('whitelistUser');
      }
    }
  }, []);

  // Función para verificar acceso
  const verifyAccess = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/whitelist/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.success && data.allowed) {
        // Usuario verificado y aprobado
        setUser(data.user);
        setIsVerified(true);
        
        // Guardar en localStorage para persistir la sesión
        localStorage.setItem('whitelistUser', JSON.stringify(data.user));
        
        return true;
      } else {
        // Usuario no aprobado o error
        setError(data.message || 'Acceso denegado');
        setIsVerified(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar acceso:', error);
      setError('Error de conexión. Por favor intenta nuevamente.');
      setIsVerified(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para limpiar verificación
  const clearVerification = () => {
    setIsVerified(false);
    setUser(null);
    setError(null);
    localStorage.removeItem('whitelistUser');
  };

  return {
    isVerified,
    isLoading,
    user,
    error,
    verifyAccess,
    clearVerification
  };
}
