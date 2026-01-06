import {
  Game,
  NightAction,
  NightActionType,
  NightResult,
  Role,
  Player,
} from '../types/game.types';
import { RoleAssignmentService } from './role-assignment.service';

export class NightActionService {
  private roleService: RoleAssignmentService;

  constructor() {
    this.roleService = new RoleAssignmentService();
  }

  /**
   * Registra uma ação noturna
   */
  public registerAction(game: Game, action: NightAction): void {
    // Valida se o jogador pode realizar essa ação
    const player = game.players.find(p => p.id === action.playerId);

    if (!player || !player.isAlive) {
      throw new Error('Jogador inválido ou morto');
    }

    // Valida se a ação é apropriada para o papel do jogador
    this.validateActionForRole(player, action.actionType);

    // Remove ação anterior do mesmo jogador (se existir)
    game.nightActions = game.nightActions.filter(
      a => a.playerId !== action.playerId || a.actionType !== action.actionType
    );

    // Adiciona nova ação
    game.nightActions.push({
      ...action,
      timestamp: new Date(),
    });
  }

  /**
   * Processa todas as ações noturnas na ordem correta
   */
  public processNightActions(game: Game): NightResult {
    const result: NightResult = {
      finalDeaths: [],
    };

    // 1. Assassinos escolhem alvo
    const assassinTarget = this.getAssassinTarget(game);
    if (assassinTarget) {
      result.killedByAssassins = assassinTarget;
    }

    // 2. Médico escolhe quem salvar
    const doctorSave = this.getDoctorSave(game);
    if (doctorSave) {
      result.savedByDoctor = doctorSave;
    }

    // 3. Detetive investiga
    const detectiveAction = game.nightActions.find(
      a => a.actionType === NightActionType.DETECTIVE_INVESTIGATE
    );
    if (detectiveAction && detectiveAction.targetId) {
      const target = game.players.find(p => p.id === detectiveAction.targetId);
      if (target) {
        result.detectiveResult = {
          targetId: target.id,
          isVillain: this.roleService.isVillain(target),
        };
      }
    }

    // 4. Vidente revela papel
    const seerAction = game.nightActions.find(
      a => a.actionType === NightActionType.SEER_REVEAL
    );
    if (seerAction && seerAction.targetId) {
      const target = game.players.find(p => p.id === seerAction.targetId);
      if (target && target.role) {
        result.seerResult = {
          targetId: target.id,
          role: target.role,
        };
      }
    }

    // 5. Bruxa usa poções
    const witchHeal = game.nightActions.find(
      a => a.actionType === NightActionType.WITCH_HEAL
    );
    const witchKill = game.nightActions.find(
      a => a.actionType === NightActionType.WITCH_KILL
    );

    if (witchHeal && game.witchPotions.hasHealPotion) {
      result.healedByWitch = assassinTarget || null;
      game.witchPotions.hasHealPotion = false;
    }

    if (witchKill && witchKill.targetId && game.witchPotions.hasKillPotion) {
      result.killedByWitch = witchKill.targetId;
      game.witchPotions.hasKillPotion = false;
    }

    // Determina mortes finais
    result.finalDeaths = this.calculateFinalDeaths(result);

    // Atualiza estado dos jogadores
    result.finalDeaths.forEach(playerId => {
      const player = game.players.find(p => p.id === playerId);
      if (player) {
        player.isAlive = false;
      }
    });

    // Salva resultado na história
    game.nightResults.push(result);

    return result;
  }

  /**
   * Determina o alvo dos assassinos (com lógica de líder)
   */
  private getAssassinTarget(game: Game): string | null {
    const assassinActions = game.nightActions.filter(
      a => a.actionType === NightActionType.ASSASSIN_KILL
    );

    if (assassinActions.length === 0) {
      return null;
    }

    // Se houver apenas uma escolha, retorna ela
    if (assassinActions.length === 1) {
      return assassinActions[0].targetId || null;
    }

    // Se houver múltiplas escolhas, verifica se o líder votou
    const leaderAction = assassinActions.find(a => {
      const player = game.players.find(p => p.id === a.playerId);
      return player?.role === Role.LIDER_ASSASSINOS;
    });

    // Líder tem voto de desempate
    if (leaderAction) {
      return leaderAction.targetId || null;
    }

    // Caso contrário, usa a primeira ação registrada
    return assassinActions[0].targetId || null;
  }

  /**
   * Obtém o alvo salvo pelo médico
   */
  private getDoctorSave(game: Game): string | null {
    const doctorAction = game.nightActions.find(
      a => a.actionType === NightActionType.DOCTOR_SAVE
    );
    return doctorAction?.targetId || null;
  }

  /**
   * Calcula as mortes finais considerando todas as ações
   */
  private calculateFinalDeaths(result: NightResult): string[] {
    const deaths: Set<string> = new Set();

    // Morte por assassinos
    if (result.killedByAssassins) {
      deaths.add(result.killedByAssassins);
    }

    // Morte por bruxa
    if (result.killedByWitch) {
      deaths.add(result.killedByWitch);
    }

    // Remove salvos pelo médico
    if (result.savedByDoctor && result.killedByAssassins === result.savedByDoctor) {
      deaths.delete(result.savedByDoctor);
    }

    // Remove curados pela bruxa
    if (result.healedByWitch && result.killedByAssassins === result.healedByWitch) {
      deaths.delete(result.healedByWitch);
    }

    return Array.from(deaths);
  }

  /**
   * Valida se a ação é apropriada para o papel
   */
  private validateActionForRole(player: Player, actionType: NightActionType): void {
    const validActions: Record<Role, NightActionType[]> = {
      [Role.ASSASSINO]: [NightActionType.ASSASSIN_KILL],
      [Role.LIDER_ASSASSINOS]: [NightActionType.ASSASSIN_KILL],
      [Role.MEDICO]: [NightActionType.DOCTOR_SAVE],
      [Role.DETETIVE]: [NightActionType.DETECTIVE_INVESTIGATE],
      [Role.VIDENTE]: [NightActionType.SEER_REVEAL],
      [Role.BRUXA]: [NightActionType.WITCH_HEAL, NightActionType.WITCH_KILL],
      [Role.SUICIDA]: [],
      [Role.JUIZ]: [],
      [Role.DELEGADO]: [],
      [Role.FANTASMA]: [],
      [Role.CIDADAO]: [],
    };

    const allowedActions = player.role ? validActions[player.role] : [];

    if (!allowedActions.includes(actionType)) {
      throw new Error(`Ação ${actionType} não permitida para o papel ${player.role}`);
    }
  }

  /**
   * Verifica se um jogador pode agir na fase noturna
   */
  public canPlayerActAtNight(player: Player): boolean {
    if (!player.role || !player.isAlive) {
      return false;
    }

    const nightRoles = [
      Role.ASSASSINO,
      Role.LIDER_ASSASSINOS,
      Role.MEDICO,
      Role.DETETIVE,
      Role.VIDENTE,
      Role.BRUXA,
    ];

    return nightRoles.includes(player.role);
  }

  /**
   * Retorna as ações disponíveis para um jogador
   */
  public getAvailableActionsForPlayer(game: Game, playerId: string): NightActionType[] {
    const player = game.players.find(p => p.id === playerId);

    if (!player || !player.role || !player.isAlive) {
      return [];
    }

    const actions: Record<Role, NightActionType[]> = {
      [Role.ASSASSINO]: [NightActionType.ASSASSIN_KILL],
      [Role.LIDER_ASSASSINOS]: [NightActionType.ASSASSIN_KILL],
      [Role.MEDICO]: [NightActionType.DOCTOR_SAVE],
      [Role.DETETIVE]: [NightActionType.DETECTIVE_INVESTIGATE],
      [Role.VIDENTE]: [NightActionType.SEER_REVEAL],
      [Role.BRUXA]: this.getWitchAvailableActions(game),
      [Role.SUICIDA]: [],
      [Role.JUIZ]: [],
      [Role.DELEGADO]: [],
      [Role.FANTASMA]: [],
      [Role.CIDADAO]: [],
    };

    return actions[player.role] || [];
  }

  /**
   * Retorna ações disponíveis para a bruxa baseado nas poções
   */
  private getWitchAvailableActions(game: Game): NightActionType[] {
    const actions: NightActionType[] = [];

    if (game.witchPotions.hasHealPotion) {
      actions.push(NightActionType.WITCH_HEAL);
    }

    if (game.witchPotions.hasKillPotion) {
      actions.push(NightActionType.WITCH_KILL);
    }

    return actions;
  }
}
