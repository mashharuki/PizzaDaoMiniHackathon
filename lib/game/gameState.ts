import { useState, useCallback, useEffect } from 'react';
import { GameState, PizzaSlice, PizzaFlavor, GameError } from '@/types/game';
import { calculateScore, determineRank } from './scoreCalculator';
import { detectSpecialPatterns } from './patternDetector';
import { SpecialPattern } from '@/utils/constants';

const initialPizzaSlices: PizzaSlice[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  flavor: null,
  position: i,
}));

export const useGame = () => {
  const [highScore, setHighScore] = useState(0);
  const [error, setError] = useState<GameError | null>(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const [gameState, setGameState] = useState<GameState>({
    pizzaSlices: initialPizzaSlices,
    currentScore: 0,
    gameStatus: 'idle',
    isSpinning: false,
    rank: null,
    specialPatterns: [],
  });

  useEffect(() => {
    if (gameState.gameStatus === 'completed' && gameState.currentScore > highScore) {
      setHighScore(gameState.currentScore);
      localStorage.setItem('highScore', gameState.currentScore.toString());
    }
  }, [gameState.gameStatus, gameState.currentScore, highScore]);

  const startGame = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      gameStatus: 'playing',
      isSpinning: true,
    }));
  }, []);

  const selectSlice = useCallback((sliceId: number) => {
    setGameState((prevState) => {
      if (prevState.gameStatus !== 'playing' || !prevState.isSpinning) {
        return prevState;
      }

      const flavors: PizzaFlavor[] = [
        'margherita',
        'pepperoni',
        'mushroom',
        'hawaiian',
        'veggie',
        'meat',
      ];
      const randomFlavor = flavors[Math.floor(Math.random() * flavors.length)];

      const newPizzaSlices = prevState.pizzaSlices.map((slice) =>
        slice.id === sliceId ? { ...slice, flavor: randomFlavor } : slice
      );

      const isCompleted = newPizzaSlices.every((slice) => slice.flavor !== null);
      let newScore = prevState.currentScore;
      let newRank = null;
      let newSpecialPatterns: SpecialPattern[] = [];

      if (isCompleted) {
        newScore = calculateScore(newPizzaSlices);
        newSpecialPatterns = detectSpecialPatterns(newPizzaSlices);
        newSpecialPatterns.forEach((pattern) => {
          newScore += pattern.bonus;
        });
        newRank = determineRank(newScore);
      }

      return {
        ...prevState,
        pizzaSlices: newPizzaSlices,
        isSpinning: !isCompleted,
        gameStatus: isCompleted ? 'completed' : 'playing',
        currentScore: newScore,
        rank: newRank,
        specialPatterns: newSpecialPatterns,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      pizzaSlices: initialPizzaSlices,
      currentScore: 0,
      gameStatus: 'idle',
      isSpinning: false,
      rank: null,
      specialPatterns: [],
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    gameState,
    highScore,
    error,
    startGame,
    selectSlice,
    resetGame,
    setError,
    clearError,
  };
};
