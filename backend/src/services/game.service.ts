import { AblyService } from './ably.service';
import { RoleAssignmentService } from './role-assignment.service';
import { PhaseManagerService } from './phase-manager.service';
import { NightActionService } from './night-action.service';
import { VotingService } from './voting.service';
import { VictoryConditionService } from './victory-condition.service';
import {
  Game,
  Player,
  GameStatus,
  GamePhase,
  NightAction,
  NightResult,
  VotingResult,
} from '../types/game.types';

export class GameService {
  private games: Map<string, Game> = new Map();
  private ablyService: AblyService;
  private roleService: RoleAssignmentService;
  private phaseManager: PhaseManagerService;
  private nightActionService: NightActionService;
  private votingService: VotingService;
  private victoryService: VictoryConditionService;

  constructor() {
    this.ablyService = new AblyService();
    this.roleService = new RoleAssignmentService();
    this.phaseManager = new PhaseManagerService();
    this.nightActionService = new NightActionService();
    this.votingService = new VotingService();
    this.victoryService = new VictoryConditionService();
  }

  /**
   * Cria um novo jogo
   */
  async createGame(hostName: string): Promise<Game> {
    const gameId = this.generateGameId();
    const code = this.generateGameCode();

    const host: Player = {
      id: this.generatePlayerId(),
      name: hostName,
      isAlive: true,
      isHost: true,
    };

    const game: Game = {
      id: gameId,
      code,
      hostId: host.id,
      players: [host],
      status: GameStatus.WAITING,
      phase: GamePhase.LOBBY,
      round: 0,
      nightActions: [],
      nightResults: [],
      votingHistory: [],
      witchPotions: {
        hasHealPotion: true,
        hasKillPotion: true,
      },
      currentVotes: new Map(),
      createdAt: new Date(),
    };

    this.games.set(gameId, game);

    await this.ablyService.publishGameEvent(gameId, 'game:created', {
      game: this.sanitizeGameForPublic(game),
    });

    return game;
  }

  /**
   * Jogador entra no jogo
   */
  async joinGame(code: string, playerName: string): Promise<{ game: Game; playerId: string }> {
    const game = this.findGameByCode(code);

    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    if (game.status !== GameStatus.WAITING) {
      throw new Error('Jogo já iniciado');
    }

    if (game.players.length >= 12) {
      throw new Error('Jogo está cheio (máximo 12 jogadores)');
    }

    const playerId = this.generatePlayerId();
    const player: Player = {
      id: playerId,
      name: playerName,
      isAlive: true,
      isHost: false,
    };

    game.players.push(player);

    await this.ablyService.publishGameEvent(game.id, 'player:joined', {
      player: { id: player.id, name: player.name },
      game: this.sanitizeGameForPublic(game),
    });

    return { game, playerId };
  }

  /**
   * Inicia o jogo
   */
  async startGame(gameId: string, hostId: string): Promise<Game> {
    const game = this.games.get(gameId);

    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    if (game.hostId !== hostId) {
      throw new Error('Apenas o host pode iniciar o jogo');
    }

    if (game.players.length < 10 || game.players.length > 12) {
      throw new Error('Número de jogadores deve ser entre 10 e 12');
    }

    if (game.status !== GameStatus.WAITING) {
      throw new Error('Jogo já foi iniciado');
    }

    // Distribui papéis
    this.roleService.assignRoles(game);

    // Inicia primeira noite
    this.phaseManager.startFirstNight(game);

    await this.ablyService.publishGameEvent(game.id, 'game:started', {
      game: this.sanitizeGameForPublic(game),
    });

    // Notifica cada jogador sobre seu papel
    for (const player of game.players) {
      await this.ablyService.publishGameEvent(game.id, `player:${player.id}:role`, {
        playerId: player.id,
        role: player.role,
        team: player.team,
      });
    }

    return game;
  }

  /**
   * Registra uma ação noturna
   */
  async performNightAction(
    gameId: string,
    playerId: string,
    action: Omit<NightAction, 'playerId' | 'timestamp'>
  ): Promise<void> {
    const game = this.games.get(gameId);

    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    if (game.phase !== GamePhase.NIGHT) {
      throw new Error('Não está na fase noturna');
    }

    const nightAction: NightAction = {
      ...action,
      playerId,
      timestamp: new Date(),
    };

    this.nightActionService.registerAction(game, nightAction);

    await this.ablyService.publishGameEvent(game.id, 'night:action_registered', {
      playerId,
      actionType: action.actionType,
    });
  }

  /**
   * Processa o fim da noite
   */
  async processNightEnd(gameId: string): Promise<NightResult> {
    const game = this.games.get(gameId);

    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    if (game.phase !== GamePhase.NIGHT) {
      throw new Error('Não está na fase noturna');
    }

    // Processa ações noturnas
    const result = this.nightActionService.processNightActions(game);

    // Transiciona para o dia
    this.phaseManager.transitionToDayDiscussion(game);

    // Verifica condições de vitória
    const victoryCheck = await this.phaseManager.processPhaseEnd(game);

    await this.ablyService.publishGameEvent(game.id, 'night:ended', {
      result: this.sanitizeNightResultForPublic(result),
      game: this.sanitizeGameForPublic(game),
      hasWinner: !victoryCheck.shouldContinue,
      winner: victoryCheck.winner,
    });

    // Envia resultados privados para investigadores
    if (result.detectiveResult) {
      const detective = game.players.find(p => p.role === 'DETETIVE');
      if (detective) {
        await this.ablyService.publishGameEvent(
          game.id,
          `player:${detective.id}:investigation`,
          result.detectiveResult
        );
      }
    }

    if (result.seerResult) {
      const seer = game.players.find(p => p.role === 'VIDENTE');
      if (seer) {
        await this.ablyService.publishGameEvent(
          game.id,
          `player:${seer.id}:investigation`,
          result.seerResult
        );
      }
    }

    return result;
  }

  /**
   * Registra um voto
   */
  async castVote(gameId: string, voterId: string, targetId: string): Promise<void> {
    const game = this.games.get(gameId);

    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    if (game.phase !== GamePhase.DAY_VOTING) {
      throw new Error('Não está na fase de votação');
    }

    this.votingService.castVote(game, voterId, targetId);

    await this.ablyService.publishGameEvent(game.id, 'vote:cast', {
      voterId,
      votingStatus: this.votingService.getVotingStatus(game),
    });
  }

  /**
   * Processa o fim da votação
   */
  async processVotingEnd(gameId: string): Promise<VotingResult> {
    const game = this.games.get(gameId);

    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    if (game.phase !== GamePhase.DAY_VOTING) {
      throw new Error('Não está na fase de votação');
    }

    // Processa votação
    const result = this.votingService.processVoting(game);

    // Verifica condições de vitória
    const victoryCheck = await this.phaseManager.processPhaseEnd(game);

    if (victoryCheck.shouldContinue) {
      // Transiciona para próxima noite
      this.phaseManager.transitionToNextNight(game);
    }

    await this.ablyService.publishGameEvent(game.id, 'voting:ended', {
      result,
      game: this.sanitizeGameForPublic(game),
      hasWinner: !victoryCheck.shouldContinue,
      winner: victoryCheck.winner,
    });

    return result;
  }

  /**
   * Avança a fase manualmente (host)
   */
  async advancePhase(gameId: string, hostId: string): Promise<void> {
    const game = this.games.get(gameId);

    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    if (game.hostId !== hostId) {
      throw new Error('Apenas o host pode avançar a fase');
    }

    const canAdvance = this.phaseManager.canAdvancePhase(game);

    if (!canAdvance.canAdvance) {
      throw new Error(canAdvance.reason || 'Não pode avançar a fase');
    }

    const currentPhase = game.phase;

    if (currentPhase === GamePhase.NIGHT) {
      await this.processNightEnd(gameId);
    } else if (currentPhase === GamePhase.DAY_DISCUSSION) {
      this.phaseManager.transitionToVoting(game);
      await this.ablyService.publishGameEvent(game.id, 'phase:changed', {
        phase: game.phase,
        game: this.sanitizeGameForPublic(game),
      });
    } else if (currentPhase === GamePhase.DAY_VOTING) {
      await this.processVotingEnd(gameId);
    }
  }

  /**
   * Obtém informações do jogo
   */
  async getGame(gameId: string): Promise<Game> {
    const game = this.games.get(gameId);

    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    return game;
  }

  /**
   * Obtém informações do jogo para um jogador específico
   */
  async getGameForPlayer(gameId: string, playerId: string): Promise<any> {
    const game = await this.getGame(gameId);
    const player = game.players.find(p => p.id === playerId);

    if (!player) {
      throw new Error('Jogador não encontrado');
    }

    return {
      game: this.sanitizeGameForPublic(game),
      player: {
        id: player.id,
        name: player.name,
        role: player.role,
        team: player.team,
        isAlive: player.isAlive,
        isHost: player.isHost,
      },
      gameStats: this.victoryService.getGameStats(game),
    };
  }

  /**
   * Remove informações sensíveis do jogo
   */
  private sanitizeGameForPublic(game: Game): any {
    return {
      id: game.id,
      code: game.code,
      status: game.status,
      phase: game.phase,
      round: game.round,
      players: game.players.map(p => ({
        id: p.id,
        name: p.name,
        isAlive: p.isAlive,
        isHost: p.isHost,
        // role e team são ocultados
      })),
      createdAt: game.createdAt,
      startedAt: game.startedAt,
      endedAt: game.endedAt,
      winner: game.winner,
    };
  }

  /**
   * Remove informações privadas do resultado da noite
   */
  private sanitizeNightResultForPublic(result: NightResult): any {
    return {
      finalDeaths: result.finalDeaths,
      // Não revela quem matou ou salvou
    };
  }

  private findGameByCode(code: string): Game | undefined {
    return Array.from(this.games.values()).find(g => g.code === code);
  }

  private generateGameId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateGameCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generatePlayerId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
