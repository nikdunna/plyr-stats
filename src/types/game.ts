export interface Player {
  id: string;
  name: string;
  imageUrl: string;
  position: string;
}

export interface GameAction {
  type: 'spike' | 'pass' | 'block' | 'serve' | 'dig' | 'set' | 'kill' | 'error';
  timestamp: Date;
  playerId: string;
}

export interface GameState {
  currentSet: number;
  players: Player[];
  actions: GameAction[];
} 