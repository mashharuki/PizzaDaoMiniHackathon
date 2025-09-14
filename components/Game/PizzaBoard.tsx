import React from 'react';
import { PizzaSlice, PizzaFlavor } from '@/types/game';

interface PizzaBoardProps {
  slices: PizzaSlice[];
  isSpinning: boolean;
  onSliceClick: (sliceId: number) => void;
  width: number;
  height: number;
}

// 具材オーバーレイ用の色（薄い色味で風味を示す）
const FLAVOR_OVERLAYS: Record<PizzaFlavor, string> = {
  margherita: '#d43c2f',
  pepperoni: '#9f1e1e',
  mushroom: '#8b6f47',
  hawaiian: '#ffcc4d',
  veggie: '#2f8f3a',
  meat: '#7f3b1e',
};

// 軽量なシード付き乱数（決定的）
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashFlavor(flavor: PizzaFlavor): number {
  let h = 0;
  for (let i = 0; i < flavor.length; i++) h = (h * 31 + flavor.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

function randBetween(rng: () => number, min: number, max: number) {
  return min + (max - min) * rng();
}

const PizzaBoard: React.FC<PizzaBoardProps> = ({
  slices,
  isSpinning,
  onSliceClick,
  width,
  height,
}) => {
  const radius = Math.min(width, height) / 2 - 10;
  const center = Math.min(width, height) / 2;

  const getSlicePath = (index: number) => {
    const angle = 30; // 360 / 12
    const startAngle = index * angle;
    const endAngle = startAngle + angle;

    const start = {
      x: center + radius * Math.cos((startAngle * Math.PI) / 180),
      y: center + radius * Math.sin((startAngle * Math.PI) / 180),
    };
    const end = {
      x: center + radius * Math.cos((endAngle * Math.PI) / 180),
      y: center + radius * Math.sin((endAngle * Math.PI) / 180),
    };

    return `M${center},${center} L${start.x},${start.y} A${radius},${radius} 0 0,1 ${end.x},${end.y} Z`;
  };

  const renderToppings = (flavor: PizzaFlavor, center: number, radius: number, index: number) => {
    const toppings: JSX.Element[] = [];
    const sliceAngle = 30;
    const startAngle = (index * sliceAngle * Math.PI) / 180;
    const endAngle = ((index + 1) * sliceAngle * Math.PI) / 180;

    const seed = (index + 1) * 1009 + hashFlavor(flavor);
    const rng = mulberry32(seed);

    // スライス領域内のランダム点（内外半径を指定）
    const randomPointInSlice = (innerRatio: number, outerRatio: number) => {
      const a = startAngle + (endAngle - startAngle) * rng();
      const r = radius * (innerRatio + (outerRatio - innerRatio) * Math.sqrt(rng()));
      const x = center + r * Math.cos(a);
      const y = center + r * Math.sin(a);
      return { x, y, a };
    };

    // 汎用の回転角
    const randDeg = () => randBetween(rng, -60, 60);

    const pushPepperoni = (count: number) => {
      for (let i = 0; i < count; i++) {
        const { x, y } = randomPointInSlice(0.35, 0.85);
        const r = randBetween(rng, radius * 0.045, radius * 0.065);
        toppings.push(
          <circle
            key={`pep-${index}-${i}`}
            cx={x}
            cy={y}
            r={r}
            fill="url(#pepperoniGrad)"
            stroke="#7a1515"
            strokeWidth={Math.max(1, r * 0.15)}
          />
        );
      }
    };

    const pushMushroom = (count: number) => {
      for (let i = 0; i < count; i++) {
        const { x, y } = randomPointInSlice(0.30, 0.80);
        const rx = randBetween(rng, radius * 0.05, radius * 0.07);
        const ry = rx * randBetween(rng, 0.65, 0.85);
        const rot = randDeg();
        // cap
        toppings.push(
          <ellipse
            key={`mcap-${index}-${i}`}
            cx={x}
            cy={y}
            rx={rx}
            ry={ry}
            fill="#cbb38a"
            stroke="#8b6f47"
            strokeWidth={Math.max(1, rx * 0.12)}
            transform={`rotate(${rot} ${x} ${y})`}
          />
        );
        // stem
        const stemW = rx * 0.35;
        const stemH = ry * 0.9;
        toppings.push(
          <rect
            key={`mst-${index}-${i}`}
            x={x - stemW / 2}
            y={y}
            width={stemW}
            height={stemH}
            fill="#d9c8a3"
            rx={stemW * 0.25}
            transform={`rotate(${rot} ${x} ${y})`}
          />
        );
      }
    };

    const pushPineappleHam = (count: number) => {
      for (let i = 0; i < count; i++) {
        const { x, y } = randomPointInSlice(0.35, 0.85);
        const size = randBetween(rng, radius * 0.05, radius * 0.07);
        const rot = randDeg();
        // pineapple wedge (triangle)
        const p1 = `${x},${y - size}`;
        const p2 = `${x - size * 0.9},${y + size * 0.6}`;
        const p3 = `${x + size * 0.9},${y + size * 0.6}`;
        toppings.push(
          <polygon
            key={`pine-${index}-${i}`}
            points={`${p1} ${p2} ${p3}`}
            fill="url(#pineappleGrad)"
            stroke="#e2b42d"
            strokeWidth={Math.max(1, size * 0.1)}
            transform={`rotate(${rot} ${x} ${y})`}
          />
        );
        // ham strip
        const w = size * 1.1;
        const h = size * 0.35;
        toppings.push(
          <rect
            key={`ham-${index}-${i}`}
            x={x - w / 2}
            y={y - h / 2}
            width={w}
            height={h}
            rx={h * 0.4}
            fill="#ef9aa9"
            stroke="#d37b89"
            strokeWidth={Math.max(1, h * 0.2)}
            transform={`rotate(${rot + 90} ${x} ${y})`}
          />
        );
      }
    };

    const pushVeggie = (count: number) => {
      for (let i = 0; i < count; i++) {
        const { x, y } = randomPointInSlice(0.28, 0.88);
        const base = randBetween(rng, radius * 0.035, radius * 0.06);
        const rot = randDeg();
        // bell pepper ring (green)
        toppings.push(
          <ellipse
            key={`pepper-${index}-${i}`}
            cx={x}
            cy={y}
            rx={base * 1.2}
            ry={base * 0.9}
            fill="none"
            stroke="#2e8b3c"
            strokeWidth={Math.max(1.2, base * 0.35)}
            transform={`rotate(${rot} ${x} ${y})`}
          />
        );
        // onion ring (purple)
        toppings.push(
          <ellipse
            key={`onion-${index}-${i}`}
            cx={x + base * 0.8}
            cy={y - base * 0.5}
            rx={base}
            ry={base * 0.7}
            fill="none"
            stroke="#a55eea"
            strokeWidth={Math.max(1, base * 0.25)}
            transform={`rotate(${rot * 0.5} ${x + base * 0.8} ${y - base * 0.5})`}
          />
        );
        // olive (black ring)
        toppings.push(
          <circle
            key={`olive-${index}-${i}`}
            cx={x - base}
            cy={y + base * 0.6}
            r={base * 0.45}
            fill="#000"
          />
        );
        toppings.push(
          <circle
            key={`olive-hole-${index}-${i}`}
            cx={x - base}
            cy={y + base * 0.6}
            r={base * 0.22}
            fill="url(#cheeseGrad)"
          />
        );
      }
    };

    const pushMeat = (count: number) => {
      for (let i = 0; i < count; i++) {
        const { x, y } = randomPointInSlice(0.32, 0.85);
        const s = randBetween(rng, radius * 0.05, radius * 0.075);
        const rot = randDeg();
        // irregular blob using cubic curves
        const d = `M ${x - s * 0.6},${y}
          C ${x - s},${y - s * 0.6} ${x - s * 0.2},${y - s} ${x + s * 0.2},${y - s * 0.6}
          C ${x + s * 0.9},${y - s * 0.1} ${x + s * 0.7},${y + s * 0.6} ${x + s * 0.1},${y + s * 0.6}
          C ${x - s * 0.4},${y + s * 0.6} ${x - s * 0.3},${y + s * 0.2} ${x - s * 0.6},${y} Z`;
        toppings.push(
          <path
            key={`meat-${index}-${i}`}
            d={d}
            fill="#6b3a1f"
            stroke="#522a15"
            strokeWidth={Math.max(1, s * 0.12)}
            transform={`rotate(${rot} ${x} ${y})`}
          />
        );
      }
    };

    const pushMargherita = (count: number) => {
      for (let i = 0; i < count; i++) {
        const { x, y } = randomPointInSlice(0.28, 0.85);
        const r = randBetween(rng, radius * 0.045, radius * 0.06);
        // tomato slice (ring)
        toppings.push(
          <circle
            key={`tom-${index}-${i}`}
            cx={x}
            cy={y}
            r={r}
            fill="url(#tomatoGrad)"
            stroke="#8b0000"
            strokeWidth={Math.max(1, r * 0.18)}
          />
        );
        toppings.push(
          <circle key={`tom-hole-${index}-${i}`} cx={x} cy={y} r={r * 0.55} fill="url(#cheeseGrad)" />
        );
        // basil leaf
        const leafL = r * 1.3;
        const rot = randDeg();
        const leafPath = `M ${x - leafL * 0.5},${y}
          Q ${x},${y - leafL * 0.45} ${x + leafL * 0.5},${y}
          Q ${x},${y + leafL * 0.45} ${x - leafL * 0.5},${y} Z`;
        toppings.push(
          <path
            key={`basil-${index}-${i}`}
            d={leafPath}
            fill="#2f8f3a"
            stroke="#246d2c"
            strokeWidth={Math.max(1, leafL * 0.08)}
            transform={`rotate(${rot} ${x} ${y})`}
          />
        );
      }
    };

    switch (flavor) {
      case 'pepperoni':
        pushPepperoni(4 + Math.floor(rng() * 3));
        break;
      case 'mushroom':
        pushMushroom(3 + Math.floor(rng() * 2));
        break;
      case 'hawaiian':
        pushPineappleHam(3 + Math.floor(rng() * 2));
        break;
      case 'veggie':
        pushVeggie(3 + Math.floor(rng() * 2));
        break;
      case 'meat':
        pushMeat(3 + Math.floor(rng() * 3));
        break;
      case 'margherita':
      default:
        pushMargherita(2 + Math.floor(rng() * 2));
        break;
    }
    return toppings;
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        {/* チーズの放射グラデーション */}
        <radialGradient id="cheeseGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#f7e9b5" />
          <stop offset="55%" stopColor="#f0de97" />
          <stop offset="100%" stopColor="#e4c172" />
        </radialGradient>
        {/* トマト・ペパロニなど */}
        <radialGradient id="tomatoGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#e63946" />
        </radialGradient>
        <radialGradient id="pepperoniGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c0392b" />
          <stop offset="100%" stopColor="#8e1b0e" />
        </radialGradient>
        <linearGradient id="pineappleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe98a" />
          <stop offset="100%" stopColor="#f4c542" />
        </linearGradient>
        {/* スライスごとのクリップパス */}
        {slices.map((_, i) => (
          <clipPath id={`slice-clip-${i}`} key={`clip-${i}`}>
            <path d={getSlicePath(i)} />
          </clipPath>
        ))}
      </defs>

      <g className={isSpinning ? 'spinning' : ''} style={{ transformOrigin: 'center' }}>
        {slices.map((slice, index) => {
          const pathD = getSlicePath(index);
          return (
            <React.Fragment key={slice.id}>
              {/* スライスのベース（チーズ） */}
              <path
                d={pathD}
                fill="url(#cheeseGrad)"
                stroke="#fff"
                strokeWidth="2"
                onClick={() => onSliceClick(slice.id)}
                style={{ cursor: 'pointer' }}
              />

              {/* フレーバーの薄い色味オーバーレイ */}
              {slice.flavor && (
                <path
                  d={pathD}
                  fill={FLAVOR_OVERLAYS[slice.flavor]}
                  fillOpacity={0.12}
                />
              )}

              {/* トッピングはスライスのクリップ内に描画 */}
              {slice.flavor && (
                <g clipPath={`url(#slice-clip-${index})`}>
                  {renderToppings(slice.flavor, center, radius, index)}
                </g>
              )}
            </React.Fragment>
          );
        })}
      </g>
    </svg>
  );
};

export default PizzaBoard;
