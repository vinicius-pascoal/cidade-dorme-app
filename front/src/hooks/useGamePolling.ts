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

    // Flag para rastrear se o componente está montado
    let isMounted = true;

    const fetchAndUpdate = async () => {
      try {
        const updatedGame = await gameService.getGame(gameId);
        if (isMounted) {
          setGame(updatedGame);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao atualizar sala');
          console.error('Erro ao buscar sala:', err);
        }
      }
    };

    // Fetch imediatamente na montagem
    fetchAndUpdate();

    // Configurar polling
    intervalRef.current = setInterval(() => {
      fetchAndUpdate();
    }, intervalMs);

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameId, intervalMs, enabled, fetchGame]);

  return { game, error, refetch: fetchGame };
}
