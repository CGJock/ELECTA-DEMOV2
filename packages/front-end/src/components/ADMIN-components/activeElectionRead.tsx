import { API_BASE_URL } from '@/services/apiService';
import React, { useEffect, useState } from 'react';

interface ActiveElectionInfo {
  election_round_id: number;
  election_type: string;
  country: string;
  year: number;
  round_number: number;
  round_date: string;
}

//solamente lee los datos de la eleccion activa
export const ActiveElectionDisplay: React.FC = () => {
  const [activeElection, setActiveElection] = useState<ActiveElectionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_full-active_election`)
      .then(res => {
        if (!res.ok) throw new Error('No active election set or error fetching');
        return res.json();
      })
      .then(data => {
        setActiveElection(data);
        setError(null);
      })
      .catch(() => {
        setActiveElection(null);
        setError('No active election set');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-slate-400">Cargando elección activa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
          <p className="text-red-400 font-medium">{error}</p>
          <p className="text-sm text-red-500 mt-2">No hay elección activa configurada en el sistema</p>
        </div>
      </div>
    );
  }

  if (!activeElection) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No se pudo cargar la información de la elección activa</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/50">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-400 rounded-full"></span>
          Elección Activa
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-slate-400">ID Ronda:</span>
              <p className="text-white font-mono">{activeElection.election_round_id}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-slate-400">Tipo de Elección:</span>
              <p className="text-white">{activeElection.election_type}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-slate-400">País:</span>
              <p className="text-white">{activeElection.country}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-slate-400">Año:</span>
              <p className="text-white">{activeElection.year}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-slate-400">Ronda:</span>
              <p className="text-white">Ronda {activeElection.round_number}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-slate-400">Fecha de Ronda:</span>
              <p className="text-white">
                {new Date(activeElection.round_date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          <strong>Nota:</strong> Esta es la elección que está actualmente configurada como activa en el sistema.
          Los resultados y estadísticas se mostrarán para esta elección.
        </p>
      </div>
    </div>
  );
};
