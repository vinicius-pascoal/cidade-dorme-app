import { Game, GamePhase, GameStatus } from '../types/game.types';
import { VictoryConditionService } from './victory-condition.service';

export class PhaseManagerService {
  private victoryService: VictoryConditionService;

  constructor() {
    this.victoryService = new VictoryConditionService();
  }

  /**
   * Inicia a primeira noite do jogo
   */
  public startFirstNight(game: Game): void {
    game.phase = GamePhase.NIGHT;
    game.round = 1;
    game.status = GameStatus.PLAYING;
    game.startedAt = new Date();
    game.nightActions = [];
  }

  /**
   * Transiciona da noite para o dia (discussão)
   */
  public transitionToDayDiscussion(game: Game): void {
    game.phase = GamePhase.DAY_DISCUSSION;
    game.nightActions = []; // Limpa ações da noite anterior
  }

  /**
   * Transiciona da discussão para votação
   */
  public transitionToVoting(game: Game): void {
    game.phase = GamePhase.DAY_VOTING;
    game.currentVotes = new Map();

    // Limpa votos anteriores dos jogadores
    game.players.forEach(player => {
      player.votedFor = null;
    });
  }

  /**
   * Transiciona da votação para a próxima noite
   */
  public transitionToNextNight(game: Game): void {
    game.phase = GamePhase.NIGHT;
    game.round += 1;
    game.nightActions = [];
  }

  /**
   * Verifica se todas as ações noturnas obrigatórias foram realizadas
   */
  public areAllNightActionsComplete(game: Game): boolean {
    const aliveAssassins = game.players.filter(
      p => p.isAlive && (p.role === 'ASSASSINO' || p.role === 'LIDER_ASSASSINOS')
    );

    // Verificar se assassinos agiram
    const assassinActions = game.nightActions.filter(
      a => a.actionType === 'ASSASSIN_KILL'
    );

    if (aliveAssassins.length > 0 && assassinActions.length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Verifica se todos os jogadores vivos votaram
   */
  public areAllVotesCast(game: Game): boolean {
    const alivePlayers = game.players.filter(p => p.isAlive);
    const votedPlayers = game.players.filter(p => p.isAlive && p.votedFor !== null);

    return votedPlayers.length === alivePlayers.length;
  }

  /**
   * Processa o fim da fase atual e verifica condições de vitória
   */
  public async processPhaseEnd(game: Game): Promise<{
    shouldContinue: boolean;
    winner?: 'VILLAINS' | 'CITIZENS' | 'SUICIDA' | null;
  }> {
    // Verifica condição de vitória
    const victoryCheck = this.victoryService.checkVictoryCondition(game);

    if (victoryCheck.hasWinner) {
      game.status = GameStatus.FINISHED;
      game.phase = GamePhase.ENDED;
      game.winner = victoryCheck.winner!;
      game.endedAt = new Date();

      return {
        shouldContinue: false,
        winner: victoryCheck.winner!,
      };
    }

    return {
      shouldContinue: true,
    };
  }

  /**
   * Retorna a próxima fase do jogo
   */
  public getNextPhase(currentPhase: GamePhase): GamePhase {
    switch (currentPhase) {
      case GamePhase.NIGHT:
        return GamePhase.DAY_DISCUSSION;
      case GamePhase.DAY_DISCUSSION:
        return GamePhase.DAY_VOTING;
      case GamePhase.DAY_VOTING:
        return GamePhase.NIGHT;
      default:
        return currentPhase;
    }
  }

  /**
   * Verifica se a fase pode ser avançada
   */
  public canAdvancePhase(game: Game): { canAdvance: boolean; reason?: string } {
    switch (game.phase) {
      case GamePhase.NIGHT:
        if (!this.areAllNightActionsComplete(game)) {
          return { canAdvance: false, reason: 'Ações noturnas incompletas' };
        }
        return { canAdvance: true };

      case GamePhase.DAY_DISCUSSION:
        // Discussão pode ser avançada a qualquer momento
        return { canAdvance: true };

      case GamePhase.DAY_VOTING:
        if (!this.areAllVotesCast(game)) {
          return { canAdvance: false, reason: 'Votação incompleta' };
        }
        return { canAdvance: true };

      default:
        return { canAdvance: false, reason: 'Fase inválida' };
    }
  }
}
