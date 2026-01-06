import { apiClient } from '@/lib/api-client';
import { Game, Player } from '@/types/game.types';

export const gameService = {
  async createGame(hostName: string): Promise<Game> {
    return apiClient.post<Game>('/games', { hostName });
  },

  async joinGame(gameCode: string, playerName: string): Promise<{ game: Game; player: Player }> {
    return apiClient.post(`/games/${gameCode}/join`, { playerName });
  },

  async getGame(gameId: string): Promise<Game> {
    return apiClient.get<Game>(`/games/${gameId}`);
  },

  async startGame(gameId: string): Promise<Game> {
    return apiClient.post<Game>(`/games/${gameId}/start`);
  },

  async leaveGame(gameId: string, playerId: string): Promise<void> {
    return apiClient.delete(`/games/${gameId}/players/${playerId}`);
  },
};
