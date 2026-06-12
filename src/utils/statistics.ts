import { getTeamById, teams } from '../data/worldcup2026';
import type { GroupMatch, KnockoutMatch, Standing, TournamentStats } from '../types';
import { getMatchWinnerId, isMatchPlayed } from './matchResult';

export function calculateStatistics(
  groupMatches: GroupMatch[],
  knockoutMatches: KnockoutMatch[],
  standings: Standing[],
): TournamentStats {
  const goalsByTeam = new Map<string, { scored: number; conceded: number }>();

  for (const team of teams) {
    goalsByTeam.set(team.id, { scored: 0, conceded: 0 });
  }

  const allMatches = [...groupMatches, ...knockoutMatches];

  for (const match of allMatches) {
    if (!isMatchPlayed(match)) continue;

    if (!match.homeTeamId || !match.awayTeamId) continue;
    const home = goalsByTeam.get(match.homeTeamId);
    const away = goalsByTeam.get(match.awayTeamId);
    if (!home || !away) continue;

    const hScore = match.homeScore! + (match.extraTimeHome ?? 0);
    const aScore = match.awayScore! + (match.extraTimeAway ?? 0);

    home.scored += hScore;
    home.conceded += aScore;
    away.scored += aScore;
    away.conceded += hScore;
  }

  let topScorer: TournamentStats['topScorer'] = null;
  let bestDefense: TournamentStats['bestDefense'] = null;

  for (const [teamId, stats] of goalsByTeam) {
    if (!topScorer || stats.scored > topScorer.goals) {
      topScorer = { teamId, goals: stats.scored };
    }
    if (stats.conceded > 0 || stats.scored > 0) {
      if (!bestDefense || stats.conceded < bestDefense.conceded) {
        bestDefense = { teamId, conceded: stats.conceded };
      }
    }
  }

  const qualified = standings.filter((s) => s.qualified).map((s) => s.teamId);
  const eliminated = standings.filter((s) => s.eliminated).map((s) => s.teamId);

  const finalMatch = knockoutMatches.find((m) => m.stage === 'final');
  const thirdPlaceMatch = knockoutMatches.find((m) => m.stage === 'third-place');

  let champion: string | null = null;
  let runnerUp: string | null = null;
  let thirdPlace: string | null = null;

  if (finalMatch?.homeTeamId && finalMatch?.awayTeamId && isMatchPlayed(finalMatch)) {
    champion = getMatchWinnerId(finalMatch as KnockoutMatch & { homeTeamId: string; awayTeamId: string });
    runnerUp =
      champion === finalMatch.homeTeamId ? finalMatch.awayTeamId : finalMatch.homeTeamId;
  }

  if (thirdPlaceMatch?.homeTeamId && thirdPlaceMatch?.awayTeamId && isMatchPlayed(thirdPlaceMatch)) {
    thirdPlace = getMatchWinnerId(
      thirdPlaceMatch as KnockoutMatch & { homeTeamId: string; awayTeamId: string },
    );
  }

  return {
    topScorer,
    bestDefense,
    qualified,
    eliminated,
    champion,
    runnerUp,
    thirdPlace,
  };
}

export function getTeamName(teamId: string): string {
  return getTeamById(teamId)?.name ?? teamId;
}
