import { useMemo, useState } from 'react';
import { teams } from '../data/worldcup2026';
import { TeamBadge } from '../components/TeamBadge';
import type { FilterStage, GroupId } from '../types';
import { useTournamentStore } from '../store/tournamentStore';
import { SearchBar } from '../components/SearchBar';
import { MatchCard } from '../components/MatchCard';
import { KnockoutMatchCard } from '../components/KnockoutMatchCard';
import { PageTransition } from '../components/PageTransition';
export function SearchPage() {
  const [query, setQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<GroupId | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<FilterStage>('all');
  const groupMatches = useTournamentStore((s) => s.groupMatches);
  const knockoutMatches = useTournamentStore((s) => s.knockoutMatches);

  const matchingTeamIds = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return new Set(teams.map((t) => t.id));
    return new Set(
      teams
        .filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.fifaCode.toLowerCase().includes(q),
        )
        .map((t) => t.id),
    );
  }, [query]);

  const filteredGroupMatches = useMemo(() => {
    return groupMatches.filter((m) => {
      if (stageFilter === 'knockout') return false;
      if (groupFilter !== 'all' && m.groupId !== groupFilter) return false;
      return (
        matchingTeamIds.has(m.homeTeamId) || matchingTeamIds.has(m.awayTeamId)
      );
    });
  }, [groupMatches, groupFilter, stageFilter, matchingTeamIds]);

  const filteredKnockoutMatches = useMemo(() => {
    if (stageFilter === 'group') return [];
    return knockoutMatches.filter((m) => {
      if (!m.homeTeamId && !m.awayTeamId) return false;
      const homeMatch = m.homeTeamId ? matchingTeamIds.has(m.homeTeamId) : false;
      const awayMatch = m.awayTeamId ? matchingTeamIds.has(m.awayTeamId) : false;
      return homeMatch || awayMatch;
    });
  }, [knockoutMatches, stageFilter, matchingTeamIds]);

  return (
    <PageTransition>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Search</h2>
        <p className="text-white/50 text-sm">Find teams and their matches</p>
      </div>

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        groupFilter={groupFilter}
        onGroupFilterChange={setGroupFilter}
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
      />

      <div className="mt-6 space-y-6">
        {filteredGroupMatches.length > 0 && (
          <section>
            <h3 className="font-bold mb-3 text-wc-gold">
              Group Stage ({filteredGroupMatches.length} matches)
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {filteredGroupMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        )}

        {filteredKnockoutMatches.length > 0 && (
          <section>
            <h3 className="font-bold mb-3 text-wc-gold">
              Knockout ({filteredKnockoutMatches.length} matches)
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {filteredKnockoutMatches.map((m) => (
                <KnockoutMatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        )}

        {filteredGroupMatches.length === 0 && filteredKnockoutMatches.length === 0 && (
          <div className="glass rounded-xl p-12 text-center text-white/40">
            {query ? (
              <p>No matches found for &quot;{query}&quot;</p>
            ) : (
              <p>Enter a team name to search</p>
            )}
          </div>
        )}
      </div>

      {query && (
        <div className="mt-8 glass rounded-xl p-4">
          <h3 className="text-sm text-white/50 mb-2">Matching Teams</h3>
          <div className="flex flex-wrap gap-3">
            {teams
              .filter((t) => matchingTeamIds.has(t.id))
              .map((t) => (
                <TeamBadge key={t.id} teamId={t.id} size="sm" />
              ))}
          </div>
        </div>
      )}
    </PageTransition>
  );
}
