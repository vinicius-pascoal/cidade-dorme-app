'use client';

import { Game } from '@/types/game.types';
import { useState, useCallback } from 'react';
import { gameService } from '@/services/game.service';

interface VotingPhaseScreenProps {
  game: Game;
  playerId: string | null;
}

export function VotingPhaseScreen({ game, playerId }: VotingPhaseScreenProps) {
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);

  const handleVote = useCallback(async (targetId: string) => {
    if (!playerId) return;

    try {
      setSelectedVote(targetId);
      await gameService.castVote(game.id, playerId, targetId);
      setHasVoted(true);
      setVotedFor(targetId);
    } catch (error) {
      console.error('Erro ao votar:', error);
      setSelectedVote(null);
    }
  }, [playerId, game.id]);

  if (hasVoted) {
    const votedPlayer = game.players.find(p => p.id === votedFor);
    return (
      <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🗳️ Votação</h2>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 shadow-2xl border-2 border-green-500/30">
          <div className="text-center space-y-6">
            {/* Ícone de Checkmark */}
            <div className="text-7xl mb-4">✅</div>

            {/* Mensagem de Voto Realizado */}
            <div>
              <h3 className="text-3xl font-bold text-green-400 mb-2">Voto Registrado!</h3>
              <p className="text-white text-lg">
                Você votou em <span className="font-bold">{votedPlayer?.name}</span>
              </p>
            </div>

            {/* Aguardando */}
            <div className="mt-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-gray-300 text-xl font-semibold">
                Aguardando os outros jogadores...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Não feche esta página
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">🗳️ Votação</h2>

      <div className="bg-yellow-900/30 border-2 border-yellow-600/50 rounded-2xl p-6 mb-8">
        <p className="text-yellow-200 text-center">
          Votem em quem vocês acham que é o assassino!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {game.players
          .filter(p => p.isAlive && p.id !== playerId)
          .map(player => (
            <button
              key={player.id}
              onClick={() => handleVote(player.id)}
              className={`p-4 rounded-lg font-semibold transition-all ${selectedVote === player.id
                ? 'bg-red-600 text-white border-2 border-red-400'
                : 'bg-slate-700 text-white hover:bg-slate-600 border-2 border-transparent'
                }`}
            >
              {selectedVote === player.id && '✓\n'}
              {player.name}
            </button>
          ))}
      </div>
    </div>
  );
}
