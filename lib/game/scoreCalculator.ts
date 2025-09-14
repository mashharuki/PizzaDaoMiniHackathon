import { PizzaSlice } from '@/types/game';

const BASE_POINTS = 10;
const ADJACENT_BONUS = 20;
const PERFECT_BONUS = 500;

export const calculateScore = (slices: PizzaSlice[]): number => {
  let score = 0;
  if (slices.every((slice) => slice.flavor !== null)) {
    // Base points
    score += slices.length * BASE_POINTS;

    // Adjacent bonus
    for (let i = 0; i < slices.length; i++) {
      const currentSlice = slices[i];
      const nextSlice = slices[(i + 1) % slices.length];
      if (currentSlice.flavor && currentSlice.flavor === nextSlice.flavor) {
        score += ADJACENT_BONUS;
      }
    }

    // Combo bonus
    let comboCount = 1;
    for (let i = 0; i < slices.length; i++) {
      const currentSlice = slices[i];
      const nextSlice = slices[(i + 1) % slices.length];
      if (currentSlice.flavor && currentSlice.flavor === nextSlice.flavor) {
        comboCount++;
      } else {
        if (comboCount >= 3) {
          score += comboCount * 10;
        }
        comboCount = 1;
      }
    }
    if (comboCount >= 3) {
      score += comboCount * 10;
    }

    // Perfect bonus
    const firstFlavor = slices[0].flavor;
    if (firstFlavor && slices.every((slice) => slice.flavor === firstFlavor)) {
      score += PERFECT_BONUS;
    }
  }

  return score;
};

export const determineRank = (score: number): 'diamond' | 'gold' | 'silver' | 'bronze' => {
  // Eased thresholds to make ranking more attainable
  if (score >= 700) return 'diamond';
  if (score >= 450) return 'gold';
  if (score >= 250) return 'silver';
  return 'bronze';
};
