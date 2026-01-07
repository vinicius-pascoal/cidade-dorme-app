'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Game } from '@/types/game.types';

export type Screen = 'menu' | 'create' | 'join' | 'room';

interface GameContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  game: Game | null;
  setGame: (game: Game | null) => void;
  playerId: string | null;
  setPlayerId: (id: string | null) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  roomCode: string;
  setRoomCode: (code: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  info: string | null;
  setInfo: (info: string | null) => void;
  resetMessages: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('menu');
  const [game, setGame] = useState<Game | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const resetMessages = useCallback(() => {
    setError(null);
    setInfo(null);
  }, []);

  const resetGame = useCallback(() => {
    setGame(null);
    setPlayerId(null);
    setPlayerName('');
    setRoomCode('');
    setScreen('menu');
  }, []);

  return (
    <GameContext.Provider
      value={{
        screen,
        setScreen,
        game,
        setGame,
        playerId,
        setPlayerId,
        playerName,
        setPlayerName,
        roomCode,
        setRoomCode,
        isLoading,
        setIsLoading,
        error,
        setError,
        info,
        setInfo,
        resetMessages,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser usado dentro de GameProvider');
  }
  return context;
}
