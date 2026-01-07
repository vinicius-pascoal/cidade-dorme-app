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

export enum Role {
  ASSASSINO = 'ASSASSINO',
  LIDER_ASSASSINOS = 'LIDER_ASSASSINOS',
  SUICIDA = 'SUICIDA',
  DETETIVE = 'DETETIVE',
  VIDENTE = 'VIDENTE',
  MEDICO = 'MEDICO',
  BRUXA = 'BRUXA',
  JUIZ = 'JUIZ',
  DELEGADO = 'DELEGADO',
  FANTASMA = 'FANTASMA',
  CIDADAO = 'CIDADAO',
}

export enum Team {
  VILLAINS = 'VILLAINS',
  CITIZENS = 'CITIZENS',
}

export interface Player {
  id: string;
  name: string;
  role?: Role;
  team?: Team;
  isAlive: boolean;
  isHost: boolean;
}

export interface Game {
  id: string;
  code: string;
  hostId?: string;
  players: Player[];
  status: GameStatus;
  phase: GamePhase;
  round: number;
  createdAt: string | Date;
  startedAt?: string | Date;
  endedAt?: string | Date;
  winner?: Team | 'SUICIDA' | null;
}

export interface GameState {
  game: Game | null;
  currentPlayerId: string | null;
  playerId?: string | null;
  isLoading: boolean;
  error: string | null;
}
