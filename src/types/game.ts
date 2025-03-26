export interface Player {
  id: string;
  name: string;
  imageUrl: string;
  position: string;
}

export type GameActionType = 'spike' | 'pass' | 'block' | 'serve' | 'dig' | 'set' | 'kill' | 'error';

export interface GameAction {
  type: GameActionType;
  timestamp: Date;
  playerId: string;
  setNumber: number;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  position: string;
  stats: {
    spikes: number;
    passes: number;
    blocks: number;
    serves: number;
    digs: number;
    sets: number;
    kills: number;
    errors: number;
  };
  totalActions: number;
}

export interface Set {
  setNumber: number;
  homeScore: number;
  opponentScore: number;
  playerStats: PlayerStats[];
  timestamp: string;
}

export interface Game {
  id: string;
  date: string;
  sets: Set[];
  currentSet: number;
  players: Player[];
  actions: GameAction[];
} 