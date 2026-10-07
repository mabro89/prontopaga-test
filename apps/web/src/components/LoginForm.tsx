import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { LoginInputSchema } from '@/types/auth.types';

export const LoginForm: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    const result = LoginInputSchema.safeParse({ email, password });
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message || 'Datos inválidos');
      return;
    }

    await login({ email: email.trim(), password });
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-6 border border-slate-300 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Iniciar Sesión</h2>

      {(error || validationError) && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error || validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">
            Correo
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@prontopaga.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-600">Usuarios demo:</p>
        <p>User: juan.perez@prontopaga.com / User123!</p>
        <p>Admin: admin@prontopaga.com / Admin123!</p>
      </div>
    </div>
  );
};
