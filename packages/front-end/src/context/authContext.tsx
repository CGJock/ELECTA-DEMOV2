'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginCredentials, LoginResponse } from '@/services/authService';

interface Admin {
  id: number;
  username: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, admin: Admin) => void;
  loginAdmin: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la página
    const savedToken = localStorage.getItem('adminToken');
    const savedAdmin = localStorage.getItem('adminData');
    
    if (savedToken && savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setToken(savedToken);
        setAdmin(adminData);
        setIsAuthenticated(true);
      } catch (error) {
        // Si hay error al parsear, limpiar datos corruptos
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
  }, []);

  const login = (newToken: string, adminData: Admin) => {
    setToken(newToken);
    setAdmin(adminData);
    setIsAuthenticated(true);
    
    // Guardar en localStorage
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminData', JSON.stringify(adminData));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
    
    // Limpiar localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  };

  // Función para login con backend
  const loginAdmin = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response: LoginResponse = await authService.loginAdmin(credentials);
      
      // Login exitoso, guardar datos
      const adminData = {
        id: response.admin.id,
        username: response.admin.username,
        email: response.admin.email,
        full_name: response.admin.full_name
      };
      
      login(response.token, adminData);
      return true;
    } catch (error) {
      console.error('Error en loginAdmin:', error);
      return false;
    }
  };

  const verifyToken = async (): Promise<boolean> => {
    if (!token) return false;

    // Verificación temporal: si hay token en localStorage, es válido
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken && savedToken === token) {
      return true;
    } else {
      // Token inválido, hacer logout
      logout();
      return false;
    }
  };

  const value: AuthContextType = {
    admin,
    token,
    isAuthenticated,
    login,
    loginAdmin,
    logout,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
