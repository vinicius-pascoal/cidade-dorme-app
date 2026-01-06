export enum Role {
  // Vilões
  ASSASSINO = 'ASSASSINO',
  LIDER_ASSASSINOS = 'LIDER_ASSASSINOS',
  SUICIDA = 'SUICIDA',

  // Cidadãos Especiais
  DETETIVE = 'DETETIVE',
  VIDENTE = 'VIDENTE',
  MEDICO = 'MEDICO',
  BRUXA = 'BRUXA',
  JUIZ = 'JUIZ',
  DELEGADO = 'DELEGADO',
  FANTASMA = 'FANTASMA',

  // Cidadão Comum
  CIDADAO = 'CIDADAO',
}

export enum Team {
  VILLAINS = 'VILLAINS',
  CITIZENS = 'CITIZENS',
}

export enum GamePhase {
  LOBBY = 'LOBBY',
  NIGHT = 'NIGHT',
  DAY_DISCUSSION = 'DAY_DISCUSSION',
  DAY_VOTING = 'DAY_VOTING',
  ENDED = 'ENDED',
}

export enum GameStatus {
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export enum NightActionType {
  ASSASSIN_KILL = 'ASSASSIN_KILL',
  DOCTOR_SAVE = 'DOCTOR_SAVE',
  DETECTIVE_INVESTIGATE = 'DETECTIVE_INVESTIGATE',
  SEER_REVEAL = 'SEER_REVEAL',
  WITCH_HEAL = 'WITCH_HEAL',
  WITCH_KILL = 'WITCH_KILL',
}

export interface Player {
  id: string;
  name: string;
  role?: Role;
  team?: Team;
  isAlive: boolean;
  isHost: boolean;
  votedFor?: string | null;
  protectedByDoctor?: boolean;
}

export interface WitchPotions {
  hasHealPotion: boolean;
  hasKillPotion: boolean;
}

export interface NightAction {
  playerId: string;
  actionType: NightActionType;
  targetId?: string;
  timestamp: Date;
}

export interface NightResult {
  killedByAssassins?: string | null;
  savedByDoctor?: string | null;
  killedByWitch?: string | null;
  healedByWitch?: string | null;
  finalDeaths: string[];
  detectiveResult?: {
    targetId: string;
    isVillain: boolean;
  };
  seerResult?: {
    targetId: string;
    role: Role;
  };
}

export interface VotingResult {
  votes: Map<string, string[]>; // targetId -> [voterId]
  eliminated?: string | null;
  isTie: boolean;
  judgeDecision?: string | null;
}

export interface GameConfig {
  minPlayers: number;
  maxPlayers: number;
  roles: {
    [key: number]: Role[]; // número de jogadores -> lista de papéis
  };
}

export interface Game {
  id: string;
  code: string;
  hostId: string;
  players: Player[];
  status: GameStatus;
  phase: GamePhase;
  round: number;
  nightActions: NightAction[];
  nightResults: NightResult[];
  votingHistory: VotingResult[];
  witchPotions: WitchPotions;
  currentVotes: Map<string, string>; // voterId -> targetId
  winner?: Team | 'SUICIDA' | null;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export interface InvestigationResult {
  playerId: string;
  targetId: string;
  result: boolean | Role; // boolean para detetive, Role para vidente
}

export interface RoleConfig {
  role: Role;
  team: Team;
  canActAtNight: boolean;
  actionType?: NightActionType;
  description: string;
}

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  [Role.ASSASSINO]: {
    role: Role.ASSASSINO,
    team: Team.VILLAINS,
    canActAtNight: true,
    actionType: NightActionType.ASSASSIN_KILL,
    description: 'Mata um jogador durante a noite',
  },
  [Role.LIDER_ASSASSINOS]: {
    role: Role.LIDER_ASSASSINOS,
    team: Team.VILLAINS,
    canActAtNight: true,
    actionType: NightActionType.ASSASSIN_KILL,
    description: 'Líder dos assassinos com voto de desempate',
  },
  [Role.SUICIDA]: {
    role: Role.SUICIDA,
    team: Team.VILLAINS,
    canActAtNight: false,
    description: 'Vence se for eliminado por votação durante o dia',
  },
  [Role.DETETIVE]: {
    role: Role.DETETIVE,
    team: Team.CITIZENS,
    canActAtNight: true,
    actionType: NightActionType.DETECTIVE_INVESTIGATE,
    description: 'Investiga se um jogador é vilão ou não',
  },
  [Role.VIDENTE]: {
    role: Role.VIDENTE,
    team: Team.CITIZENS,
    canActAtNight: true,
    actionType: NightActionType.SEER_REVEAL,
    description: 'Descobre o papel exato de um jogador',
  },
  [Role.MEDICO]: {
    role: Role.MEDICO,
    team: Team.CITIZENS,
    canActAtNight: true,
    actionType: NightActionType.DOCTOR_SAVE,
    description: 'Salva um jogador da morte durante a noite',
  },
  [Role.BRUXA]: {
    role: Role.BRUXA,
    team: Team.CITIZENS,
    canActAtNight: true,
    description: 'Possui uma poção de cura e uma de morte',
  },
  [Role.JUIZ]: {
    role: Role.JUIZ,
    team: Team.CITIZENS,
    canActAtNight: false,
    description: 'Decide o eliminado em caso de empate na votação',
  },
  [Role.DELEGADO]: {
    role: Role.DELEGADO,
    team: Team.CITIZENS,
    canActAtNight: false,
    description: 'Seu voto vale por dois',
  },
  [Role.FANTASMA]: {
    role: Role.FANTASMA,
    team: Team.CITIZENS,
    canActAtNight: false,
    description: 'Após morrer, pode ajudar com gestos',
  },
  [Role.CIDADAO]: {
    role: Role.CIDADAO,
    team: Team.CITIZENS,
    canActAtNight: false,
    description: 'Cidadão comum sem habilidades especiais',
  },
};
