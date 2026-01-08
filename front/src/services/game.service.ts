import { apiClient } from '@/lib/api-client';
import { Game } from '@/types/game.types';

type JoinResponse = { game: Game; playerId: string };
type GameStartResponse = { success: boolean; game: Game };

export const gameService = {
  async createGame(hostName: string): Promise<Game> {
    return apiClient.post<Game>('/create', { hostName });
  },

  async joinGame(code: string, playerName: string): Promise<JoinResponse> {
    return apiClient.post<JoinResponse>('/join', { code, playerName });
  },

  async getGame(gameId: string): Promise<Game> {
    return apiClient.get<Game>(`/${gameId}`);
  },

  async getGameForPlayer(gameId: string, playerId: string): Promise<{
    game: Game;
    player: { id: string; name: string; role?: string; team?: string; isAlive: boolean; isHost: boolean };
    gameStats: unknown;
  }> {
    return apiClient.get(`/${gameId}/player/${playerId}`);
  },

  async startGame(gameId: string, hostId: string): Promise<GameStartResponse> {
    return apiClient.post<GameStartResponse>(`/${gameId}/start`, { hostId });
  },

  async executeNightAction(gameId: string, playerId: string, actionType: string, targetId?: string): Promise<{ success: boolean; result?: any }> {
    return apiClient.post<{ success: boolean; result?: any }>(`/${gameId}/night-action`, {
      playerId,
      actionType,
      targetId,
    });
  },

  async castVote(gameId: string, voterId: string, targetId: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/${gameId}/vote`, {
      voterId,
      targetId,
    });
  },

  async advancePhase(gameId: string, hostId: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/${gameId}/advance-phase`, {
      hostId,
    });
  },
};
