import { useMemo } from 'react';
import type { GroupId } from '../types';
import { useTournamentStore } from '../store/tournamentStore';

export function useGroupStandings(groupId: GroupId) {
  const standings = useTournamentStore((s) => s.standings);
  return useMemo(
    () => standings.filter((s) => s.groupId === groupId),
    [standings, groupId],
  );
}

export function useThirdPlaceRanking() {
  const standings = useTournamentStore((s) => s.standings);
  return useMemo(
    () =>
      standings
        .filter((s) => s.position === 3)
        .sort((a, b) => {
          if (a.qualified !== b.qualified) return a.qualified ? -1 : 1;
          if (b.points !== a.points) return b.points - a.points;
          if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
          return b.goalsFor - a.goalsFor;
        }),
    [standings],
  );
}
