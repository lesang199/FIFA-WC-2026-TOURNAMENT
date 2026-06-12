import { memo } from 'react';
import { Search } from 'lucide-react';
import type { FilterStage, GroupId } from '../types';
import { ALL_GROUP_IDS } from '../data/worldcup2026';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  groupFilter: GroupId | 'all';
  onGroupFilterChange: (g: GroupId | 'all') => void;
  stageFilter: FilterStage;
  onStageFilterChange: (s: FilterStage) => void;
}

function SearchBarComponent({
  query,
  onQueryChange,
  groupFilter,
  onGroupFilterChange,
  stageFilter,
  onStageFilterChange,
}: SearchBarProps) {
  return (
    <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="search"
          placeholder="Search team name..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-wc-gold/50"
        />
      </div>
      <select
        value={groupFilter}
        onChange={(e) => onGroupFilterChange(e.target.value as GroupId | 'all')}
        className="px-4 py-2.5 rounded-lg bg-black/30 border border-white/15 text-white focus:outline-none focus:border-wc-gold/50"
      >
        <option value="all">All Groups</option>
        {ALL_GROUP_IDS.map((g) => (
          <option key={g} value={g}>
            Group {g}
          </option>
        ))}
      </select>
      <select
        value={stageFilter}
        onChange={(e) => onStageFilterChange(e.target.value as FilterStage)}
        className="px-4 py-2.5 rounded-lg bg-black/30 border border-white/15 text-white focus:outline-none focus:border-wc-gold/50"
      >
        <option value="all">All Stages</option>
        <option value="group">Group Stage</option>
        <option value="knockout">Knockout</option>
      </select>
    </div>
  );
}

export const SearchBar = memo(SearchBarComponent);
