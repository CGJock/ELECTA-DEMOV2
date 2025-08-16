"use client";

import { useState, useEffect, useCallback } from 'react';

interface SiteStatus {
  id: number;
  maintenance_mode: boolean;
  private_access: boolean;
  updated_at: string;
  updated_by?: number;
}

export function useSiteStatus() {
  const [siteStatus, setSiteStatus] = useState<SiteStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el estado del sitio
  const fetchSiteStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site-status`);
      const data = await response.json();
      
      if (data.success) {
        setSiteStatus(data.data);
      } else {
        setError(data.message || 'Error al obtener el estado del sitio');
      }
    } catch (err) {
      console.error('Error fetching site status:', err);
      setError('Error de conexión al obtener el estado del sitio');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar el estado del sitio
  const updateSiteStatus = useCallback(async (updates: Partial<SiteStatus>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSiteStatus(data.data);
        return { success: true, message: data.message };
      } else {
        setError(data.message || 'Error al actualizar el estado del sitio');
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Error updating site status:', err);
      setError('Error de conexión al actualizar el estado del sitio');
      return { success: false, message: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estado inicial
  useEffect(() => {
    fetchSiteStatus();
  }, [fetchSiteStatus]);

  // Función para refrescar el estado
  const refreshStatus = useCallback(() => {
    fetchSiteStatus();
  }, [fetchSiteStatus]);

  return {
    siteStatus,
    loading,
    error,
    updateSiteStatus,
    refreshStatus,
    isMaintenanceMode: siteStatus?.maintenance_mode || false,
    isPrivateAccess: siteStatus?.private_access || false,
  };
}
