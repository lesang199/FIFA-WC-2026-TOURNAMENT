import { memo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import type { KnockoutMatch } from '../types';
import { useTournamentStore } from '../store/tournamentStore';
import { isDrawAfterExtraTime, isDrawAfterRegulation, isMatchPlayed } from '../utils/matchResult';
import { TeamBadge } from './TeamBadge';

interface KnockoutMatchCardProps {
  match: KnockoutMatch;
  compact?: boolean;
}

function ScoreField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-white/40 uppercase">{label}</span>
      <input
        type="number"
        min={0}
        max={20}
        className="score-input w-10 text-sm"
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value === '' ? null : Math.max(0, parseInt(e.target.value, 10) || 0);
          onChange(val);
        }}
      />
    </div>
  );
}

function KnockoutMatchCardComponent({ match, compact = false }: KnockoutMatchCardProps) {
  const setKnockoutScore = useTournamentStore((s) => s.setKnockoutScore);

  const setField = useCallback(
    (field: Parameters<typeof setKnockoutScore>[1], value: number | null) => {
      setKnockoutScore(match.id, field, value);
    },
    [match.id, setKnockoutScore],
  );

  const played = isMatchPlayed(match);
  const showET = played && isDrawAfterRegulation(match);
  const showPen =
    showET &&
    match.extraTimeHome !== null &&
    match.extraTimeAway !== null &&
    isDrawAfterExtraTime(match);

  // Auto-expand if the extra time/penalty inputs are currently needed but not filled.
  const etNeeded = isDrawAfterRegulation(match) && (match.extraTimeHome === null || match.extraTimeAway === null);
  const penNeeded = showPen && (match.penaltyHome === null || match.penaltyAway === null);
  const needsInput = etNeeded || penNeeded;

  const [expanded, setExpanded] = useState(false);
  const isExpanded = needsInput || expanded;

  if (!match.homeTeamId || !match.awayTeamId) {
    return (
      <div className={`glass rounded-lg p-3 ${compact ? 'text-xs' : ''}`}>
        <div className="text-white/30 text-center text-xs">{match.label}</div>
        <div className="text-white/20 text-center text-xs mt-1">Awaiting teams</div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={`glass rounded-xl ${compact ? 'p-3' : 'p-4'} ${played ? 'border-wc-gold/20' : ''}`}
    >
      {!compact && (
        <div className="text-xs text-white/40 mb-2">
          M{match.matchNumber} · {match.label}
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <TeamBadge teamId={match.homeTeamId} size={compact ? 'sm' : 'md'} showName={false} />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <ScoreField label="FT" value={match.homeScore} onChange={(v) => setField('homeScore', v)} />
          <span className="text-white/40 px-1">-</span>
          <ScoreField label="FT" value={match.awayScore} onChange={(v) => setField('awayScore', v)} />
        </div>
        <div className="flex-1 min-w-0 flex justify-end">
          <TeamBadge teamId={match.awayTeamId} size={compact ? 'sm' : 'md'} align="right" showName={false} />
        </div>
      </div>

      {(showET || showPen) && (
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-[9px] font-bold text-wc-gold/70 hover:text-wc-gold hover:bg-white/10 transition-colors py-0.5 px-2 rounded bg-white/5 border border-white/10 cursor-pointer"
          >
            {isExpanded ? 'Hide Extra Details ▲' : 'Show Extra Details ▼'}
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-3">
          {showET && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-[10px] text-wc-gold/80 uppercase mb-2 text-center">
                Extra Time Result
              </div>
              <div className="flex items-center justify-center gap-2">
                <ScoreField
                  label="ET"
                  value={match.extraTimeHome}
                  onChange={(v) => setField('extraTimeHome', v)}
                />
                <span className="text-white/40">-</span>
                <ScoreField
                  label="ET"
                  value={match.extraTimeAway}
                  onChange={(v) => setField('extraTimeAway', v)}
                />
              </div>
            </div>
          )}

          {showPen && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-[10px] text-red-400/80 uppercase mb-2 text-center">
                Penalty Shootout
              </div>
              <div className="flex items-center justify-center gap-2">
                <ScoreField
                  label="PEN"
                  value={match.penaltyHome}
                  onChange={(v) => setField('penaltyHome', v)}
                />
                <span className="text-white/40">-</span>
                <ScoreField
                  label="PEN"
                  value={match.penaltyAway}
                  onChange={(v) => setField('penaltyAway', v)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export const KnockoutMatchCard = memo(KnockoutMatchCardComponent);
