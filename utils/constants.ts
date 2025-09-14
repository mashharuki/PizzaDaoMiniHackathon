export const PIZZA_DAO_MINI_HACKATHON_ADDRESS = '0x52D89afa637AEF34A6b680c77B366F3c854485d4';

export const SPECIAL_PATTERNS = {
  ROYAL_STRAIGHT_PIZZA_FLUSH: {
    name: 'royal_straight_pizza_flush',
    title: 'ロイヤルストレートピザフラッシュ！',
    description: '全て同じ味で完璧なピザを完成！まさに伝説のピザ職人！',
    bonus: 500,
    animation: 'rainbow-explosion',
    emoji: '👑🍕✨',
  },
  PIZZA_MASTER: {
    name: 'pizza_master',
    title: 'ピザマスター',
    description: '6切れ以上の連続同味！あなたはピザの達人です！',
    bonus: 200,
    animation: 'golden-sparkle',
    emoji: '🎖️🍕',
  },
  BALANCE_CRAFTSMAN: {
    name: 'balance_craftsman',
    title: 'バランス職人',
    description: '4種類の味を均等配置！完璧なバランス感覚！',
    bonus: 150,
    animation: 'harmony-wave',
    emoji: '⚖️🍕',
  },
  COMBO_KING: {
    name: 'combo_king',
    title: 'コンボキング',
    description: '隣接ボーナス5回達成！連続技の王者！',
    bonus: 100,
    animation: 'combo-flash',
    emoji: '🔥🍕',
  },
  RAINBOW_PIZZA: {
    name: 'rainbow_pizza',
    title: 'レインボーピザ',
    description: '全6種類の味を使用！多様性の美しさ！',
    bonus: 120,
    animation: 'rainbow-spin',
    emoji: '🌈🍕',
  },
  LUCKY_SEVEN: {
    name: 'lucky_seven',
    title: 'ラッキーセブン',
    description: '7切れが同じ味！幸運のピザ！',
    bonus: 77,
    animation: 'lucky-stars',
    emoji: '🍀🍕',
  },
} as const;

export type SpecialPattern = (typeof SPECIAL_PATTERNS)[keyof typeof SPECIAL_PATTERNS];
