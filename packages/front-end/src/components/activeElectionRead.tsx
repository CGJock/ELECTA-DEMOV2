import React, { useEffect, useState } from 'react';

interface ActiveElectionInfo {
  election_round_id: number;
  election_type: string;
  country: string;
  year: number;
  round_number: number;
  round_date: string;
}

export const ActiveElectionDisplay: React.FC = () => {
  const [activeElection, setActiveElection] = useState<ActiveElectionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/get_full-active_election')
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

  if (loading) return <p>Cargando elección activa...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Elección Activa</h3>
      <p><b>ID Ronda:</b> {activeElection?.election_round_id}</p>
      <p><b>Tipo:</b> {activeElection?.election_type}</p>
      <p><b>País:</b> {activeElection?.country}</p>
      <p><b>Año:</b> {activeElection?.year}</p>
      <p><b>Ronda:</b> {activeElection?.round_number}</p>
      <p><b>Fecha ronda:</b> {activeElection?.round_date}</p>
    </div>
  );
};
