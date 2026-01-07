'use client';

import { Game } from '@/types/game.types';

interface DayPhaseScreenProps {
  game: Game;
  playerId: string | null;
}

export function DayPhaseScreen({ }: DayPhaseScreenProps) {
  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">☀️ Dia - Discussão</h2>

      <div className="bg-yellow-900/30 border-2 border-yellow-600/50 rounded-2xl p-6 mb-8">
        <p className="text-yellow-200 text-center text-lg font-semibold">
          Discutam sobre quem é o assassino! 💬
        </p>
        <p className="text-yellow-200/80 text-center text-sm mt-2">
          Próximo: Votação
        </p>
      </div>

      <div className="text-center text-gray-400">
        <p className="text-sm">Preparando votação...</p>
      </div>
    </div>
  );
}
