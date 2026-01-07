'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Game } from '@/types/game.types';
import { gameService } from '@/services/game.service';

interface UseGamePollingOptions {
  gameId: string;
  intervalMs?: number;
  enabled?: boolean;
}

export function useGamePolling({
  gameId,
  intervalMs = 2000,
  enabled = true,
}: UseGamePollingOptions) {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchGame = useCallback(async () => {
    try {
      setError(null);
      const updatedGame = await gameService.getGame(gameId);
      setGame(updatedGame);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar sala');
      console.error('Erro ao buscar sala:', err);
    }
  }, [gameId]);

  useEffect(() => {
    if (!enabled) return;

    // Fetch imediatamente
    setIsLoading(true);
    fetchGame().finally(() => setIsLoading(false));

    // Configurar polling
    intervalRef.current = setInterval(() => {
      fetchGame();
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameId, intervalMs, enabled, fetchGame]);

  return { game, isLoading, error, refetch: fetchGame };
}
