import { Role, Player, Game } from '../types/game.types';

export class RoleAssignmentService {
  // Configuração padrão de papéis por número de jogadores
  private static ROLE_DISTRIBUTION: Record<number, Role[]> = {
    10: [
      Role.ASSASSINO,
      Role.LIDER_ASSASSINOS,
      Role.SUICIDA,
      Role.DETETIVE,
      Role.MEDICO,
      Role.VIDENTE,
      Role.BRUXA,
      Role.JUIZ,
      Role.DELEGADO,
      Role.CIDADAO,
    ],
    11: [
      Role.ASSASSINO,
      Role.LIDER_ASSASSINOS,
      Role.SUICIDA,
      Role.DETETIVE,
      Role.MEDICO,
      Role.VIDENTE,
      Role.BRUXA,
      Role.JUIZ,
      Role.DELEGADO,
      Role.FANTASMA,
      Role.CIDADAO,
    ],
    12: [
      Role.ASSASSINO,
      Role.ASSASSINO, // 2 assassinos para 12 jogadores
      Role.LIDER_ASSASSINOS,
      Role.SUICIDA,
      Role.DETETIVE,
      Role.MEDICO,
      Role.VIDENTE,
      Role.BRUXA,
      Role.JUIZ,
      Role.DELEGADO,
      Role.FANTASMA,
      Role.CIDADAO,
    ],
  };

  /**
   * Distribui papéis aleatoriamente entre os jogadores
   */
  public assignRoles(game: Game): void {
    const playerCount = game.players.length;

    if (playerCount < 10 || playerCount > 12) {
      throw new Error('Número de jogadores deve ser entre 10 e 12');
    }

    const roles = this.getRolesForPlayerCount(playerCount);
    const shuffledRoles = this.shuffleArray([...roles]);

    game.players.forEach((player, index) => {
      player.role = shuffledRoles[index];
      player.team = this.getTeamForRole(shuffledRoles[index]) as any;
    });
  }

  /**
   * Obtém a lista de papéis para o número de jogadores
   */
  private getRolesForPlayerCount(count: number): Role[] {
    return RoleAssignmentService.ROLE_DISTRIBUTION[count] || [];
  }

  /**
   * Determina o time baseado no papel
   */
  private getTeamForRole(role: Role): 'VILLAINS' | 'CITIZENS' {
    const villainRoles = [Role.ASSASSINO, Role.LIDER_ASSASSINOS, Role.SUICIDA];
    return villainRoles.includes(role) ? 'VILLAINS' : 'CITIZENS';
  }

  /**
   * Embaralha um array usando o algoritmo Fisher-Yates
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Retorna os jogadores por papel
   */
  public getPlayersByRole(game: Game, role: Role): Player[] {
    return game.players.filter(p => p.role === role);
  }

  /**
   * Retorna todos os assassinos (incluindo líder)
   */
  public getAssassins(game: Game): Player[] {
    return game.players.filter(
      p => p.role === Role.ASSASSINO || p.role === Role.LIDER_ASSASSINOS
    );
  }

  /**
   * Verifica se um jogador é vilão
   */
  public isVillain(player: Player): boolean {
    return player.team === 'VILLAINS';
  }
}
