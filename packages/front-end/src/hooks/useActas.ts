'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Acta {
  id: string;
  imageUrl: string;
  departamento: string;
}

interface BackendActa {
  verification_code: string;
  department_code: string;
  image_url: string;
}

interface BackendResponse {
  page: number;
  totalPages: number;
  totalItems: number;
  items: BackendActa[];
}

export const useActas = (page: number = 1) => {
  const [actas, setActas] = useState<Acta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const mapBackendToFrontend = (backendActas: BackendActa[]): Acta[] => {
    const departmentNames: { [key: string]: string } = {
      'CH': 'Chuquisaca', 'LP': 'La Paz', 'CB': 'Cochabamba',
      'OR': 'Oruro', 'PT': 'Potosí', 'TJ': 'Tarija',
      'SC': 'Santa Cruz', 'BN': 'Beni', 'PD': 'Pando'
    };

    return backendActas.map((acta) => ({
      id: acta.verification_code,
      imageUrl: acta.image_url,
      departamento: departmentNames[acta.department_code] || acta.department_code,
    }));
  };

  useEffect(() => {
    const fetchActas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construir URL correctamente para evitar doble /api/
        const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
        const url = `${baseUrl}/get-ballots?page=${page}`;
        
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data: BackendResponse = await response.json();
        const mappedActas = mapBackendToFrontend(data.items);
        
        setActas(mappedActas);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
        
      } catch (err) {
        console.error('Error fetching actas:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setActas([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchActas();
  }, [page]);

  return { actas, loading, error, totalPages, totalItems };
};
