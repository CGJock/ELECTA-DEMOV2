'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: number;
  username: string;
  email?: string;
  role?: string;
  createdAt: string;
  isActive: boolean;
}

interface AdminManagementContextType {
  admins: AdminUser[];
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => boolean;
  updateAdmin: (id: number, updates: Partial<AdminUser>) => boolean;
  deleteAdmin: (id: number) => boolean;
  toggleAdminStatus: (id: number) => boolean;
  getAdminById: (id: number) => AdminUser | undefined;
}

const AdminManagementContext = createContext<AdminManagementContextType | undefined>(undefined);

export const useAdminManagement = () => {
  const context = useContext(AdminManagementContext);
  if (context === undefined) {
    throw new Error('useAdminManagement must be used within an AdminManagementProvider');
  }
  return context;
};

interface AdminManagementProviderProps {
  children: ReactNode;
}

export const AdminManagementProvider: React.FC<AdminManagementProviderProps> = ({ children }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  // Cargar administradores desde localStorage al inicializar
  useEffect(() => {
    const savedAdmins = localStorage.getItem('adminUsers');
    if (savedAdmins) {
      try {
        const parsedAdmins = JSON.parse(savedAdmins);
        setAdmins(parsedAdmins);
      } catch (error) {
        console.error('Error parsing saved admins:', error);
        // Si hay error, crear admin por defecto
        const defaultAdmin: AdminUser = {
          id: 1,
          username: 'admin',
          email: 'admin@electa.com',
          role: 'Super Admin',
          createdAt: new Date().toISOString(),
          isActive: true
        };
        setAdmins([defaultAdmin]);
        localStorage.setItem('adminUsers', JSON.stringify([defaultAdmin]));
      }
    } else {
      // Crear admin por defecto si no hay ninguno
      const defaultAdmin: AdminUser = {
        id: 1,
        username: 'admin',
        email: 'admin@electa.com',
        role: 'Super Admin',
        createdAt: new Date().toISOString(),
        isActive: true
      };
      setAdmins([defaultAdmin]);
      localStorage.setItem('adminUsers', JSON.stringify([defaultAdmin]));
    }
  }, []);

  // Función para generar ID único
  const generateId = (): number => {
    const maxId = admins.reduce((max, admin) => Math.max(max, admin.id), 0);
    return maxId + 1;
  };

  // Agregar nuevo administrador
  const addAdmin = (adminData: Omit<AdminUser, 'id' | 'createdAt'>): boolean => {
    // Verificar que el username no exista
    if (admins.some(admin => admin.username === adminData.username)) {
      return false;
    }

    const newAdmin: AdminUser = {
      ...adminData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };

    const updatedAdmins = [...admins, newAdmin];
    setAdmins(updatedAdmins);
    localStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
    return true;
  };

  // Actualizar administrador existente
  const updateAdmin = (id: number, updates: Partial<AdminUser>): boolean => {
    const adminIndex = admins.findIndex(admin => admin.id === id);
    if (adminIndex === -1) return false;

    // Verificar que el username no exista en otros admins
    if (updates.username && admins.some(admin => admin.id !== id && admin.username === updates.username)) {
      return false;
    }

    const updatedAdmins = [...admins];
    updatedAdmins[adminIndex] = { ...updatedAdmins[adminIndex], ...updates };
    
    setAdmins(updatedAdmins);
    localStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
    return true;
  };

  // Eliminar administrador
  const deleteAdmin = (id: number): boolean => {
    // No permitir eliminar el admin principal
    if (id === 1) return false;

    const updatedAdmins = admins.filter(admin => admin.id !== id);
    setAdmins(updatedAdmins);
    localStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
    return true;
  };

  // Cambiar estado activo/inactivo
  const toggleAdminStatus = (id: number): boolean => {
    // No permitir desactivar el admin principal
    if (id === 1) return false;

    const adminIndex = admins.findIndex(admin => admin.id === id);
    if (adminIndex === -1) return false;

    const updatedAdmins = [...admins];
    updatedAdmins[adminIndex] = { 
      ...updatedAdmins[adminIndex], 
      isActive: !updatedAdmins[adminIndex].isActive 
    };
    
    setAdmins(updatedAdmins);
    localStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
    return true;
  };

  // Obtener administrador por ID
  const getAdminById = (id: number): AdminUser | undefined => {
    return admins.find(admin => admin.id === id);
  };

  const value: AdminManagementContextType = {
    admins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    toggleAdminStatus,
    getAdminById
  };

  return (
    <AdminManagementContext.Provider value={value}>
      {children}
    </AdminManagementContext.Provider>
  );
};
