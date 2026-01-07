'use client';

import { Game, Team } from '@/types/game.types';

interface EndGameScreenProps {
  game: Game;
  onEnd: () => void;
}

export function EndGameScreen({ game, onEnd }: EndGameScreenProps) {
  const getWinnerMessage = () => {
    switch (game.winner) {
      case Team.VILLAINS:
        return 'Os Assassinos Venceram! 🎭';
      case Team.CITIZENS:
        return 'Os Cidadãos Venceram! 🏆';
      case 'SUICIDA':
        return 'O Suicida Venceu! 💀';
      default:
        return 'Jogo Encerrado!';
    }
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
      <h2 className="text-4xl font-bold text-white mb-8 text-center">{getWinnerMessage()}</h2>

      <div className="bg-slate-800 rounded-2xl p-6 mb-8 border-2 border-purple-500">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Resultado Final</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {game.players.map(player => (
            <div
              key={player.id}
              className={`p-4 rounded-lg flex items-center justify-between ${player.isAlive ? 'bg-emerald-900/40 border-l-4 border-emerald-500' : 'bg-red-900/40 border-l-4 border-red-500'
                }`}
            >
              <div>
                <p className="text-white font-semibold">{player.name}</p>
                <p className="text-sm text-gray-400">{player.role || 'Cidadão'}</p>
              </div>
              <span className={player.isAlive ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {player.isAlive ? 'Sobreviveu' : 'Eliminado'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onEnd}
        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
      >
        ← Voltar ao Menu
      </button>
    </div>
  );
}
