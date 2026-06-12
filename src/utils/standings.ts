import { getTeamById } from '../data/worldcup2026';
import type { GroupId, GroupMatch, Standing } from '../types';
import { isMatchPlayed } from './matchResult';

interface StandingAccumulator {
  teamId: string;
  groupId: GroupId;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  fairPlayPoints: number;
}

function initAccumulator(teamId: string, groupId: GroupId, fairPlay: number): StandingAccumulator {
  return {
    teamId,
    groupId,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    fairPlayPoints: fairPlay,
  };
}

function compareHeadToHead(
  a: StandingAccumulator,
  b: StandingAccumulator,
  matches: GroupMatch[],
): number {
  const h2h = matches.filter(
    (m) =>
      isMatchPlayed(m) &&
      ((m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
        (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId)),
  );

  if (h2h.length === 0) return 0;

  let aPts = 0;
  let bPts = 0;
  let aGd = 0;
  let bGd = 0;
  let aGf = 0;
  let bGf = 0;

  for (const m of h2h) {
    const home = m.homeScore!;
    const away = m.awayScore!;
    const aIsHome = m.homeTeamId === a.teamId;
    const aGoals = aIsHome ? home : away;
    const bGoals = aIsHome ? away : home;

    aGf += aGoals;
    bGf += bGoals;
    aGd += aGoals - bGoals;
    bGd += bGoals - aGoals;

    if (aGoals > bGoals) {
      aPts += 3;
    } else if (aGoals < bGoals) {
      bPts += 3;
    } else {
      aPts += 1;
      bPts += 1;
    }
  }

  return bPts - aPts || bGd - aGd || bGf - aGf;
}

function resolveTiedGroup(
  tied: StandingAccumulator[],
  matches: GroupMatch[],
): StandingAccumulator[] {
  if (tied.length <= 1) return tied;

  const sorted = [...tied].sort((a, b) => {
    const h2h = compareHeadToHead(a, b, matches);
    if (h2h !== 0) return h2h;
    return a.fairPlayPoints - b.fairPlayPoints;
  });

  const groups: StandingAccumulator[][] = [];
  let current: StandingAccumulator[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const tiedOnH2H =
      compareHeadToHead(prev, curr, matches) === 0 &&
      prev.fairPlayPoints === curr.fairPlayPoints;

    if (tiedOnH2H) {
      current.push(curr);
    } else {
      groups.push(current);
      current = [curr];
    }
  }
  groups.push(current);

  const result: StandingAccumulator[] = [];
  for (const group of groups) {
    if (group.length > 1) {
      const byRanking = [...group].sort((a, b) => {
        const rankA = getTeamById(a.teamId)?.fifaRanking ?? 999;
        const rankB = getTeamById(b.teamId)?.fifaRanking ?? 999;
        return rankA - rankB;
      });
      result.push(...byRanking);
    } else {
      result.push(group[0]);
    }
  }

  return result;
}

function sortGroupStandings(
  accumulators: StandingAccumulator[],
  matches: GroupMatch[],
): StandingAccumulator[] {
  const sorted = [...accumulators].sort((a, b) => {
    const aPts = a.wins * 3 + a.draws;
    const bPts = b.wins * 3 + b.draws;
    const aGd = a.goalsFor - a.goalsAgainst;
    const bGd = b.goalsFor - b.goalsAgainst;

    if (bPts !== aPts) return bPts - aPts;
    if (bGd !== aGd) return bGd - aGd;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return 0;
  });

  const result: StandingAccumulator[] = [];
  let i = 0;

  while (i < sorted.length) {
    const a = sorted[i];
    const aPts = a.wins * 3 + a.draws;
    const aGd = a.goalsFor - a.goalsAgainst;

    const tied: StandingAccumulator[] = [a];
    let j = i + 1;

    while (j < sorted.length) {
      const b = sorted[j];
      const bPts = b.wins * 3 + b.draws;
      const bGd = b.goalsFor - b.goalsAgainst;

      if (bPts === aPts && bGd === aGd && b.goalsFor === a.goalsFor) {
        tied.push(b);
        j++;
      } else {
        break;
      }
    }

    result.push(...resolveTiedGroup(tied, matches));
    i = j;
  }

  return result;
}

export function calculateStandings(
  groupId: GroupId,
  teamIds: string[],
  matches: GroupMatch[],
  fairPlayOverrides: Record<string, number> = {},
): Standing[] {
  const groupMatches = matches.filter((m) => m.groupId === groupId);

  const accumulators = teamIds.map((id) =>
    initAccumulator(id, groupId, fairPlayOverrides[id] ?? 0),
  );

  for (const match of groupMatches) {
    if (!isMatchPlayed(match)) continue;

    const home = accumulators.find((a) => a.teamId === match.homeTeamId);
    const away = accumulators.find((a) => a.teamId === match.awayTeamId);
    if (!home || !away) continue;

    const hScore = match.homeScore!;
    const aScore = match.awayScore!;

    home.played++;
    away.played++;
    home.goalsFor += hScore;
    home.goalsAgainst += aScore;
    away.goalsFor += aScore;
    away.goalsAgainst += hScore;

    if (hScore > aScore) {
      home.wins++;
      away.losses++;
    } else if (hScore < aScore) {
      away.wins++;
      home.losses++;
    } else {
      home.draws++;
      away.draws++;
    }
  }

  const sorted = sortGroupStandings(accumulators, groupMatches);

  return sorted.map((acc, index) => {
    const position = (index + 1) as 1 | 2 | 3 | 4;
    const points = acc.wins * 3 + acc.draws;

    return {
      teamId: acc.teamId,
      groupId: acc.groupId,
      played: acc.played,
      wins: acc.wins,
      draws: acc.draws,
      losses: acc.losses,
      goalsFor: acc.goalsFor,
      goalsAgainst: acc.goalsAgainst,
      goalDifference: acc.goalsFor - acc.goalsAgainst,
      points,
      fairPlayPoints: acc.fairPlayPoints,
      position,
      qualified: false,
      eliminated: false,
    };
  });
}

export function calculateAllStandings(
  groups: { id: GroupId; teamIds: string[] }[],
  matches: GroupMatch[],
  fairPlayOverrides: Record<string, number> = {},
): Standing[] {
  return groups.flatMap((g) =>
    calculateStandings(g.id, g.teamIds, matches, fairPlayOverrides),
  );
}

export function isGroupStageComplete(
  groups: { id: GroupId; teamIds: string[] }[],
  matches: GroupMatch[],
): boolean {
  return groups.every((g) => {
    const groupMatches = matches.filter((m) => m.groupId === g.id);
    return groupMatches.every(isMatchPlayed);
  });
}
