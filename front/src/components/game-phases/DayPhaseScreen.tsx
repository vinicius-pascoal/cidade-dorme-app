'use client';

import { Game } from '@/types/game.types';
import { useState, useEffect } from 'react';

interface DayPhaseScreenProps {
  game: Game;
  playerId: string | null;
}

export function DayPhaseScreen({ game }: DayPhaseScreenProps) {
  // Estado inicial calculado uma única vez
  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    if (!game.phaseEndsAt) return 60;
    const ends = new Date(game.phaseEndsAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((ends - now) / 1000));
  });

  // Recalcula a cada segundo baseado no relógio do cliente vs phaseEndsAt
  useEffect(() => {
    const interval = setInterval(() => {
      if (!game.phaseEndsAt) {
        setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
        return;
      }
      const ends = new Date(game.phaseEndsAt).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((ends - now) / 1000));
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [game.phaseEndsAt]);

  // Encontra os mortos nesta rodada
  const lastDeaths = game.lastNightDeaths || [];
  const deathPlayers = game.players.filter(p => lastDeaths.includes(p.id));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">☀️ Dia - Discussão</h2>

      {/* Mostrar mortos da noite anterior */}
      {deathPlayers.length > 0 && (
        <div className="bg-red-900/30 border-2 border-red-600/50 rounded-2xl p-6">
          <p className="text-red-200 text-center font-semibold mb-4">
            💀 Alguns não sobreviveram à noite:
          </p>
          <div className="space-y-2">
            {deathPlayers.map(player => (
              <div key={player.id} className="text-red-300 text-center text-lg font-semibold">
                ⚰️ {player.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instruções de discussão */}
      <div className="bg-yellow-900/30 border-2 border-yellow-600/50 rounded-2xl p-6">
        <p className="text-yellow-200 text-center text-lg font-semibold">
          Discutam sobre quem é o assassino! 💬
        </p>
      </div>

      {/* Timer de 3 minutos */}
      <div className="bg-linear-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-600/50 rounded-2xl p-6">
        <p className="text-gray-300 text-center text-sm mb-2">Tempo para discussão</p>
        <p className={`text-center text-5xl font-bold font-mono ${timeRemaining > 60
            ? 'text-purple-400'
            : timeRemaining > 30
              ? 'text-yellow-400'
              : 'text-red-400'
          }`}>
          {formatTime(timeRemaining)}
        </p>
        {timeRemaining === 0 && (
          <p className="text-center text-white mt-3 text-lg font-bold animate-pulse">
            Começando votação...
          </p>
        )}
      </div>

      <div className="text-center text-gray-400">
        <p className="text-sm">Prepare seus argumentos!</p>
      </div>
    </div>
  );
}
