import { Game, Role, Team } from '../types/game.types';

export class VictoryConditionService {
  /**
   * Verifica as condições de vitória do jogo
   */
  public checkVictoryCondition(game: Game): {
    hasWinner: boolean;
    winner?: Team | 'SUICIDA' | null;
    reason?: string;
  } {
    // Verifica se o Suicida venceu (foi eliminado por votação)
    const suicidaVictory = this.checkSuicidaVictory(game);
    if (suicidaVictory.hasWon) {
      return {
        hasWinner: true,
        winner: 'SUICIDA',
        reason: 'Suicida foi eliminado por votação',
      };
    }

    // Verifica se todos os assassinos foram eliminados
    const citizensVictory = this.checkCitizensVictory(game);
    if (citizensVictory.hasWon) {
      return {
        hasWinner: true,
        winner: Team.CITIZENS,
        reason: 'Todos os assassinos foram eliminados',
      };
    }

    // Verifica se assassinos >= cidadãos
    const villainsVictory = this.checkVillainsVictory(game);
    if (villainsVictory.hasWon) {
      return {
        hasWinner: true,
        winner: Team.VILLAINS,
        reason: 'Assassinos igualaram ou superaram o número de cidadãos',
      };
    }

    return {
      hasWinner: false,
    };
  }

  /**
   * Verifica vitória do Suicida
   * Vence se foi eliminado por votação durante o dia
   */
  private checkSuicidaVictory(game: Game): { hasWon: boolean } {
    // Pega a última votação
    const lastVoting = game.votingHistory[game.votingHistory.length - 1];

    if (!lastVoting || !lastVoting.eliminated) {
      return { hasWon: false };
    }

    // Verifica se o eliminado era o Suicida
    const eliminatedPlayer = game.players.find(p => p.id === lastVoting.eliminated);

    return {
      hasWon: eliminatedPlayer?.role === Role.SUICIDA && !eliminatedPlayer.isAlive,
    };
  }

  /**
   * Verifica vitória dos Cidadãos
   * Vencem se todos os assassinos forem eliminados
   */
  private checkCitizensVictory(game: Game): { hasWon: boolean } {
    const aliveAssassins = game.players.filter(
      p => p.isAlive && (p.role === Role.ASSASSINO || p.role === Role.LIDER_ASSASSINOS)
    );

    // Cidadãos vencem se não há mais assassinos vivos
    return {
      hasWon: aliveAssassins.length === 0,
    };
  }

  /**
   * Verifica vitória dos Vilões (Assassinos)
   * Vencem se número de assassinos >= número de cidadãos vivos
   */
  private checkVillainsVictory(game: Game): { hasWon: boolean } {
    const aliveAssassins = game.players.filter(
      p => p.isAlive && (p.role === Role.ASSASSINO || p.role === Role.LIDER_ASSASSINOS)
    );

    // Conta cidadãos vivos (excluindo Suicida que é vilão)
    const aliveCitizens = game.players.filter(
      p => p.isAlive && p.team === Team.CITIZENS
    );

    // Assassinos vencem se igualaram ou superaram os cidadãos
    return {
      hasWon: aliveAssassins.length > 0 && aliveAssassins.length >= aliveCitizens.length,
    };
  }

  /**
   * Retorna estatísticas do jogo para análise
   */
  public getGameStats(game: Game): {
    totalPlayers: number;
    alivePlayers: number;
    aliveAssassins: number;
    aliveCitizens: number;
    deadPlayers: number;
    round: number;
  } {
    const alivePlayers = game.players.filter(p => p.isAlive);
    const aliveAssassins = game.players.filter(
      p => p.isAlive && (p.role === Role.ASSASSINO || p.role === Role.LIDER_ASSASSINOS)
    );
    const aliveCitizens = game.players.filter(
      p => p.isAlive && p.team === Team.CITIZENS
    );

    return {
      totalPlayers: game.players.length,
      alivePlayers: alivePlayers.length,
      aliveAssassins: aliveAssassins.length,
      aliveCitizens: aliveCitizens.length,
      deadPlayers: game.players.length - alivePlayers.length,
      round: game.round,
    };
  }

  /**
   * Verifica se o jogo pode continuar
   */
  public canGameContinue(game: Game): { canContinue: boolean; reason?: string } {
    const victoryCheck = this.checkVictoryCondition(game);

    if (victoryCheck.hasWinner) {
      return {
        canContinue: false,
        reason: victoryCheck.reason,
      };
    }

    const stats = this.getGameStats(game);

    // Verifica se há jogadores suficientes
    if (stats.alivePlayers < 2) {
      return {
        canContinue: false,
        reason: 'Menos de 2 jogadores vivos',
      };
    }

    return {
      canContinue: true,
    };
  }

  /**
   * Retorna informação sobre o estado atual do jogo
   */
  public getGameState(game: Game): {
    phase: string;
    round: number;
    stats: {
      totalPlayers: number;
      alivePlayers: number;
      aliveAssassins: number;
      aliveCitizens: number;
      deadPlayers: number;
      round: number;
    };
    victoryStatus: {
      assassinsNeedToEliminate: number;
      citizensNeedToFind: number;
    };
  } {
    const stats = this.getGameStats(game);

    return {
      phase: game.phase,
      round: game.round,
      stats,
      victoryStatus: {
        assassinsNeedToEliminate: stats.aliveCitizens - stats.aliveAssassins,
        citizensNeedToFind: stats.aliveAssassins,
      },
    };
  }
}
