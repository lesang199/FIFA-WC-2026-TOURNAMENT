import { getTeamById } from '../data/worldcup2026';
import type { GroupId, Standing, ThirdPlaceStanding } from '../types';

export function rankThirdPlaceTeams(thirdPlaceTeams: Standing[]): ThirdPlaceStanding[] {
  const ranked = [...thirdPlaceTeams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    if (a.fairPlayPoints !== b.fairPlayPoints) return a.fairPlayPoints - b.fairPlayPoints;

    const rankA = getTeamById(a.teamId)?.fifaRanking ?? 999;
    const rankB = getTeamById(b.teamId)?.fifaRanking ?? 999;
    return rankA - rankB;
  });

  return ranked.map((team, index) => ({
    ...team,
    thirdPlaceRank: index + 1,
    thirdPlaceQualified: index < 8,
    qualified: index < 8,
    eliminated: index >= 8,
    qualificationType: index < 8 ? 'third-place' : undefined,
  }));
}

export function getThirdPlaceCombinationKey(qualified: Standing[]): string {
  return qualified
    .map((t) => t.groupId)
    .sort()
    .join('');
}

export function applyQualificationStatus(standings: Standing[]): Standing[] {
  const thirdPlace = standings.filter((s) => s.position === 3);
  const rankedThird = rankThirdPlaceTeams(thirdPlace);

  return standings.map((s) => {
    if (s.position === 1 || s.position === 2) {
      return {
        ...s,
        qualified: true,
        eliminated: false,
        qualificationType: s.position === 1 ? 'winner' : 'runner-up',
      };
    }
    if (s.position === 3) {
      const ranked = rankedThird.find((t) => t.teamId === s.teamId);
      return {
        ...s,
        qualified: ranked?.thirdPlaceQualified ?? false,
        eliminated: !(ranked?.thirdPlaceQualified ?? false),
        qualificationType: ranked?.thirdPlaceQualified ? 'third-place' : undefined,
      };
    }
    return {
      ...s,
      qualified: false,
      eliminated: true,
      qualificationType: 'fourth-place',
    };
  });
}

export type WinnerSlot = 'A' | 'B' | 'D' | 'E' | 'G' | 'I' | 'K' | 'L';

/** Eligible third-place groups per group-winner slot (FIFA Regulations Art. 12.6) */
export const THIRD_PLACE_ELIGIBILITY: Record<WinnerSlot, GroupId[]> = {
  A: ['C', 'E', 'F', 'H', 'I'],
  B: ['E', 'F', 'G', 'I', 'J'],
  D: ['B', 'E', 'F', 'I', 'J'],
  E: ['A', 'B', 'C', 'D', 'F'],
  G: ['A', 'E', 'H', 'I', 'J'],
  I: ['C', 'D', 'F', 'G', 'H'],
  K: ['D', 'E', 'I', 'J', 'L'],
  L: ['E', 'H', 'I', 'J', 'K'],
};

const WINNER_SLOTS: WinnerSlot[] = ['A', 'B', 'D', 'E', 'G', 'I', 'K', 'L'];

function solveThirdPlaceAssignment(
  qualifyingGroups: GroupId[],
): Record<WinnerSlot, GroupId> | null {
  const assignment: Partial<Record<WinnerSlot, GroupId>> = {};
  const used = new Set<GroupId>();

  function backtrack(slotIndex: number): boolean {
    if (slotIndex >= WINNER_SLOTS.length) return true;

    const slot = WINNER_SLOTS[slotIndex];
    const eligible = THIRD_PLACE_ELIGIBILITY[slot];

    for (const group of qualifyingGroups) {
      if (used.has(group)) continue;
      if (!eligible.includes(group)) continue;

      assignment[slot] = group;
      used.add(group);

      if (backtrack(slotIndex + 1)) return true;

      delete assignment[slot];
      used.delete(group);
    }

    return false;
  }

  if (!backtrack(0)) return null;
  return assignment as Record<WinnerSlot, GroupId>;
}

const annexCCache = new Map<string, Record<WinnerSlot, GroupId>>();

export function getThirdPlaceMapping(qualifyingGroups: GroupId[]): Record<WinnerSlot, GroupId> | null {
  const key = [...qualifyingGroups].sort().join('');
  if (annexCCache.has(key)) return annexCCache.get(key)!;

  const mapping = solveThirdPlaceAssignment(qualifyingGroups);
  if (mapping) annexCCache.set(key, mapping);
  return mapping;
}

export function precomputeAnnexC(): void {
  const allGroups: GroupId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  function combinations(groups: GroupId[], k: number, start: number, current: GroupId[]): void {
    if (current.length === k) {
      getThirdPlaceMapping(current);
      return;
    }
    for (let i = start; i <= groups.length - (k - current.length); i++) {
      current.push(groups[i]);
      combinations(groups, k, i + 1, current);
      current.pop();
    }
  }

  combinations(allGroups, 8, 0, []);
}

precomputeAnnexC();
