'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  loginAdmin: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Opcional: al montar el provider, verificamos si hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          if (data.admin) {
            setAdmin(data.admin);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.log('No active session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const loginAdmin = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      if (!res.ok) return false;

      // Backend setea cookie HttpOnly, opcionalmente devuelve admin info
      const data = await res.json();
      if (data.admin) setAdmin(data.admin);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = async () => {
  setAdmin(null);
  setIsAuthenticated(false);

  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  }

  // Redirección sin router
  window.location.href = "/";
};

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};