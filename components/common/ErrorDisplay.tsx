import React from 'react';
import { GameError } from '@/types/game';

interface ErrorDisplayProps {
  error: GameError | null;
  onRetry?: () => void;
  onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, onDismiss }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-75">
      <div className="rounded-lg bg-red-500 p-6 text-center text-white shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Error</h2>
        <p className="mb-4">{error.message}</p>
        <div className="flex justify-center space-x-4">
          {onRetry && (
            <button onClick={onRetry} className="rounded bg-yellow-500 px-4 py-2 text-black">
              Retry
            </button>
          )}
          <button onClick={onDismiss} className="rounded bg-gray-300 px-4 py-2 text-black">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
