import { useMemo } from 'react';
import { useTournamentStore } from '../store/tournamentStore';
import { calculateStatistics } from '../utils/statistics';

export function useStatistics() {
  const groupMatches = useTournamentStore((s) => s.groupMatches);
  const knockoutMatches = useTournamentStore((s) => s.knockoutMatches);
  const standings = useTournamentStore((s) => s.standings);

  return useMemo(
    () => calculateStatistics(groupMatches, knockoutMatches, standings),
    [groupMatches, knockoutMatches, standings],
  );
}
