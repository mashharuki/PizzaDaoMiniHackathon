'use client';

import { PizzaBoard, SpecialPatternDisplay, StatusPanel } from '@/components/Game';
import { TransactionCard } from '@/components/TransactionCard';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Header } from '@/components/common/Header';
import { useGame } from '@/lib/game/gameState';
import { GameErrorType } from '@/types/game';
import { PIZZA_DAO_MINI_HACKATHON_ABI } from '@/utils/abis/PizzaDaoMiniHackathon';
import { PIZZA_DAO_MINI_HACKATHON_ADDRESS } from '@/utils/constants';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { TransactionError } from '@coinbase/onchainkit/transaction';
import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Home() {
  // MiniKit のコンテキスト（フレーム準備完了フラグやクライアント状態）
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { gameState, highScore, error, startGame, selectSlice, resetGame, setError, clearError } =
    useGame();
  const { address, isConnected } = useAccount();
  const mainRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(320);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Farcaster Mini App: hide splash screen once content is ready
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await sdk.actions.ready();
      } catch (e) {
        // noop: outside Farcaster environment this can be ignored
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setBoardSize(Math.min(window.innerWidth - 48, 320));
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calls = useMemo(() => {
    if (!address || gameState.gameStatus !== 'completed' || !gameState.rank) {
      return [];
    }
    const metadataURI = `${gameState.rank}`;
    return [
      {
        address: PIZZA_DAO_MINI_HACKATHON_ADDRESS as `0x${string}`,
        abi: PIZZA_DAO_MINI_HACKATHON_ABI,
        functionName: 'safeMint',
        args: [address, metadataURI],
      },
    ];
  }, [address, gameState.gameStatus, gameState.rank]);

  const handleTransactionError = (err: TransactionError) => {
    setError({
      type: GameErrorType.NFT_MINT_FAILED,
      message: 'Failed to mint NFT.',
      details: err.message,
    });
  };

  return (
    <main
      ref={mainRef}
      className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24"
    >
      <Header />
      <ErrorDisplay error={error} onDismiss={clearError} />
      <h1 className="mb-8 text-4xl font-bold">Pizza Roulette Game</h1>
      {isConnected ? (
        <>
          <div className="relative">
            <PizzaBoard
              slices={gameState.pizzaSlices}
              isSpinning={gameState.isSpinning}
              onSliceClick={selectSlice}
              width={boardSize}
              height={boardSize}
            />
            {gameState.gameStatus === 'completed' && (
              <SpecialPatternDisplay patterns={gameState.specialPatterns} />
            )}
          </div>
          <div className="mt-8">
            {gameState.gameStatus === 'idle' && (
              <button onClick={startGame} className="rounded bg-blue-500 px-4 py-2 text-white">
                Start Game
              </button>
            )}
            {gameState.gameStatus === 'completed' && (
              <>
                <TransactionCard calls={calls} onError={handleTransactionError} />
                <button
                  onClick={resetGame}
                  className="mt-4 rounded bg-green-500 px-4 py-2 text-white"
                >
                  Play Again
                </button>
              </>
            )}
          </div>
          <StatusPanel
            score={gameState.currentScore}
            highScore={highScore}
            status={gameState.gameStatus}
            rank={gameState.rank}
          />
        </>
      ) : (
        <p className="text-yellow-400">Connect your wallet to play the game.</p>
      )}
    </main>
  );
}
