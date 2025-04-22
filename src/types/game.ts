export interface Player {
  id: string;
  name: string;
  imageUrl: string;
  position: string;
}

export type GameActionType = 
  | 'serve' | 'ace' | 'serve_error'
  | 'attack' | 'kill' | 'attack_error'
  | 'pass_0' | 'pass_1' | 'pass_2' | 'pass_3'
  | 'block_attempt' | 'block' | 'block_assist' | 'block_error'
  | 'set_attempt' | 'assist' | 'set_error'
  | 'dig_attempt' | 'dig' | 'dig_error';

export interface GameAction {
  type: GameActionType;
  timestamp: Date;
  playerId: string;
  setNumber: number;
  detail: string;
  homeScore: boolean;
  awayScore: boolean;
}

export type FeedActionType = 
  | GameActionType 
  | 'player_swap'
  | 'set_end'
  | 'game_end'
  | 'libero_switch';

export interface FeedAction {
  type: FeedActionType;
  timestamp: Date;
  playerId?: string;
  playerName?: string;
  details: string;
  setNumber: number;
}

export interface Stats {
  // Serving stats
  serveAttempts: number;
  aces: number;
  serveErrors: number;

  // Hitting stats
  attackAttempts: number;
  kills: number;
  attackErrors: number;

  // Passing stats
  zeroPasses: number;
  onePasses: number;
  twoPasses: number;
  threePasses: number;

  // Blocking stats
  blockAttempts: number;
  blocks: number;
  blockAssists: number;
  blockErrors: number;

  // Setting stats
  setAttempts: number;
  setAssists: number;
  setErrors: number;

  // Defense stats
  digs: number;
  digErrors: number;

  // Scoring stats
  pointsScored: number;
  pointsGiven: number;
  totalActions: number;
  actionDetails: {
    type: GameActionType;
    detail: string;
    timestamp: Date;
    setNumber: number;
  }[];
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  position: string;
  stats: Stats;
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