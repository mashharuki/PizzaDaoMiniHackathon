import React from 'react';
import { SpecialPattern } from '@/utils/constants';

interface SpecialPatternDisplayProps {
  patterns: SpecialPattern[];
}

const SpecialPatternDisplay: React.FC<SpecialPatternDisplayProps> = ({ patterns }) => {
  if (patterns.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-50">
      {patterns.map((pattern, index) => (
        <div
          key={index}
          className="m-2 rounded-lg bg-purple-600 p-4 text-center text-white shadow-lg"
        >
          <p className="text-2xl font-bold">
            {pattern.emoji} {pattern.title} {pattern.emoji}
          </p>
          <p className="text-lg">{pattern.description}</p>
          <p className="text-xl font-bold">Bonus: +{pattern.bonus}!</p>
        </div>
      ))}
    </div>
  );
};

export default SpecialPatternDisplay;
