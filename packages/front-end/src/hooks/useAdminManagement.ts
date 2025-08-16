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
  const {  logout } = useAuth();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Función genérica para manejar fetch con cookie HttpOnly
  const fetchWithCredentials = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // <-- envía cookie HttpOnly
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        logout(); // sesión inválida
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error en la solicitud');
    }

    return response.json();
  };

  // Cargar administradores
  const loadAdmins = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {

      const data = await fetchWithCredentials(`${API_BASE_URL}/admin-management`);
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

  useEffect(() => {
    loadAdmins();
  }, []);

  // Agregar nuevo administrador
  const addAdmin = async (adminData: AdminCreateData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWithCredentials(`${API_BASE_URL}/admin-management`, {
        method: 'POST',
        body: JSON.stringify(adminData)
      });

      if (data.success) {
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

  const updateAdmin = async (id: number, updates: Partial<AdminUser>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWithCredentials(`${API_BASE_URL}/admin-management/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      if (data.success) {
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

  const deleteAdmin = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWithCredentials(`${API_BASE_URL}/admin-management/${id}`, {
        method: 'DELETE'
      });

      if (data.success) {
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

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWithCredentials(`${API_BASE_URL}/admin-management/change-password`, {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      return data.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (id: number, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWithCredentials(`${API_BASE_URL}/admin-management/reset-password/${id}`, {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      });

      return data.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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