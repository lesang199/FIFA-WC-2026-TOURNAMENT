import { useMemo } from 'react';
import { getTeamById, teams } from '../data/worldcup2026';

export function useTeam(teamId: string | null | undefined) {
  return useMemo(() => (teamId ? getTeamById(teamId) : undefined), [teamId]);
}

export function useTeamsMap() {
  return useMemo(() => new Map(teams.map((t) => [t.id, t])), []);
}
