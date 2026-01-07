'use client';

import { GameProvider, useGame } from '@/context/GameContext';
import { GameLayout } from '@/components/GameLayout';
import { MenuScreen } from '@/components/MenuScreen';
import { CreateScreen } from '@/components/CreateScreen';
import { JoinScreen } from '@/components/JoinScreen';
import { RoomScreen } from '@/components/RoomScreen';
import { MessageAlert } from '@/components/MessageAlert';

function GameContent() {
  const { screen, game, playerId, error, info, resetGame } = useGame();

  return (
    <>
      {/* Main Screen */}
      {screen === 'menu' && <MenuScreen />}
      {screen === 'create' && <CreateScreen />}
      {screen === 'join' && <JoinScreen />}
      {screen === 'room' && game && (
        <RoomScreen
          game={game}
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
