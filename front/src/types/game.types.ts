export enum GamePhase {
  LOBBY = 'LOBBY',
  NIGHT = 'NIGHT',
  DAY = 'DAY',
  VOTING = 'VOTING',
  ENDED = 'ENDED',
}

export enum Role {
  ASSASSINO = 'ASSASSINO',
  SUICIDA = 'SUICIDA',
  DETETIVE = 'DETETIVE',
  MEDICO = 'MEDICO',
  VIDENTE = 'VIDENTE',
  BRUXA = 'BRUXA',
  JUIZ = 'JUIZ',
  CASAL = 'CASAL',
  PROSTITUTA = 'PROSTITUTA',
  INVESTIGADOR = 'INVESTIGADOR',
  PADRE = 'PADRE',
  ANJO = 'ANJO',
  CUPIDO = 'CUPIDO',
  PREFEITO = 'PREFEITO',
  JORNALISTA = 'JORNALISTA',
  ADVOGADO = 'ADVOGADO',
  CIDADAO = 'CIDADAO',
}

export interface Player {
  id: string;
  name: string;
  role?: Role;
  isAlive: boolean;
  isHost: boolean;
}

export interface Game {
  id: string;
  code: string;
  phase: GamePhase;
  players: Player[];
  hostId: string;
  maxPlayers: number;
  createdAt: Date;
}

export interface GameState {
  game: Game | null;
  currentPlayer: Player | null;
  isLoading: boolean;
  error: string | null;
}
