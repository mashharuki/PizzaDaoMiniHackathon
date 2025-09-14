import React from 'react';
import { PizzaSlice, PizzaFlavor } from '@/types/game';

interface PizzaBoardProps {
  slices: PizzaSlice[];
  isSpinning: boolean;
  onSliceClick: (sliceId: number) => void;
  width: number;
  height: number;
}

const PIZZA_COLORS: Record<PizzaFlavor, string> = {
  margherita: '#FF6B6B',
  pepperoni: '#FF8E53',
  mushroom: '#4ECDC4',
  hawaiian: '#FFE66D',
  veggie: '#95E1D3',
  meat: '#A8E6CF',
};

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

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g className={isSpinning ? 'spinning' : ''} style={{ transformOrigin: 'center' }}>
        {slices.map((slice, index) => (
          <path
            key={slice.id}
            d={getSlicePath(index)}
            fill={slice.flavor ? PIZZA_COLORS[slice.flavor] : '#E0E0E0'}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onSliceClick(slice.id)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </g>
    </svg>
  );
};

export default PizzaBoard;
