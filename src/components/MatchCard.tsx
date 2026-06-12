import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { GroupMatch } from '../types';
import { useTournamentStore } from '../store/tournamentStore';
import { TeamBadge } from './TeamBadge';

interface MatchCardProps {
  match: GroupMatch;
}

function MatchCardComponent({ match }: MatchCardProps) {
  const setGroupScore = useTournamentStore((s) => s.setGroupScore);

  const handleHomeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0);
      setGroupScore(match.id, val, match.awayScore);
    },
    [match.id, match.awayScore, setGroupScore],
  );

  const handleAwayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0);
      setGroupScore(match.id, match.homeScore, val);
    },
    [match.id, match.homeScore, setGroupScore],
  );

  const played = match.homeScore !== null && match.awayScore !== null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl p-4 transition-colors ${played ? 'border-wc-gold/30' : ''}`}
    >
      <div className="text-xs text-white/40 mb-3">
        Matchday {match.matchday} · {match.id}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0 flex justify-start">
          <TeamBadge teamId={match.homeTeamId} showName={false} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="number"
            min={0}
            max={20}
            className="score-input"
            value={match.homeScore ?? ''}
            onChange={handleHomeChange}
            aria-label="Home score"
          />
          <span className="text-white/50 font-bold">-</span>
          <input
            type="number"
            min={0}
            max={20}
            className="score-input"
            value={match.awayScore ?? ''}
            onChange={handleAwayChange}
            aria-label="Away score"
          />
        </div>
        <div className="flex-1 min-w-0 flex justify-end">
          <TeamBadge teamId={match.awayTeamId} align="right" showName={false} />
        </div>
      </div>
    </motion.div>
  );
}

export const MatchCard = memo(MatchCardComponent);
