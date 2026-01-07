'use client';

import { Game } from '@/types/game.types';
import { useState, useCallback } from 'react';

interface VotingPhaseScreenProps {
  game: Game;
  playerId: string | null;
}

export function VotingPhaseScreen({ game, playerId }: VotingPhaseScreenProps) {
  const [selectedVote, setSelectedVote] = useState<string | null>(null);

  const handleVote = useCallback(async (targetId: string) => {
    setSelectedVote(targetId);
    // TODO: Enviar voto para o backend
    console.log(`Votou em: ${targetId}`);
  }, []);

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">🗳️ Votação</h2>

      <div className="bg-red-900/30 border-2 border-red-600/50 rounded-2xl p-6 mb-6">
        <p className="text-red-200 text-center">
          Votem em quem vocês acham que é o assassino. O mais votado será eliminado!
        </p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Escolha seu voto</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {game.players
            .filter(p => p.isAlive && p.id !== playerId)
            .map(player => (
              <button
                key={player.id}
                onClick={() => handleVote(player.id)}
                className={`w-full p-4 rounded-lg font-semibold transition-all ${selectedVote === player.id
                    ? 'bg-red-600 text-white border-2 border-red-400'
                    : 'bg-slate-700 text-white hover:bg-slate-600 border-2 border-transparent'
                  }`}
              >
                {selectedVote === player.id && '✓ '}
                {player.name}
              </button>
            ))}
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm">
        Votação encerrada automáticamente ao final do tempo
      </div>
    </div>
  );
}
