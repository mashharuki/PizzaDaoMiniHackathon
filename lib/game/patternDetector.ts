import { PizzaSlice } from '@/types/game';
import { SPECIAL_PATTERNS } from '@/utils/constants';

export const detectSpecialPatterns = (slices: PizzaSlice[]) => {
  const patterns = [];

  // Royal Straight Pizza Flush
  const firstFlavor = slices[0].flavor;
  if (firstFlavor && slices.every((slice) => slice.flavor === firstFlavor)) {
    patterns.push(SPECIAL_PATTERNS.ROYAL_STRAIGHT_PIZZA_FLUSH);
  }

  // Pizza Master
  let maxCombo = 0;
  let currentCombo = 1;
  for (let i = 0; i < slices.length; i++) {
    const currentSlice = slices[i];
    const nextSlice = slices[(i + 1) % slices.length];
    if (currentSlice.flavor && currentSlice.flavor === nextSlice.flavor) {
      currentCombo++;
    } else {
      maxCombo = Math.max(maxCombo, currentCombo);
      currentCombo = 1;
    }
  }
  maxCombo = Math.max(maxCombo, currentCombo);
  if (maxCombo >= 6) {
    patterns.push(SPECIAL_PATTERNS.PIZZA_MASTER);
  }

  // Balance Craftsman
  const flavorCounts: { [key: string]: number } = {};
  slices.forEach((slice) => {
    if (slice.flavor) {
      flavorCounts[slice.flavor] = (flavorCounts[slice.flavor] || 0) + 1;
    }
  });
  const uniqueFlavors = Object.keys(flavorCounts).length;
  const isBalanced = Object.values(flavorCounts).every((count) => count === 3);
  if (uniqueFlavors === 4 && isBalanced) {
    patterns.push(SPECIAL_PATTERNS.BALANCE_CRAFTSMAN);
  }

  // Combo King
  let adjacentBonusCount = 0;
  for (let i = 0; i < slices.length; i++) {
    const currentSlice = slices[i];
    const nextSlice = slices[(i + 1) % slices.length];
    if (currentSlice.flavor && currentSlice.flavor === nextSlice.flavor) {
      adjacentBonusCount++;
    }
  }
  if (adjacentBonusCount >= 5) {
    patterns.push(SPECIAL_PATTERNS.COMBO_KING);
  }

  // Rainbow Pizza
  if (uniqueFlavors === 6) {
    patterns.push(SPECIAL_PATTERNS.RAINBOW_PIZZA);
  }

  // Lucky Seven
  if (Object.values(flavorCounts).some((count) => count === 7)) {
    patterns.push(SPECIAL_PATTERNS.LUCKY_SEVEN);
  }

  return patterns;
};
