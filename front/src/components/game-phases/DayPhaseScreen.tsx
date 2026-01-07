'use client';

import { Game } from '@/types/game.types';

interface DayPhaseScreenProps {
  game: Game;
  playerId: string | null;
}

export function DayPhaseScreen({ game, playerId }: DayPhaseScreenProps) {
  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">☀️ Dia - Discussão</h2>

      <div className="bg-yellow-900/30 border-2 border-yellow-600/50 rounded-2xl p-6 mb-6">
        <p className="text-yellow-200 text-center">
          Discutam sobre quem vocês acham que é o assassino. Vocês têm 5 minutos!
        </p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Jogadores Vivos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
          {game.players
            .filter(p => p.isAlive)
            .map(player => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border-2 ${player.id === playerId
                    ? 'bg-purple-900/50 border-purple-500'
                    : 'bg-slate-700 border-slate-600'
                  }`}
              >
                <p className="text-white font-semibold">{player.name}</p>
                {player.isHost && <p className="text-xs text-gray-400">👑 Host</p>}
              </div>
            ))}
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm">
        Próximo: Votação para eliminar alguém
      </div>
    </div>
  );
}
