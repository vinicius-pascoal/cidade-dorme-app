import { AblyService } from './ably.service';

interface Game {
  id: string;
  hostName: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  phase: 'night' | 'day';
  round: number;
  createdAt: Date;
}

interface Player {
  id: string;
  name: string;
  role?: string;
  isAlive: boolean;
  team?: 'villains' | 'citizens';
}

export class GameService {
  private games: Map<string, Game> = new Map();
  private ablyService: AblyService;

  constructor() {
    this.ablyService = new AblyService();
  }

  async createGame(hostName: string): Promise<Game> {
    const gameId = this.generateGameId();
    const game: Game = {
      id: gameId,
      hostName,
      players: [],
      status: 'waiting',
      phase: 'night',
      round: 0,
      createdAt: new Date(),
    };

    this.games.set(gameId, game);

    // Publica evento via Ably
    await this.ablyService.publishGameEvent(gameId, 'game:created', game);

    return game;
  }

  async joinGame(gameId: string, playerName: string): Promise<{ game: Game; playerId: string }> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    if (game.status !== 'waiting') {
      throw new Error('Jogo já iniciado');
    }

    const playerId = this.generatePlayerId();
    const player: Player = {
      id: playerId,
      name: playerName,
      isAlive: true,
    };

    game.players.push(player);

    // Publica evento via Ably
    await this.ablyService.publishGameEvent(gameId, 'player:joined', { player, game });

    return { game, playerId };
  }

  async getGame(gameId: string): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Jogo não encontrado');
    }
    return game;
  }

  async startGame(gameId: string): Promise<{ success: boolean; game: Game }> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    if (game.players.length < 10) {
      throw new Error('Mínimo de 10 jogadores necessário');
    }

    game.status = 'playing';
    game.phase = 'night';
    game.round = 1;

    // Aqui você implementaria a lógica de distribuição de papéis
    this.assignRoles(game);

    // Publica evento via Ably
    await this.ablyService.publishGameEvent(gameId, 'game:started', game);

    return { success: true, game };
  }

  async performAction(gameId: string, action: any): Promise<{ success: boolean }> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    // Lógica das ações do jogo
    // Publica evento via Ably
    await this.ablyService.publishGameEvent(gameId, 'game:action', action);

    return { success: true };
  }

  private generateGameId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generatePlayerId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private assignRoles(game: Game): void {
    // Implementar lógica de distribuição de papéis
    // Por enquanto, placeholder
    console.log('Distribuindo papéis para o jogo:', game.id);
  }
}
