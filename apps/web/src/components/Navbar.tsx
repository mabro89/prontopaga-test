import React from 'react';
import { useAuthStore } from '@/store/auth.store';

export const Navbar: React.FC = () => {
  const { user, logout, isLoading } = useAuthStore();

  if (!user) return null;

  return (
    <header className="bg-white border-b border-slate-300">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="font-bold text-slate-900 text-base">ProntoPaga Score</h1>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <span className="text-slate-600">
            {user.firstName} ({user.role}) - RUT: {user.rut}
          </span>
          <button
            type="button"
            onClick={() => void logout()}
            disabled={isLoading}
            className="text-red-600 hover:underline cursor-pointer disabled:opacity-50"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
};
