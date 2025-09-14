import { SpecialPattern } from '@/utils/constants';

export interface GameState {
  pizzaSlices: PizzaSlice[];
  currentScore: number;
  gameStatus: 'idle' | 'playing' | 'completed';
  isSpinning: boolean;
  rank: 'diamond' | 'gold' | 'silver' | 'bronze' | null;
  specialPatterns: SpecialPattern[];
}

export interface PizzaSlice {
  id: number;
  flavor: PizzaFlavor | null;
  position: number; // 0-11 (12切れ)
}

export type PizzaFlavor = 'margherita' | 'pepperoni' | 'mushroom' | 'hawaiian' | 'veggie' | 'meat';

export enum GameErrorType {
  WALLET_CONNECTION_FAILED = 'WALLET_CONNECTION_FAILED',
  NETWORK_MISMATCH = 'NETWORK_MISMATCH',
  NFT_MINT_FAILED = 'NFT_MINT_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  GAME_STATE_ERROR = 'GAME_STATE_ERROR',
}

export interface GameError {
  type: GameErrorType;
  message: string;
  details?: any;
}
