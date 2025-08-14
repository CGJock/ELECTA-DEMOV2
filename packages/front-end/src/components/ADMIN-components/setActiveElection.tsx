import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/services/apiService';

interface ElectionRoundOption {
  election_round_id: number;
  label: string; // Ejemplo: "Generales Costa Rica 2025 R1"
}


//setea una eleccion activa

export const ActiveElectionSelector: React.FC = () => {
  const [options, setOptions] = useState<ElectionRoundOption[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar opciones disponibles
    fetch(`${API_BASE_URL}/api/get-all-election-rounds`) // Cambia la ruta si es necesario
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
    <div>
      <label>
        Selecciona elección activa:
        <select
          onChange={handleChange}
          value={selectedId ?? ''}
          style={{ color: 'black', marginLeft: 10, marginRight: 10 }}
        >
          <option value="" disabled>-- Selecciona una opción --</option>
          {options.map(opt => (
            <option key={opt.election_round_id} value={opt.election_round_id}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleSetActive} disabled={loading || !selectedId}>
        {loading ? 'Actualizando...' : 'Establecer'}
      </button>
    </div>
  );
};
