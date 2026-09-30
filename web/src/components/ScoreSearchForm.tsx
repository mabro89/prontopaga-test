import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useScoreStore } from '@/store/score.store';

export const ScoreSearchForm: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchScore, isLoading, error, clearError } = useScoreStore();
  const [rutInput, setRutInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rutInput.trim()) return;
    await fetchScore(rutInput.trim());
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Consultar Score</h2>
        <p className="text-xs text-slate-500">
          {user?.role === 'ADMIN'
            ? 'Rol: Administrador (puedes consultar cualquier RUT)'
            : `Rol: Usuario (solo puedes consultar tu RUT: ${user?.rut})`}
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="text-xs text-red-500 underline ml-2 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={rutInput}
          onChange={(e) => setRutInput(e.target.value)}
          placeholder="Ingresa RUT (ej: 22.222.222-2)"
          className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-hidden focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !rutInput.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Consultando...' : 'Consultar'}
        </button>
      </form>
    </div>
  );
};
