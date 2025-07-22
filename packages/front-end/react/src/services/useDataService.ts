// Hooks personalizados para usar los servicios de datos
import { useState, useEffect, useCallback } from 'react';
import { dataService, type Department, type VoteSummary, type GlobalSummary, type LocationSummary } from './dataService';

// Hook para obtener departamentos
export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getDepartments();
      setDepartments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching departments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, error, refetch: fetchDepartments };
}

// Hook para obtener breakdown de votos
export function useVoteBreakdown() {
  const [voteBreakdown, setVoteBreakdown] = useState<VoteSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const cleanup = dataService.getVoteBreakdown((data) => {
      setVoteBreakdown(data);
      setLoading(false);
    });

    // Cleanup function
    return cleanup;
  }, []);

  return { voteBreakdown, loading, error };
}

// Hook para obtener resumen global
export function useGlobalSummary() {
  const [globalSummary, setGlobalSummary] = useState<GlobalSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const cleanup = dataService.getGlobalSummary((data) => {
      setGlobalSummary(data);
      setLoading(false);
    });

    // Cleanup function
    return cleanup;
  }, []);

  return { globalSummary, loading, error };
}

// Hook para obtener resumen por ubicación
export function useLocationSummary(locationId: string) {
  const [locationSummary, setLocationSummary] = useState<LocationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) {
      setLocationSummary(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const cleanup = dataService.getLocationSummary(locationId, (data) => {
      setLocationSummary(data);
      setLoading(false);
    });

    // Cleanup function
    return cleanup;
  }, [locationId]);

  return { locationSummary, loading, error };
}

// Hook para obtener propuestas de candidato
export function useCandidateProposals(candidateId: string, language: string = 'es') {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!candidateId) {
      setProposals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const cleanup = dataService.getCandidateProposals(candidateId, language, (data) => {
      if (data.candidateId === candidateId) {
        setProposals(data.proposals || []);
        setLoading(false);
      }
    });

    // Cleanup function
    return cleanup;
  }, [candidateId, language]);

  return { proposals, loading, error };
}

// Hook para obtener partidos y candidatos
export function usePartiesCandidates() {
  const [partiesCandidates, setPartiesCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const cleanup = dataService.getPartiesCandidates((data) => {
      setPartiesCandidates(data);
      setLoading(false);
    });

    // Cleanup function
    return cleanup;
  }, []);

  return { partiesCandidates, loading, error };
}

// Hook para obtener datos completos de departamento
export function useDepartmentCompleteData(departmentCode: string) {
  const [departmentData, setDepartmentData] = useState<{
    department: Department | null;
    summary: LocationSummary | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!departmentCode) {
      setDepartmentData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getDepartmentCompleteData(departmentCode);
      setDepartmentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching department data');
    } finally {
      setLoading(false);
    }
  }, [departmentCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { departmentData, loading, error, refetch: fetchData };
}

// Hook para verificar estado del WebSocket
export function useSocketStatus() {
  const [isConnected, setIsConnected] = useState(dataService.isSocketConnected());
  const [socketId, setSocketId] = useState<string | undefined>(dataService.getSocketId());

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(dataService.isSocketConnected());
      setSocketId(dataService.getSocketId());
    };

    // Verificar cada segundo
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected, socketId };
} 