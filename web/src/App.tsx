import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { ScoreSearchForm } from '@/components/ScoreSearchForm';
import { ScoreResultCard } from '@/components/ScoreResultCard';

export default function App() {
  const { isAuthenticated, isInitializing, silentRefresh } = useAuthStore();

  useEffect(() => {
    void silentRefresh();
  }, [silentRefresh]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-600 text-sm">
        Cargando aplicación...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <LoginForm />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4">
        <ScoreSearchForm />
        <ScoreResultCard />
      </main>
    </div>
  );
}
