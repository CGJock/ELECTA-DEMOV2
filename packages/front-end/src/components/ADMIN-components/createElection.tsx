import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/services/apiService';

interface ElectionType {
  typeId: number;
  nameType: string;
}

interface Country {
  name: string;
  code?: string;
}

interface FormValues {
  election_type: number;
  country: string;
  year: number;
  round_number: '1' | '2';
  round_date: string; // formato YYYY-MM-DD
}

export const ElectionForm: React.FC = () => {
  const [electionTypes, setElectionTypes] = useState<ElectionType[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [form, setForm] = useState<FormValues>({
    election_type: 1,
    country: '',
    year: new Date().getFullYear(),
    round_number: '1',
    round_date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    // Obtener tipos de elección desde backend
    fetch(`${API_BASE_URL}/api/get-election-types`)
      .then((res) => res.json())
      .then(setElectionTypes)
      .catch((err) => console.error('Error fetching election types:', err));

    // Obtener países desde backend (cacheados en Redis)
    fetch(`${API_BASE_URL}/api/get-countries`)
      .then((res) => res.json())
      .then(setCountries)
      .catch((err) => console.error('Error fetching countries:', err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === 'round_date') {
        // Cuando cambia la fecha, actualizar también el año
        const year = new Date(value).getFullYear();
        return { ...prev, round_date: value, year };
      }
      if (name === 'election_type') {
        return { ...prev, election_type: Number(value) };
      }
      if (name === 'round_number') {
        return { ...prev, round_number: value as '1' | '2' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/post-election`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert('Error: ' + JSON.stringify(data.errors || data.error));
      } else {
        alert('Elección creada con éxito. ID ronda activa: ' + data.electionRoundId);
      }
    } catch (error) {
      alert('Error inesperado: ' + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Tipo de elección:
        <select
          name="election_type"
          value={form.election_type}
          onChange={handleChange}
          style={{ color: 'black' }}
          required
        >
          {electionTypes.map((et) => (
            <option key={et.typeId} value={et.typeId}>
              {et.nameType}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        País:
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          style={{ color: 'black' }}
          required
        >
          <option value="">--Selecciona país--</option>
          {countries.map((c) => (
            <option key={c.code ?? c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Ronda:
        <select
          name="round_number"
          value={form.round_number}
          onChange={handleChange}
          style={{ color: 'black' }}
          required
        >
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </label>
      <br />

      <label>
        Fecha de ronda:
        <input
          type="date"
          name="round_date"
          value={form.round_date}
          onChange={handleChange}
          required
          style={{ color: 'black' }}
        />
      </label>
      <br />

      <button type="submit">Crear elección</button>
    </form>
  );
};
