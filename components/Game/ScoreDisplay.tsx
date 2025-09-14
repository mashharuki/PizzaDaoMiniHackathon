import React, { useEffect, useState } from 'react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      if (displayScore < score) {
        setDisplayScore(Math.min(displayScore + Math.ceil((score - displayScore) / 20), score));
      }
    });
    return () => cancelAnimationFrame(animation);
  }, [displayScore, score]);

  return <p>Score: {displayScore}</p>;
};

export default ScoreDisplay;
