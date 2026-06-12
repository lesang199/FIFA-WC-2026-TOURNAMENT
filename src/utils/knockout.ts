import { knockoutTemplate } from '../data/worldcup2026';
import type {
  GroupId,
  KnockoutMatch,
  KnockoutSlotRef,
  Standing,
} from '../types';
import { getMatchLoserId, getMatchWinnerId } from './matchResult';
import { getThirdPlaceMapping, type WinnerSlot } from './thirdPlace';

function createEmptyKnockoutMatch(
  template: (typeof knockoutTemplate)[number],
): KnockoutMatch {
  return {
    id: template.id,
    stage: template.stage,
    matchNumber: template.matchNumber,
    homeSlot: template.homeSlot,
    awaySlot: template.awaySlot,
    label: template.label,
    homeTeamId: null,
    awayTeamId: null,
    homeScore: null,
    awayScore: null,
    extraTimeHome: null,
    extraTimeAway: null,
    penaltyHome: null,
    penaltyAway: null,
  };
}

function getTeamFromGroupPosition(
  standings: Standing[],
  groupId: GroupId,
  position: 1 | 2 | 3,
): string | null {
  const team = standings.find((s) => s.groupId === groupId && s.position === position);
  return team?.teamId ?? null;
}

function resolveSlot(
  slot: KnockoutSlotRef,
  standings: Standing[],
  thirdPlaceMapping: Record<WinnerSlot, GroupId> | null,
  knockoutMatches: KnockoutMatch[],
): string | null {
  if (slot.type === 'group-position') {
    return getTeamFromGroupPosition(standings, slot.groupId, slot.position);
  }

  if (slot.type === 'third-place-slot') {
    if (!thirdPlaceMapping) return null;
    const winnerGroup = slot.winnerGroupId as WinnerSlot;
    const thirdGroup = thirdPlaceMapping[winnerGroup];
    if (!thirdGroup) return null;
    return getTeamFromGroupPosition(standings, thirdGroup, 3);
  }

  if (slot.type === 'winner') {
    const sourceMatch = knockoutMatches.find((m) => m.id === slot.matchId);
    if (!sourceMatch?.homeTeamId || !sourceMatch?.awayTeamId) return null;
    return getMatchWinnerId(
      sourceMatch as KnockoutMatch & { homeTeamId: string; awayTeamId: string },
    );
  }

  return null;
}

export function generateRoundOf32(standings: Standing[]): KnockoutMatch[] {
  const qualifiedThirdGroups = standings
    .filter((s) => s.position === 3 && s.qualified)
    .map((s) => s.groupId);

  const thirdPlaceMapping =
    qualifiedThirdGroups.length === 8
      ? getThirdPlaceMapping(qualifiedThirdGroups)
      : null;

  const matches = knockoutTemplate.map(createEmptyKnockoutMatch);

  for (const match of matches) {
    if (match.stage === 'third-place' || match.stage === 'final') {
      continue;
    }

    match.homeTeamId = resolveSlot(match.homeSlot, standings, thirdPlaceMapping, matches);
    match.awayTeamId = resolveSlot(match.awaySlot, standings, thirdPlaceMapping, matches);
  }

  return matches;
}

export function propagateKnockoutWinners(knockoutMatches: KnockoutMatch[]): KnockoutMatch[] {
  const updated = knockoutMatches.map((m) => ({ ...m }));
  const byId = new Map(updated.map((m) => [m.id, m]));

  const getWinner = (matchId: string): string | null => {
    const m = byId.get(matchId);
    if (!m?.homeTeamId || !m?.awayTeamId) return null;
    return getMatchWinnerId(m as KnockoutMatch & { homeTeamId: string; awayTeamId: string });
  };

  const getLoser = (matchId: string): string | null => {
    const m = byId.get(matchId);
    if (!m?.homeTeamId || !m?.awayTeamId) return null;
    return getMatchLoserId(m as KnockoutMatch & { homeTeamId: string; awayTeamId: string });
  };

  for (const match of updated) {
    if (match.stage === 'third-place') {
      match.homeTeamId = getLoser('SF-1');
      match.awayTeamId = getLoser('SF-2');
      continue;
    }

    if (match.stage === 'final') {
      match.homeTeamId = getWinner('SF-1');
      match.awayTeamId = getWinner('SF-2');
      continue;
    }

    if (match.homeSlot.type === 'winner') {
      const winner = getWinner(match.homeSlot.matchId);
      if (winner) match.homeTeamId = winner;
    }

    if (match.awaySlot.type === 'winner') {
      const winner = getWinner(match.awaySlot.matchId);
      if (winner) match.awayTeamId = winner;
    }
  }

  return updated;
}

export const KNOCKOUT_STAGE_ORDER = [
  'round-of-32',
  'round-of-16',
  'quarter-finals',
  'semi-finals',
  'third-place',
  'final',
] as const;

export const KNOCKOUT_STAGE_LABELS: Record<string, string> = {
  'round-of-32': 'Round of 32',
  'round-of-16': 'Round of 16',
  'quarter-finals': 'Quarter Finals',
  'semi-finals': 'Semi Finals',
  'third-place': 'Third Place',
  final: 'Final',
};
