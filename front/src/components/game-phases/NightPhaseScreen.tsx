'use client';

import { Game } from '@/types/game.types';

interface NightPhaseScreenProps {
  game: Game;
  playerId: string | null;
}

export function NightPhaseScreen({ game, playerId }: NightPhaseScreenProps) {
  const currentPlayer = game.players.find(p => p.id === playerId);

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">🌙 Noite</h2>

      <div className="bg-slate-800 rounded-2xl p-6 mb-6">
        <p className="text-gray-300 text-center mb-4">
          {currentPlayer?.role ? `Você é: ${currentPlayer.role}` : 'Você é um Cidadão'}
        </p>

        {currentPlayer?.role && !['CIDADAO'].includes(currentPlayer.role) ? (
          <div className="space-y-3">
            <p className="text-white font-semibold text-center">Escolha sua ação:</p>
            {/* Ações específicas do personagem */}
            <button className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
              Executar Ação
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-center">Aguarde a noite passar...</p>
        )}
      </div>

      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Jogadores Vivos</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {game.players
            .filter(p => p.isAlive)
            .map(player => (
              <div key={player.id} className="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
                <span className="text-white">{player.name}</span>
                {player.id === playerId && <span className="text-purple-400 text-xs font-bold">VOCÊ</span>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
