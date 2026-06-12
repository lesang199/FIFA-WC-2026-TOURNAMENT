import type { MatchResult } from '../types';

export function isMatchPlayed(match: MatchResult): boolean {
  return match.homeScore !== null && match.awayScore !== null;
}

export function getRegulationScore(match: MatchResult): { home: number; away: number } | null {
  if (!isMatchPlayed(match)) return null;
  return { home: match.homeScore!, away: match.awayScore! };
}

export function getTotalScore(match: MatchResult): { home: number; away: number } | null {
  const reg = getRegulationScore(match);
  if (!reg) return null;

  const etHome = match.extraTimeHome ?? 0;
  const etAway = match.extraTimeAway ?? 0;

  return { home: reg.home + etHome, away: reg.away + etAway };
}

export function isDrawAfterRegulation(match: MatchResult): boolean {
  const reg = getRegulationScore(match);
  return reg !== null && reg.home === reg.away;
}

export function isDrawAfterExtraTime(match: MatchResult): boolean {
  const total = getTotalScore(match);
  return total !== null && total.home === total.away;
}

export function getMatchWinnerId(
  match: MatchResult & { homeTeamId: string; awayTeamId: string },
): string | null {
  if (!isMatchPlayed(match)) return null;

  const total = getTotalScore(match);
  if (!total) return null;

  if (total.home > total.away) return match.homeTeamId;
  if (total.away > total.home) return match.awayTeamId;

  if (match.penaltyHome !== null && match.penaltyAway !== null) {
    if (match.penaltyHome > match.penaltyAway) return match.homeTeamId;
    if (match.penaltyAway > match.penaltyHome) return match.awayTeamId;
  }

  return null;
}

export function getMatchLoserId(
  match: MatchResult & { homeTeamId: string; awayTeamId: string },
): string | null {
  const winner = getMatchWinnerId(match);
  if (!winner) return null;
  return winner === match.homeTeamId ? match.awayTeamId : match.homeTeamId;
}

export function needsExtraTime(match: MatchResult, isKnockout: boolean): boolean {
  return isKnockout && isDrawAfterRegulation(match);
}

export function needsPenalties(match: MatchResult, isKnockout: boolean): boolean {
  if (!isKnockout || !isMatchPlayed(match)) return false;
  if (!isDrawAfterRegulation(match)) return false;
  if (match.extraTimeHome === null || match.extraTimeAway === null) return false;
  return isDrawAfterExtraTime(match);
}
