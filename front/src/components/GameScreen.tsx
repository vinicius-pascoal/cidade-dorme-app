'use client';

import { Game, GamePhase } from '@/types/game.types';
import { useGamePolling } from '@/hooks/useGamePolling';
import { NightPhaseScreen } from './game-phases/NightPhaseScreen';
import { DayPhaseScreen } from './game-phases/DayPhaseScreen';
import { VotingPhaseScreen } from './game-phases/VotingPhaseScreen';
import { EndGameScreen } from './game-phases/EndGameScreen';

interface GameScreenProps {
  game: Game;
  playerId: string | null;
  onGameEnd: () => void;
}

export function GameScreen({ game: initialGame, playerId, onGameEnd }: GameScreenProps) {
  // Polling durante o jogo para sincronizar fase e estado
  const { game: updatedGame } = useGamePolling({
    gameId: initialGame.id,
    intervalMs: 1000,
    enabled: true,
  });
  const game = updatedGame || initialGame;

  const renderPhaseScreen = () => {
    switch (game.phase) {
      case GamePhase.NIGHT:
        return <NightPhaseScreen game={game} playerId={playerId} />;
      case GamePhase.DAY_DISCUSSION:
        return <DayPhaseScreen game={game} playerId={playerId} />;
      case GamePhase.DAY_VOTING:
        return <VotingPhaseScreen game={game} playerId={playerId} />;
      case GamePhase.ENDED:
        return <EndGameScreen game={game} onEnd={onGameEnd} />;
      case GamePhase.LOBBY:
      default:
        return (
          <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <p className="text-white text-xl">Preparando jogo...</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Header com informações do jogo */}
      <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-700">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase text-gray-400 tracking-wide">Rodada</p>
            <p className="text-2xl font-bold text-white">{game.round}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400 tracking-wide">Fase</p>
            <p className="text-lg font-bold text-purple-400">{game.phase}</p>
          </div>
        </div>
      </div>

      {/* Fase atual */}
      {renderPhaseScreen()}
    </div>
  );
}
