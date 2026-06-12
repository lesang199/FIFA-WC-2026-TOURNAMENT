/**
 * FIFA World Cup 2026 — Official tournament data
 *
 * Teams confirmed after the Final Draw (5 Dec 2025) and final qualifying
 * matches (31 Mar 2026). Update this file when FIFA publishes changes.
 *
 * fifaCode: official FIFA 3-letter country code
 * name: official FIFA country name (as used on FIFA.com match graphics)
 * isoCode: ISO 3166-1 alpha-2 for flag images
 * Crest images: public/crests/{fifaCode}.png (run: node scripts/download-crests.mjs)
 *
 * Host positions: A1 Mexico, B1 Canada, D1 USA (FIFA Regulations Art. 12.3)
 */

import type { Group, GroupId, GroupMatch, KnockoutTemplate, Team } from '../types';

export const teams: Team[] = [
  // Group A
  { id: 'mex', name: 'Mexico', fifaCode: 'MEX', isoCode: 'mx', fifaRanking: 14, confederation: 'CONCACAF' },
  { id: 'rsa', name: 'South Africa', fifaCode: 'RSA', isoCode: 'za', fifaRanking: 59, confederation: 'CAF' },
  { id: 'kor', name: 'Korea Republic', fifaCode: 'KOR', isoCode: 'kr', fifaRanking: 23, confederation: 'AFC' },
  { id: 'cze', name: 'Czechia', fifaCode: 'CZE', isoCode: 'cz', fifaRanking: 31, confederation: 'UEFA' },
  // Group B
  { id: 'can', name: 'Canada', fifaCode: 'CAN', isoCode: 'ca', fifaRanking: 41, confederation: 'CONCACAF' },
  { id: 'bih', name: 'Bosnia and Herzegovina', fifaCode: 'BIH', isoCode: 'ba', fifaRanking: 61, confederation: 'UEFA' },
  { id: 'qat', name: 'Qatar', fifaCode: 'QAT', isoCode: 'qa', fifaRanking: 35, confederation: 'AFC' },
  { id: 'sui', name: 'Switzerland', fifaCode: 'SUI', isoCode: 'ch', fifaRanking: 19, confederation: 'UEFA' },
  // Group C
  { id: 'bra', name: 'Brazil', fifaCode: 'BRA', isoCode: 'br', fifaRanking: 5, confederation: 'CONMEBOL' },
  { id: 'mar', name: 'Morocco', fifaCode: 'MAR', isoCode: 'ma', fifaRanking: 13, confederation: 'CAF' },
  { id: 'hai', name: 'Haiti', fifaCode: 'HAI', isoCode: 'ht', fifaRanking: 87, confederation: 'CONCACAF' },
  { id: 'sco', name: 'Scotland', fifaCode: 'SCO', isoCode: 'gb-sct', fifaRanking: 36, confederation: 'UEFA' },
  // Group D
  { id: 'usa', name: 'United States', fifaCode: 'USA', isoCode: 'us', fifaRanking: 11, confederation: 'CONCACAF' },
  { id: 'par', name: 'Paraguay', fifaCode: 'PAR', isoCode: 'py', fifaRanking: 52, confederation: 'CONMEBOL' },
  { id: 'aus', name: 'Australia', fifaCode: 'AUS', isoCode: 'au', fifaRanking: 24, confederation: 'AFC' },
  { id: 'tur', name: 'Türkiye', fifaCode: 'TUR', isoCode: 'tr', fifaRanking: 38, confederation: 'UEFA' },
  // Group E
  { id: 'ger', name: 'Germany', fifaCode: 'GER', isoCode: 'de', fifaRanking: 8, confederation: 'UEFA' },
  { id: 'cuw', name: 'Curaçao', fifaCode: 'CUW', isoCode: 'cw', fifaRanking: 88, confederation: 'CONCACAF' },
  { id: 'civ', name: "Côte d'Ivoire", fifaCode: 'CIV', isoCode: 'ci', fifaRanking: 37, confederation: 'CAF' },
  { id: 'ecu', name: 'Ecuador', fifaCode: 'ECU', isoCode: 'ec', fifaRanking: 29, confederation: 'CONMEBOL' },
  // Group F
  { id: 'ned', name: 'Netherlands', fifaCode: 'NED', isoCode: 'nl', fifaRanking: 7, confederation: 'UEFA' },
  { id: 'jpn', name: 'Japan', fifaCode: 'JPN', isoCode: 'jp', fifaRanking: 18, confederation: 'AFC' },
  { id: 'swe', name: 'Sweden', fifaCode: 'SWE', isoCode: 'se', fifaRanking: 32, confederation: 'UEFA' },
  { id: 'tun', name: 'Tunisia', fifaCode: 'TUN', isoCode: 'tn', fifaRanking: 40, confederation: 'CAF' },
  // Group G
  { id: 'bel', name: 'Belgium', fifaCode: 'BEL', isoCode: 'be', fifaRanking: 15, confederation: 'UEFA' },
  { id: 'egy', name: 'Egypt', fifaCode: 'EGY', isoCode: 'eg', fifaRanking: 33, confederation: 'CAF' },
  { id: 'irn', name: 'IR Iran', fifaCode: 'IRN', isoCode: 'ir', fifaRanking: 22, confederation: 'AFC' },
  { id: 'nzl', name: 'New Zealand', fifaCode: 'NZL', isoCode: 'nz', fifaRanking: 93, confederation: 'OFC' },
  // Group H
  { id: 'esp', name: 'Spain', fifaCode: 'ESP', isoCode: 'es', fifaRanking: 3, confederation: 'UEFA' },
  { id: 'cpv', name: 'Cabo Verde', fifaCode: 'CPV', isoCode: 'cv', fifaRanking: 65, confederation: 'CAF' },
  { id: 'ksa', name: 'Saudi Arabia', fifaCode: 'KSA', isoCode: 'sa', fifaRanking: 58, confederation: 'AFC' },
  { id: 'uru', name: 'Uruguay', fifaCode: 'URU', isoCode: 'uy', fifaRanking: 10, confederation: 'CONMEBOL' },
  // Group I
  { id: 'fra', name: 'France', fifaCode: 'FRA', isoCode: 'fr', fifaRanking: 2, confederation: 'UEFA' },
  { id: 'sen', name: 'Senegal', fifaCode: 'SEN', isoCode: 'sn', fifaRanking: 17, confederation: 'CAF' },
  { id: 'irq', name: 'Iraq', fifaCode: 'IRQ', isoCode: 'iq', fifaRanking: 56, confederation: 'AFC' },
  { id: 'nor', name: 'Norway', fifaCode: 'NOR', isoCode: 'no', fifaRanking: 45, confederation: 'UEFA' },
  // Group J
  { id: 'arg', name: 'Argentina', fifaCode: 'ARG', isoCode: 'ar', fifaRanking: 1, confederation: 'CONMEBOL' },
  { id: 'alg', name: 'Algeria', fifaCode: 'ALG', isoCode: 'dz', fifaRanking: 30, confederation: 'CAF' },
  { id: 'aut', name: 'Austria', fifaCode: 'AUT', isoCode: 'at', fifaRanking: 20, confederation: 'UEFA' },
  { id: 'jor', name: 'Jordan', fifaCode: 'JOR', isoCode: 'jo', fifaRanking: 70, confederation: 'AFC' },
  // Group K
  { id: 'por', name: 'Portugal', fifaCode: 'POR', isoCode: 'pt', fifaRanking: 6, confederation: 'UEFA' },
  { id: 'cod', name: 'Congo DR', fifaCode: 'COD', isoCode: 'cd', fifaRanking: 64, confederation: 'CAF' },
  { id: 'uzb', name: 'Uzbekistan', fifaCode: 'UZB', isoCode: 'uz', fifaRanking: 66, confederation: 'AFC' },
  { id: 'col', name: 'Colombia', fifaCode: 'COL', isoCode: 'co', fifaRanking: 12, confederation: 'CONMEBOL' },
  // Group L
  { id: 'eng', name: 'England', fifaCode: 'ENG', isoCode: 'gb-eng', fifaRanking: 4, confederation: 'UEFA' },
  { id: 'cro', name: 'Croatia', fifaCode: 'CRO', isoCode: 'hr', fifaRanking: 9, confederation: 'UEFA' },
  { id: 'pan', name: 'Panama', fifaCode: 'PAN', isoCode: 'pa', fifaRanking: 44, confederation: 'CONCACAF' },
  { id: 'gha', name: 'Ghana', fifaCode: 'GHA', isoCode: 'gh', fifaRanking: 68, confederation: 'CAF' },
];

export const groups: Group[] = [
  { id: 'A', teamIds: ['mex', 'rsa', 'kor', 'cze'] },
  { id: 'B', teamIds: ['can', 'bih', 'qat', 'sui'] },
  { id: 'C', teamIds: ['bra', 'mar', 'hai', 'sco'] },
  { id: 'D', teamIds: ['usa', 'par', 'aus', 'tur'] },
  { id: 'E', teamIds: ['ger', 'cuw', 'civ', 'ecu'] },
  { id: 'F', teamIds: ['ned', 'jpn', 'swe', 'tun'] },
  { id: 'G', teamIds: ['bel', 'egy', 'irn', 'nzl'] },
  { id: 'H', teamIds: ['esp', 'cpv', 'ksa', 'uru'] },
  { id: 'I', teamIds: ['fra', 'sen', 'irq', 'nor'] },
  { id: 'J', teamIds: ['arg', 'alg', 'aut', 'jor'] },
  { id: 'K', teamIds: ['por', 'cod', 'uzb', 'col'] },
  { id: 'L', teamIds: ['eng', 'cro', 'pan', 'gha'] },
];

const GROUP_IDS: GroupId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

const FIXTURE_PATTERN: Array<{ matchday: 1 | 2 | 3; home: number; away: number }> = [
  { matchday: 1, home: 0, away: 1 },
  { matchday: 1, home: 2, away: 3 },
  { matchday: 2, home: 0, away: 2 },
  { matchday: 2, home: 3, away: 1 },
  { matchday: 3, home: 3, away: 0 },
  { matchday: 3, home: 1, away: 2 },
];

function buildGroupFixtures(): GroupMatch[] {
  const matches: GroupMatch[] = [];
  let globalIndex = 1;

  for (const group of groups) {
    for (const fixture of FIXTURE_PATTERN) {
      matches.push({
        id: `GM-${globalIndex}`,
        groupId: group.id,
        matchday: fixture.matchday,
        homeTeamId: group.teamIds[fixture.home],
        awayTeamId: group.teamIds[fixture.away],
        homeScore: null,
        awayScore: null,
        extraTimeHome: null,
        extraTimeAway: null,
        penaltyHome: null,
        penaltyAway: null,
      });
      globalIndex++;
    }
  }

  return matches;
}

export const groupFixtures: GroupMatch[] = buildGroupFixtures();

export const knockoutTemplate: KnockoutTemplate[] = [
  { id: 'R32-1', stage: 'round-of-32', matchNumber: 73, homeSlot: { type: 'group-position', groupId: 'A', position: 2 }, awaySlot: { type: 'group-position', groupId: 'B', position: 2 }, label: '2A vs 2B' },
  { id: 'R32-2', stage: 'round-of-32', matchNumber: 74, homeSlot: { type: 'group-position', groupId: 'E', position: 1 }, awaySlot: { type: 'third-place-slot', winnerGroupId: 'E' }, label: '1E vs 3rd (ABCDF)' },
  { id: 'R32-3', stage: 'round-of-32', matchNumber: 75, homeSlot: { type: 'group-position', groupId: 'F', position: 1 }, awaySlot: { type: 'group-position', groupId: 'C', position: 2 }, label: '1F vs 2C' },
  { id: 'R32-4', stage: 'round-of-32', matchNumber: 76, homeSlot: { type: 'group-position', groupId: 'C', position: 1 }, awaySlot: { type: 'group-position', groupId: 'F', position: 2 }, label: '1C vs 2F' },
  { id: 'R32-5', stage: 'round-of-32', matchNumber: 77, homeSlot: { type: 'group-position', groupId: 'I', position: 1 }, awaySlot: { type: 'third-place-slot', winnerGroupId: 'I' }, label: '1I vs 3rd (CDFGH)' },
  { id: 'R32-6', stage: 'round-of-32', matchNumber: 78, homeSlot: { type: 'group-position', groupId: 'E', position: 2 }, awaySlot: { type: 'group-position', groupId: 'I', position: 2 }, label: '2E vs 2I' },
  { id: 'R32-7', stage: 'round-of-32', matchNumber: 79, homeSlot: { type: 'group-position', groupId: 'A', position: 1 }, awaySlot: { type: 'third-place-slot', winnerGroupId: 'A' }, label: '1A vs 3rd (CEFHI)' },
  { id: 'R32-8', stage: 'round-of-32', matchNumber: 80, homeSlot: { type: 'group-position', groupId: 'L', position: 1 }, awaySlot: { type: 'third-place-slot', winnerGroupId: 'L' }, label: '1L vs 3rd (EHIJK)' },
  { id: 'R32-9', stage: 'round-of-32', matchNumber: 81, homeSlot: { type: 'group-position', groupId: 'D', position: 1 }, awaySlot: { type: 'third-place-slot', winnerGroupId: 'D' }, label: '1D vs 3rd (BEFIJ)' },
  { id: 'R32-10', stage: 'round-of-32', matchNumber: 82, homeSlot: { type: 'group-position', groupId: 'G', position: 1 }, awaySlot: { type: 'third-place-slot', winnerGroupId: 'G' }, label: '1G vs 3rd (AEHIJ)' },
  { id: 'R32-11', stage: 'round-of-32', matchNumber: 83, homeSlot: { type: 'group-position', groupId: 'K', position: 2 }, awaySlot: { type: 'group-position', groupId: 'L', position: 2 }, label: '2K vs 2L' },
  { id: 'R32-12', stage: 'round-of-32', matchNumber: 84, homeSlot: { type: 'group-position', groupId: 'H', position: 1 }, awaySlot: { type: 'group-position', groupId: 'J', position: 2 }, label: '1H vs 2J' },
  { id: 'R32-13', stage: 'round-of-32', matchNumber: 85, homeSlot: { type: 'group-position', groupId: 'B', position: 1 }, awaySlot: { type: 'third-place-slot', winnerGroupId: 'B' }, label: '1B vs 3rd (EFGIJ)' },
  { id: 'R32-14', stage: 'round-of-32', matchNumber: 86, homeSlot: { type: 'group-position', groupId: 'J', position: 1 }, awaySlot: { type: 'group-position', groupId: 'H', position: 2 }, label: '1J vs 2H' },
  { id: 'R32-15', stage: 'round-of-32', matchNumber: 87, homeSlot: { type: 'group-position', groupId: 'K', position: 1 }, awaySlot: { type: 'third-place-slot', winnerGroupId: 'K' }, label: '1K vs 3rd (DEIJL)' },
  { id: 'R32-16', stage: 'round-of-32', matchNumber: 88, homeSlot: { type: 'group-position', groupId: 'D', position: 2 }, awaySlot: { type: 'group-position', groupId: 'G', position: 2 }, label: '2D vs 2G' },
  { id: 'R16-1', stage: 'round-of-16', matchNumber: 89, homeSlot: { type: 'winner', matchId: 'R32-2' }, awaySlot: { type: 'winner', matchId: 'R32-5' }, label: 'W74 vs W77' },
  { id: 'R16-2', stage: 'round-of-16', matchNumber: 90, homeSlot: { type: 'winner', matchId: 'R32-1' }, awaySlot: { type: 'winner', matchId: 'R32-3' }, label: 'W73 vs W75' },
  { id: 'R16-3', stage: 'round-of-16', matchNumber: 91, homeSlot: { type: 'winner', matchId: 'R32-4' }, awaySlot: { type: 'winner', matchId: 'R32-6' }, label: 'W76 vs W78' },
  { id: 'R16-4', stage: 'round-of-16', matchNumber: 92, homeSlot: { type: 'winner', matchId: 'R32-7' }, awaySlot: { type: 'winner', matchId: 'R32-8' }, label: 'W79 vs W80' },
  { id: 'R16-5', stage: 'round-of-16', matchNumber: 93, homeSlot: { type: 'winner', matchId: 'R32-11' }, awaySlot: { type: 'winner', matchId: 'R32-12' }, label: 'W83 vs W84' },
  { id: 'R16-6', stage: 'round-of-16', matchNumber: 94, homeSlot: { type: 'winner', matchId: 'R32-9' }, awaySlot: { type: 'winner', matchId: 'R32-10' }, label: 'W81 vs W82' },
  { id: 'R16-7', stage: 'round-of-16', matchNumber: 95, homeSlot: { type: 'winner', matchId: 'R32-14' }, awaySlot: { type: 'winner', matchId: 'R32-16' }, label: 'W86 vs W88' },
  { id: 'R16-8', stage: 'round-of-16', matchNumber: 96, homeSlot: { type: 'winner', matchId: 'R32-13' }, awaySlot: { type: 'winner', matchId: 'R32-15' }, label: 'W85 vs W87' },
  { id: 'QF-1', stage: 'quarter-finals', matchNumber: 97, homeSlot: { type: 'winner', matchId: 'R16-1' }, awaySlot: { type: 'winner', matchId: 'R16-2' }, label: 'W89 vs W90' },
  { id: 'QF-2', stage: 'quarter-finals', matchNumber: 98, homeSlot: { type: 'winner', matchId: 'R16-5' }, awaySlot: { type: 'winner', matchId: 'R16-6' }, label: 'W93 vs W94' },
  { id: 'QF-3', stage: 'quarter-finals', matchNumber: 99, homeSlot: { type: 'winner', matchId: 'R16-3' }, awaySlot: { type: 'winner', matchId: 'R16-4' }, label: 'W91 vs W92' },
  { id: 'QF-4', stage: 'quarter-finals', matchNumber: 100, homeSlot: { type: 'winner', matchId: 'R16-7' }, awaySlot: { type: 'winner', matchId: 'R16-8' }, label: 'W95 vs W96' },
  { id: 'SF-1', stage: 'semi-finals', matchNumber: 101, homeSlot: { type: 'winner', matchId: 'QF-1' }, awaySlot: { type: 'winner', matchId: 'QF-2' }, label: 'W97 vs W98' },
  { id: 'SF-2', stage: 'semi-finals', matchNumber: 102, homeSlot: { type: 'winner', matchId: 'QF-3' }, awaySlot: { type: 'winner', matchId: 'QF-4' }, label: 'W99 vs W100' },
  { id: 'TP-1', stage: 'third-place', matchNumber: 103, homeSlot: { type: 'winner', matchId: 'SF-1' }, awaySlot: { type: 'winner', matchId: 'SF-2' }, label: '3rd Place' },
  { id: 'FINAL', stage: 'final', matchNumber: 104, homeSlot: { type: 'winner', matchId: 'SF-1' }, awaySlot: { type: 'winner', matchId: 'SF-2' }, label: 'Final' },
];

export const ALL_GROUP_IDS = GROUP_IDS;

export function getTeamById(id: string): Team | undefined {
  return teams.find((t) => t.id === id);
}

export function getTeamByFifaCode(code: string): Team | undefined {
  return teams.find((t) => t.fifaCode === code.toUpperCase());
}

export function getGroupById(id: GroupId): Group | undefined {
  return groups.find((g) => g.id === id);
}
