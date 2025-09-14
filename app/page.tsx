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
    //@ts-nocheck 
    (async () => {
      try {
        await sdk.actions.ready();
      } catch (e) {
        console.error(e)
      }
    })();
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
      className="relative z-[1] flex min-h-screen flex-col items-center justify-center p-4 sm:p-10"
    >
      <Header />
      <ErrorDisplay error={error} onDismiss={clearError} />
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight heading-pop drop-shadow-sm">
        Pizza Roulette Game
      </h1>
      {isConnected ? (
        <>
          <div className="glass-card relative w-full max-w-[720px] p-5 sm:p-8">
            <div className="relative flex w-full items-center justify-center">
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
            <div className="mt-6">
              <StatusPanel
                score={gameState.currentScore}
                highScore={highScore}
                status={gameState.gameStatus}
                rank={gameState.rank}
              />
            </div>
            <div className="mt-6 flex flex-col items-center">
              {gameState.gameStatus === 'idle' && (
                <button
                  onClick={startGame}
                  className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-[#FF5F6D] via-[#FFC371] to-[#42E695] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] focus:outline-none"
                >
                  <span className="relative z-10">Start Game</span>
                </button>
              )}
              {gameState.gameStatus === 'completed' && (
                <>
                  <TransactionCard calls={calls} onError={handleTransactionError} />
                  <button
                    onClick={resetGame}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#00D1FF] via-[#42E695] to-[#FFC371] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] focus:outline-none"
                  >
                    Play Again
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="glass-card px-4 py-3 text-sm text-[var(--app-foreground)]">
          Connect your wallet to play the game.
        </p>
      )}
    </main>
  );
}
