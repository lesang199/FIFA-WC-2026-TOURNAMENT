import { create } from 'zustand';
import { groups, groupFixtures } from '../data/worldcup2026';
import type { GroupId, GroupMatch, KnockoutMatch, Standing } from '../types';
import { generateRoundOf32, propagateKnockoutWinners } from '../utils/knockout';
import { calculateAllStandings, isGroupStageComplete } from '../utils/standings';
import { applyQualificationStatus } from '../utils/thirdPlace';

const STORAGE_KEY = 'wc2026-tournament';

interface PersistedState {
  groupMatches: GroupMatch[];
  knockoutMatches: KnockoutMatch[];
  fairPlayOverrides: Record<string, number>;
}

interface TournamentState extends PersistedState {
  standings: Standing[];
  groupStageComplete: boolean;
  setGroupScore: (matchId: string, homeScore: number | null, awayScore: number | null) => void;
  setKnockoutScore: (
    matchId: string,
    field: keyof Pick<GroupMatch, 'homeScore' | 'awayScore' | 'extraTimeHome' | 'extraTimeAway' | 'penaltyHome' | 'penaltyAway'>,
    value: number | null,
  ) => void;
  setFairPlay: (teamId: string, points: number) => void;
  exportTournament: () => string;
  importTournament: (json: string) => boolean;
  resetTournament: () => void;
}

function recompute(state: PersistedState): Pick<TournamentState, 'standings' | 'knockoutMatches' | 'groupStageComplete'> {
  const rawStandings = calculateAllStandings(groups, state.groupMatches, state.fairPlayOverrides);
  const complete = isGroupStageComplete(groups, state.groupMatches);
  const standings = complete ? applyQualificationStatus(rawStandings) : rawStandings;

  let knockoutMatches = state.knockoutMatches;

  if (complete) {
    const previousScores = new Map(
      knockoutMatches.map((m) => [
        m.id,
        {
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          extraTimeHome: m.extraTimeHome,
          extraTimeAway: m.extraTimeAway,
          penaltyHome: m.penaltyHome,
          penaltyAway: m.penaltyAway,
        },
      ]),
    );

    knockoutMatches = generateRoundOf32(standings);

    knockoutMatches = knockoutMatches.map((m) => {
      const prev = previousScores.get(m.id);
      if (!prev) return m;
      return { ...m, ...prev };
    });

    knockoutMatches = propagateKnockoutWinners(knockoutMatches);
  } else {
    knockoutMatches = [];
  }

  return { standings, knockoutMatches, groupStageComplete: complete };
}

function getInitialState(): PersistedState {
  return {
    groupMatches: groupFixtures.map((m) => ({ ...m })),
    knockoutMatches: [],
    fairPlayOverrides: {},
  };
}

function loadFromStorage(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || !Array.isArray(parsed.groupMatches)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(state: PersistedState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createInitialStore(): TournamentState {
  const persisted = loadFromStorage() ?? getInitialState();
  const computed = recompute(persisted);

  return {
    ...persisted,
    ...computed,
    setGroupScore: () => {},
    setKnockoutScore: () => {},
    setFairPlay: () => {},
    exportTournament: () => '',
    importTournament: () => false,
    resetTournament: () => {},
  };
}

export const useTournamentStore = create<TournamentState>((set, get) => {
  const initial = createInitialStore();

  const persistAndRecompute = (partial: Partial<PersistedState>) => {
    const current = get();
    const next: PersistedState = {
      groupMatches: partial.groupMatches ?? current.groupMatches,
      knockoutMatches: partial.knockoutMatches ?? current.knockoutMatches,
      fairPlayOverrides: partial.fairPlayOverrides ?? current.fairPlayOverrides,
    };
    const computed = recompute(next);
    saveToStorage(next);
    set({ ...next, ...computed });
  };

  return {
    ...initial,

    setGroupScore: (matchId, homeScore, awayScore) => {
      const groupMatches = get().groupMatches.map((m) =>
        m.id === matchId ? { ...m, homeScore, awayScore } : m,
      );
      persistAndRecompute({ groupMatches, knockoutMatches: get().knockoutMatches });
    },

    setKnockoutScore: (matchId, field, value) => {
      const knockoutMatches = get().knockoutMatches.map((m) =>
        m.id === matchId ? { ...m, [field]: value } : m,
      );
      const withPropagation = propagateKnockoutWinners(knockoutMatches);
      persistAndRecompute({ knockoutMatches: withPropagation });
    },

    setFairPlay: (teamId, points) => {
      const fairPlayOverrides = { ...get().fairPlayOverrides, [teamId]: points };
      persistAndRecompute({ fairPlayOverrides });
    },

    exportTournament: () => {
      const { groupMatches, knockoutMatches } = get();
      const data = {
        matches: groupMatches,
        standings: get().standings,
        knockout: knockoutMatches,
      };
      return JSON.stringify(data, null, 2);
    },

    importTournament: (json) => {
      try {
        const data = JSON.parse(json) as {
          matches?: GroupMatch[];
          knockout?: KnockoutMatch[];
          fairPlayOverrides?: Record<string, number>;
        };
        if (!data.matches) return false;
        persistAndRecompute({
          groupMatches: data.matches,
          knockoutMatches: data.knockout ?? [],
          fairPlayOverrides: data.fairPlayOverrides ?? {},
        });
        return true;
      } catch {
        return false;
      }
    },

    resetTournament: () => {
      const fresh = getInitialState();
      const computed = recompute(fresh);
      saveToStorage(fresh);
      set({ ...fresh, ...computed });
    },
  };
});

export function getGroupMatches(groupId: GroupId): GroupMatch[] {
  return useTournamentStore.getState().groupMatches.filter((m) => m.groupId === groupId);
}
