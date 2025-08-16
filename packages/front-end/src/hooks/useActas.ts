import { useState, useEffect } from 'react';

// Usar el mismo patrón que useSiteStatus y useAdminManagement
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Acta {
  id: string;
  imageUrl: string;
  recinto: string;
  municipio: string;
  provincia: string;
  departamento: string;
  totalVotos: number;
  votosValidos: number;
  votosNulos: number;
  votosBlancos: number;
  porcentajeValidos: number;
  porcentajeNulos: number;
  porcentajeBlancos: number;
}

interface BackendActa {
  verification_code: string;
  department_code: string;
  image_url: string;
  raw_data: {
    nullVotes?: number;
    blankVotes?: number;
    validVotes?: number;
    Departamento?: string;
    [key: string]: any; // Para otros campos del JSON
  };
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

  // Mapear datos del backend a la interfaz del frontend usando datos REALES
  const mapBackendToFrontend = (backendActas: BackendActa[]): Acta[] => {
    return backendActas.map((acta) => {
      // Usar datos REALES del backend en lugar de generar datos falsos
      const votosValidos = Number(acta.raw_data?.validVotes) || 0;
      const votosNulos = Number(acta.raw_data?.nullVotes) || 0;
      const votosBlancos = Number(acta.raw_data?.blankVotes) || 0;
      const totalVotos = votosValidos + votosNulos + votosBlancos;
      
      // Calcular porcentajes basados en datos reales
      const porcentajeValidos = totalVotos > 0 ? Math.round((votosValidos / totalVotos) * 100) : 0;
      const porcentajeNulos = totalVotos > 0 ? Math.round((votosNulos / totalVotos) * 100) : 0;
      const porcentajeBlancos = totalVotos > 0 ? Math.round((votosBlancos / totalVotos) * 100) : 0;

      // Mapear códigos de departamento a nombres
      const departmentNames: { [key: string]: string } = {
        'CH': 'Chuquisaca',
        'LP': 'La Paz', 
        'CB': 'Cochabamba',
        'OR': 'Oruro',
        'PT': 'Potosí',
        'TJ': 'Tarija',
        'SC': 'Santa Cruz',
        'BN': 'Beni',
        'PD': 'Pando'
      };

      return {
        id: acta.verification_code,
        imageUrl: acta.image_url,
        recinto: `Recinto ${acta.verification_code}`,
        municipio: `Municipio ${acta.verification_code}`,
        provincia: `Provincia ${acta.verification_code}`,
        departamento: departmentNames[acta.department_code] || acta.department_code,
        totalVotos,
        votosValidos,
        votosNulos,
        votosBlancos,
        porcentajeValidos,
        porcentajeNulos,
        porcentajeBlancos,
      };
    });
  };

  useEffect(() => {
    const fetchActas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/get-ballots?page=${page}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data: BackendResponse = await response.json();
        
        // Mapear datos del backend al formato del frontend
        const mappedActas = mapBackendToFrontend(data.items);
        
        setActas(mappedActas);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
        
      } catch (err) {
        console.error('Error fetching actas:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        // En caso de error, usar datos de respaldo vacíos
        setActas([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchActas();
  }, [page]);

  return {
    actas,
    loading,
    error,
    totalPages,
    totalItems
  };
};
