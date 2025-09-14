import React, { useEffect, useState } from 'react';
import { GameState } from '@/types/game';

type Status = GameState['gameStatus'];
type Rank = NonNullable<GameState['rank']> | null;

interface StatusPanelProps {
  score: number;
  highScore: number;
  status: Status;
  rank: Rank;
}

const rankEmoji = (rank: Rank) => {
  switch (rank) {
    case 'diamond':
      return '💎';
    case 'gold':
      return '🥇';
    case 'silver':
      return '🥈';
    case 'bronze':
      return '🥉';
    default:
      return '—';
  }
};

const rankClasses = (rank: Rank) => {
  switch (rank) {
    case 'diamond':
      return 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.25)]';
    case 'gold':
      return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]';
    case 'silver':
      return 'bg-gradient-to-r from-zinc-300 to-slate-400 text-slate-900 shadow-[0_0_20px_rgba(148,163,184,0.25)]';
    case 'bronze':
      return 'bg-gradient-to-r from-orange-300 to-amber-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.25)]';
    default:
      return 'bg-zinc-700/50 text-zinc-200';
  }
};

const statusChip = (status: Status) => {
  switch (status) {
    case 'idle':
      return {
        label: 'Ready',
        classes: 'bg-zinc-700/60 text-zinc-200 border border-zinc-500/40',
      };
    case 'playing':
      return {
        label: 'Spinning…',
        classes:
          'bg-gradient-to-r from-sky-500/90 to-indigo-500/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]',
      };
    case 'completed':
      return {
        label: 'Completed',
        classes:
          'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      };
  }
};

const CountUp: React.FC<{ value: number; durationMs?: number; className?: string }> = ({
  value,
  durationMs = 400,
  className,
}) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const initial = display;
    const delta = value - initial;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(initial + delta * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{display.toLocaleString()}</span>;
};

const StatItem: React.FC<{ icon: string; label: string; children: React.ReactNode }> = ({
  icon,
  label,
  children,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 backdrop-blur-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-xl">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-zinc-400">{label}</div>
        <div className="truncate text-lg font-semibold text-white/95">{children}</div>
      </div>
    </div>
  );
};

const StatusPanel: React.FC<StatusPanelProps> = ({ score, highScore, status, rank }) => {
  const statusInfo = statusChip(status);
  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-800/40 p-[1px] shadow-lg">
        <div className="rounded-2xl bg-black/40 p-4 backdrop-blur-md sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <StatItem icon="🔥" label="Score">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                <CountUp value={score} />
              </span>
            </StatItem>
            <StatItem icon="🏆" label="High Score">
              <span className="text-amber-200">
                {highScore.toLocaleString()}
              </span>
            </StatItem>
            <StatItem icon="🎯" label="Status">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusInfo.classes}`}>
                {statusInfo.label}
              </span>
            </StatItem>
            <StatItem icon={rankEmoji(rank)} label="Rank">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${rankClasses(rank)}`}>
                {rank ?? '—'}
              </span>
            </StatItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
