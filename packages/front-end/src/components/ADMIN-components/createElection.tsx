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
  const [searchTerm, setSearchTerm] = useState<string>(''); // búsqueda de país
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const [form, setForm] = useState<FormValues>({
    election_type: 1,
    country: '',
    year: new Date().getFullYear(),
    round_number: '1',
    round_date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    // Obtener tipos de elección
    fetch(`${API_BASE_URL}/api/get-election-types`)
      .then((res) => res.json())
      .then(setElectionTypes)
      .catch((err) => console.error('Error fetching election types:', err));

    // Obtener países
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

  const handleCountryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setForm((prev) => ({ ...prev, country: value }));
    setShowSuggestions(true);
  };

  const handleSelectCountry = (name: string) => {
    setForm((prev) => ({ ...prev, country: name }));
    setSearchTerm(name);
    setShowSuggestions(false);
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

  // Filtrado de países según búsqueda
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Tipo de elección:
        </label>
        <select
          name="election_type"
          value={form.election_type}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        >
          {electionTypes.map((et) => (
            <option key={et.typeId} value={et.typeId}>
              {et.nameType}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-white mb-2">
          País:
        </label>
        <input
          type="text"
          name="country"
          value={searchTerm}
          onChange={handleCountryInput}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Escribe o selecciona un país"
          required
        />
        {showSuggestions && searchTerm && (
          <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-slate-800 border border-slate-600 rounded-lg mt-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <li
                  key={c.code ?? c.name}
                  onClick={() => handleSelectCountry(c.name)}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-700 text-white"
                >
                  {c.name}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400">No encontrado</li>
            )}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Ronda:
        </label>
        <select
          name="round_number"
          value={form.round_number}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        >
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Fecha de ronda:
        </label>
        <input
          type="date"
          name="round_date"
          value={form.round_date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <button 
        type="submit" 
        className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
      >
        Crear elección
      </button>
    </form>
  );
};
