'use client';

import { GameProvider, useGame } from '@/context/GameContext';
import { GameLayout } from '@/components/GameLayout';
import { MenuScreen } from '@/components/MenuScreen';
import { CreateScreen } from '@/components/CreateScreen';
import { JoinScreen } from '@/components/JoinScreen';
import { RoomScreen } from '@/components/RoomScreen';
import { GameScreen } from '@/components/GameScreen';
import { MessageAlert } from '@/components/MessageAlert';
import { GameStatus } from '@/types/game.types';
import { useGamePolling } from '@/hooks/useGamePolling';

function GameContent() {
  const { screen, game, playerId, error, info, resetGame } = useGame();

  // Usar polling para atualizar o status do jogo quando estiver em uma sala
  const { game: updatedGame } = useGamePolling({
    gameId: game?.id || '',
    intervalMs: 1000,
    enabled: screen === 'room' && game !== null,
  });

  const currentGame = updatedGame || game;

  // Se o jogo começou, mudar para a tela de gameplay
  if (screen === 'room' && currentGame && currentGame.status === GameStatus.PLAYING) {
    return (
      <GameScreen
        game={currentGame}
        playerId={playerId}
        onGameEnd={resetGame}
      />
    );
  }

  return (
    <>
      {/* Main Screen */}
      {screen === 'menu' && <MenuScreen />}
      {screen === 'create' && <CreateScreen />}
      {screen === 'join' && <JoinScreen />}
      {screen === 'room' && currentGame && (
        <RoomScreen
          game={currentGame}
          playerId={playerId}
          onBack={resetGame}
        />
      )}

      {/* Messages - Below Main Area */}
      {screen !== 'room' && (
        <div className="absolute bottom-6 left-0 right-0 max-w-xl mx-auto px-4 space-y-3">
          <MessageAlert type="error" message={error} />
          <MessageAlert type="success" message={info} />
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameLayout>
        <GameContent />
      </GameLayout>
    </GameProvider>
  );
}
