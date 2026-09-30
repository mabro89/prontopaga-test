import React from 'react';
import { useScoreStore } from '@/store/score.store';

export const ScoreResultCard: React.FC = () => {
  const { currentScore, isFromCache } = useScoreStore();

  if (!currentScore) return null;

  return (
    <div className="mt-4 p-4 border border-slate-300 rounded-lg bg-white text-sm">
      <h3 className="font-semibold text-base mb-2">Resultado</h3>
      <div className="space-y-1 text-slate-700">
        <p>
          <span className="font-medium">RUT:</span> {currentScore.rut}
        </p>
        <p>
          <span className="font-medium">Score:</span> {currentScore.score}
        </p>
        <p>
          <span className="font-medium">Fecha:</span> {currentScore.date}
        </p>
        {isFromCache && (
          <p className="text-xs text-amber-600 font-medium">
            (Obtenido desde caché)
          </p>
        )}
      </div>
    </div>
  );
};
