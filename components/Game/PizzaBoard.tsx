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
  margherita: '#F0E68C', // 淡い黄色 (チーズ)
  pepperoni: '#CD5C5C',  // 赤茶色 (ペパロニ)
  mushroom: '#D2B48C',   // 薄茶色 (マッシュルーム)
  hawaiian: '#FFD700',   // ゴールド (パイナップル)
  veggie: '#9ACD32',     // 黄緑色 (野菜)
  meat: '#8B4513',       // 濃い茶色 (肉)
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

  const renderToppings = (flavor: PizzaFlavor, center: number, radius: number, index: number) => {
    const toppings: JSX.Element[] = [];
    const sliceAngle = 30; // Each slice is 30 degrees
    const currentAngle = (index * sliceAngle + sliceAngle / 2) * Math.PI / 180; // Center of the slice

    const toppingRadius = radius * 0.1; // Adjust topping size relative to pizza radius

    // Calculate a position for the topping within the slice
    const toppingX = center + (radius * 0.6) * Math.cos(currentAngle);
    const toppingY = center + (radius * 0.6) * Math.sin(currentAngle);

    switch (flavor) {
      case 'pepperoni':
        // Add small red circles for pepperoni
        toppings.push(
          <circle
            key={`topping-${index}-1`}
            cx={toppingX}
            cy={toppingY}
            r={toppingRadius}
            fill="#B22222" // Dark red for pepperoni
          />
        );
        break;
      case 'mushroom':
        // Add small brown ovals for mushrooms
        toppings.push(
          <ellipse
            key={`topping-${index}-1`}
            cx={toppingX}
            cy={toppingY}
            rx={toppingRadius * 1.2}
            ry={toppingRadius * 0.8}
            fill="#8B4513" // Brown for mushroom
            transform={`rotate(${currentAngle * 180 / Math.PI} ${toppingX} ${toppingY})`}
          />
        );
        break;
      case 'hawaiian':
        // Add small yellow triangles for pineapple
        toppings.push(
          <polygon
            key={`topping-${index}-1`}
            points={`${toppingX},${toppingY - toppingRadius} ${toppingX - toppingRadius * 0.866},${toppingY + toppingRadius * 0.5} ${toppingX + toppingRadius * 0.866},${toppingY + toppingRadius * 0.5}`}
            fill="#FFD700" // Gold for pineapple
          />
        );
        break;
      case 'veggie':
        // Add small green and red shapes for various veggies
        toppings.push(
          <rect
            key={`topping-${index}-1`}
            x={toppingX - toppingRadius / 2}
            y={toppingY - toppingRadius / 2}
            width={toppingRadius}
            height={toppingRadius}
            fill="#008000" // Green for bell pepper
            transform={`rotate(${currentAngle * 180 / Math.PI} ${toppingX} ${toppingY})`}
          />
        );
        toppings.push(
          <circle
            key={`topping-${index}-2`}
            cx={toppingX + toppingRadius}
            cy={toppingY + toppingRadius}
            r={toppingRadius * 0.7}
            fill="#FF0000" // Red for tomato
          />
        );
        break;
      case 'meat':
        // Add small dark brown irregular shapes for meat
        toppings.push(
          <path
            key={`topping-${index}-1`}
            d={`M${toppingX},${toppingY - toppingRadius} Q${toppingX + toppingRadius},${toppingY - toppingRadius * 0.5} ${toppingX + toppingRadius * 0.5},${toppingY + toppingRadius} Q${toppingX - toppingRadius},${toppingY + toppingRadius * 0.5} ${toppingX},${toppingY - toppingRadius} Z`}
            fill="#5C4033" // Dark brown for meat
          />
        );
        break;
      default:
        // Margherita has no specific toppings to draw
        break;
    }
    return toppings;
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g className={isSpinning ? 'spinning' : ''} style={{ transformOrigin: 'center' }}>
        {slices.map((slice, index) => (
          <React.Fragment key={slice.id}>
            <path
              d={getSlicePath(index)}
              fill={slice.flavor ? PIZZA_COLORS[slice.flavor] : '#E0E0E0'}
              stroke="#FFFFFF"
              strokeWidth="2"
              onClick={() => onSliceClick(slice.id)}
              style={{ cursor: 'pointer' }}
            />
            {slice.flavor && renderToppings(slice.flavor, center, radius, index)}
          </React.Fragment>
        ))}
      </g>
    </svg>
  );
};

export default PizzaBoard;
