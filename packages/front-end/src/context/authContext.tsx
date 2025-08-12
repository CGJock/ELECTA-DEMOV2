'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
  id: number;
  username: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, admin: Admin) => void;
  loginTemporary: (username: string, password: string) => boolean;
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

  // Función temporal para login sin backend
  const loginTemporary = (username: string, password: string): boolean => {
    // Primero verificar si existe un admin con ese username en la lista de administradores
    const savedAdmins = localStorage.getItem('adminUsers');
    
    if (savedAdmins) {
      try {
        const admins = JSON.parse(savedAdmins);
        const foundAdmin = admins.find((admin: any) => 
          admin.username === username && admin.isActive === true
        );
        
        if (foundAdmin) {
          // Para simplificar, aceptamos cualquier contraseña por ahora
          // En el futuro esto se conectará con el backend real
          const tempAdmin = { id: foundAdmin.id, username: foundAdmin.username };
          const tempToken = 'temp-jwt-token-' + Date.now();
          
          login(tempToken, tempAdmin);
          return true;
        }
      } catch (error) {
        console.error('Error al verificar administradores:', error);
      }
    }
    
    // Fallback a credenciales hardcodeadas por compatibilidad
    if (username === 'admin' && password === 'admin123') {
      const tempAdmin = { id: 1, username };
      const tempToken = 'temp-jwt-token-' + Date.now();
      
      login(tempToken, tempAdmin);
      return true;
    }
    
    return false;
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
    loginTemporary,
    logout,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
