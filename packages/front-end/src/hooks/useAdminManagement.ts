import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';

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

interface UseAdminManagementReturn {
  admins: AdminUser[];
  isLoading: boolean;
  error: string | null;
  addAdmin: (adminData: AdminCreateData) => Promise<boolean>;
  updateAdmin: (id: number, updates: Partial<AdminUser>) => Promise<boolean>;
  deleteAdmin: (id: number) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (id: number, newPassword: string) => Promise<boolean>;
  refreshAdmins: () => Promise<void>;
}

export function useAdminManagement(): UseAdminManagementReturn {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Cargar administradores desde la API
  const loadAdmins = async (): Promise<void> => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin-management`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar administradores');
      }

      const data = await response.json();
      if (data.success) {
        setAdmins(data.admins);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar administradores al inicializar
  useEffect(() => {
    if (token) {
      loadAdmins();
    }
  }, [token]);

  // Agregar nuevo administrador
  const addAdmin = async (adminData: AdminCreateData): Promise<boolean> => {
    if (!token) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin-management`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear administrador');
      }

      const data = await response.json();
      if (data.success) {
        // Recargar la lista de administradores
        await loadAdmins();
        return true;
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar administrador existente
  const updateAdmin = async (id: number, updates: Partial<AdminUser>): Promise<boolean> => {
    if (!token) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin-management/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar administrador');
      }

      const data = await response.json();
      if (data.success) {
        // Recargar la lista de administradores
        await loadAdmins();
        return true;
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar administrador
  const deleteAdmin = async (id: number): Promise<boolean> => {
    if (!token) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin-management/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar administrador');
      }

      const data = await response.json();
      if (data.success) {
        // Recargar la lista de administradores
        await loadAdmins();
        return true;
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cambiar contraseña
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!token) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin-management/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar contraseña');
      }

      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Resetear contraseña de otro admin
  const resetPassword = async (id: number, newPassword: string): Promise<boolean> => {
    if (!token) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin-management/reset-password/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al resetear contraseña');
      }

      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Recargar administradores
  const refreshAdmins = async (): Promise<void> => {
    await loadAdmins();
  };

  return {
    admins,
    isLoading,
    error,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    changePassword,
    resetPassword,
    refreshAdmins
  };
}
