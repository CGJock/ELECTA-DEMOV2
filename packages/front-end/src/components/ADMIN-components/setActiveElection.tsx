import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/services/apiService';

interface ElectionRoundOption {
  election_round_id: number;
  label: string; // Ejemplo: "Generales Costa Rica 2025 R1"
}

// Cambié el nombre para evitar conflictos
export const ActiveElectionSelector: React.FC = () => {
  const [options, setOptions] = useState<ElectionRoundOption[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/get-all-election-rounds`)
      .then(res => res.json())
      .then(data => {
        const opts = data.map((item: any) => ({
          election_round_id: item.id || item.election_round_id,
          label: `${item.election_type} ${item.country} ${item.year} R${item.round_number}`,
        }));
        setOptions(opts);
      })
      .catch(() => setOptions([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(Number(e.target.value));
  };

  const handleSetActive = async () => {
    if (!selectedId) {
      alert('Selecciona una elección primero.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/post-active-election`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ electionRoundId: selectedId }),
      });
      if (!res.ok) {
        const errData = await res.json();
        alert('Error al establecer elección activa: ' + JSON.stringify(errData.error));
      } else {
        alert('Elección activa actualizada correctamente.');
      }
    } catch (error) {
      alert('Error inesperado: ' + (error as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-slate-800 rounded-xl shadow-lg space-y-6">
      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Selecciona elección activa:
        </label>
        <select
          onChange={handleChange}
          value={selectedId ?? ''}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
        >
          <option value="" disabled>-- Selecciona una opción --</option>
          {options.map(opt => (
            <option key={opt.election_round_id} value={opt.election_round_id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <button 
          onClick={handleSetActive} 
          disabled={loading || !selectedId}
          className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
        >
          {loading ? 'Actualizando...' : 'Establecer como activa'}
        </button>
      </div>
      
      {options.length === 0 && (
        <div className="text-center py-8 bg-slate-700 rounded-lg">
          <p className="text-slate-300 font-medium">No hay elecciones disponibles para seleccionar</p>
          <p className="text-sm text-slate-400 mt-2">Primero crea una elección en la pestaña "Crear Elección"</p>
        </div>
      )}
    </div>
  );
};
