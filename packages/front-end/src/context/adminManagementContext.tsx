'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminManagement as useBackendAdminManagement } from '@/hooks/useAdminManagement';

export interface AdminUser {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  created_at: string;
}

interface AdminCreateData {
  username: string;
  password: string;
  email?: string;
  full_name?: string;
}

interface AdminManagementContextType {
  admins: AdminUser[];
  isLoading: boolean;
  error: string | null;
  addAdmin: (adminData: AdminCreateData) => Promise<boolean>;
  updateAdmin: (id: number, updates: Partial<AdminUser>) => Promise<boolean>;
  deleteAdmin: (id: number) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (id: number, newPassword: string) => Promise<boolean>;
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
  const {
    admins,
    isLoading,
    error,
    addAdmin: backendAddAdmin,
    updateAdmin: backendUpdateAdmin,
    deleteAdmin: backendDeleteAdmin,
    changePassword: backendChangePassword,
    resetPassword: backendResetPassword,
    refreshAdmins
  } = useBackendAdminManagement();

  // Adaptar la función addAdmin para que coincida con la interfaz esperada
  const addAdmin = async (adminData: AdminCreateData): Promise<boolean> => {
    try {
      const success = await backendAddAdmin({
        username: adminData.username,
        password: adminData.password,
        email: adminData.email || '',
        full_name: adminData.full_name || ''
      });
      
      if (success) {
        await refreshAdmins(); // Recargar la lista
      }
      
      return success;
    } catch (error) {
      console.error('Error adding admin:', error);
      return false;
    }
  };

  // Adaptar la función updateAdmin
  const updateAdmin = async (id: number, updates: Partial<AdminUser>): Promise<boolean> => {
    try {
      const success = await backendUpdateAdmin(id, {
        username: updates.username || '',
        email: updates.email || '',
        full_name: updates.full_name || ''
      });
      
      if (success) {
        await refreshAdmins(); // Recargar la lista
      }
      
      return success;
    } catch (error) {
      console.error('Error updating admin:', error);
      return false;
    }
  };

  // Adaptar la función deleteAdmin
  const deleteAdmin = async (id: number): Promise<boolean> => {
    try {
      const success = await backendDeleteAdmin(id);
      
      if (success) {
        await refreshAdmins(); // Recargar la lista
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting admin:', error);
      return false;
    }
  };

  // Función para cambiar contraseña del propio admin
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const success = await backendChangePassword(currentPassword, newPassword);
      return success;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  };

  // Función para resetear contraseña de otro admin
  const resetPassword = async (id: number, newPassword: string): Promise<boolean> => {
    try {
      const success = await backendResetPassword(id, newPassword);
      return success;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  };

  const value: AdminManagementContextType = {
    admins,
    isLoading,
    error,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    changePassword,
    resetPassword
  };

  return (
    <AdminManagementContext.Provider value={value}>
      {children}
    </AdminManagementContext.Provider>
  );
};
