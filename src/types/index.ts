export type GroupId =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export type KnockoutStage =
  | 'round-of-32'
  | 'round-of-16'
  | 'quarter-finals'
  | 'semi-finals'
  | 'third-place'
  | 'final';

export type TeamPosition = 1 | 2 | 3 | 4;

export interface Team {
  id: string;
  /** FIFA official full country name */
  name: string;
  /** FIFA 3-letter country code (e.g. MEX, BRA, ENG) */
  fifaCode: string;
  /** ISO 3166-1 alpha-2 for flag images (gb-eng, gb-sct for home nations) */
  isoCode: string;
  fifaRanking: number;
  confederation: 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';
}

export interface Group {
  id: GroupId;
  teamIds: [string, string, string, string];
}

export interface MatchResult {
  homeScore: number | null;
  awayScore: number | null;
  extraTimeHome: number | null;
  extraTimeAway: number | null;
  penaltyHome: number | null;
  penaltyAway: number | null;
}

export interface GroupMatch extends MatchResult {
  id: string;
  groupId: GroupId;
  matchday: 1 | 2 | 3;
  homeTeamId: string;
  awayTeamId: string;
}

export interface Standing {
  teamId: string;
  groupId: GroupId;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  fairPlayPoints: number;
  position: TeamPosition;
  qualified: boolean;
  eliminated: boolean;
  qualificationType?: 'winner' | 'runner-up' | 'third-place' | 'fourth-place';
}

export interface ThirdPlaceStanding extends Standing {
  thirdPlaceRank: number | null;
  thirdPlaceQualified: boolean;
}

export type KnockoutSlotRef =
  | { type: 'group-position'; groupId: GroupId; position: 1 | 2 | 3 }
  | { type: 'winner'; matchId: string }
  | { type: 'third-place-slot'; winnerGroupId: GroupId };

export interface KnockoutMatch extends MatchResult {
  id: string;
  stage: KnockoutStage;
  matchNumber: number;
  homeSlot: KnockoutSlotRef;
  awaySlot: KnockoutSlotRef;
  homeTeamId: string | null;
  awayTeamId: string | null;
  label: string;
}

export interface KnockoutTemplate {
  id: string;
  stage: KnockoutStage;
  matchNumber: number;
  homeSlot: KnockoutSlotRef;
  awaySlot: KnockoutSlotRef;
  label: string;
}

export interface TournamentExport {
  version: 1;
  matches: GroupMatch[];
  knockout: KnockoutMatch[];
  fairPlayOverrides: Record<string, number>;
  exportedAt: string;
}

export interface TournamentStats {
  topScorer: { teamId: string; goals: number } | null;
  bestDefense: { teamId: string; conceded: number } | null;
  qualified: string[];
  eliminated: string[];
  champion: string | null;
  runnerUp: string | null;
  thirdPlace: string | null;
}

export type FilterStage = 'all' | 'group' | 'knockout';
