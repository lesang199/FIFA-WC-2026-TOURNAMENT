import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_GROUP_IDS } from '../data/worldcup2026';
import type { GroupId } from '../types';
import { useTournamentStore } from '../store/tournamentStore';
import { GroupTable } from '../components/GroupTable';
import { MatchCard } from '../components/MatchCard';
import { PageTransition } from '../components/PageTransition';
import { useThirdPlaceRanking } from '../hooks/useStandings';
import { useTeam } from '../hooks/useTeam';
import { TeamFlag } from '../components/TeamFlag';

export function GroupsPage() {
  const [activeGroup, setActiveGroup] = useState<GroupId>('A');
  const groupMatches = useTournamentStore((s) => s.groupMatches);
  const thirdPlaceRanking = useThirdPlaceRanking();

  const matchesForGroup = useMemo(
    () => groupMatches.filter((m) => m.groupId === activeGroup),
    [groupMatches, activeGroup],
  );

  const matchdays = useMemo(() => {
    const md = new Map<number, typeof matchesForGroup>();
    for (const m of matchesForGroup) {
      const list = md.get(m.matchday) ?? [];
      list.push(m);
      md.set(m.matchday, list);
    }
    return md;
  }, [matchesForGroup]);

  return (
    <PageTransition>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Group Stage</h2>
        <p className="text-white/50 text-sm">72 matches · 12 groups · Top 2 + 8 best third-place advance</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_GROUP_IDS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setActiveGroup(g)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeGroup === g
                ? 'bg-wc-gold text-wc-dark shadow-lg shadow-wc-gold/20'
                : 'glass text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="lg:sticky lg:top-[140px]">
            <GroupTable groupId={activeGroup} />
          </div>
        </div>

        <div className="glass-strong rounded-xl overflow-hidden flex flex-col h-[580px] lg:h-[620px] border border-white/10">
          <div className="bg-gradient-to-r from-wc-blue/60 to-wc-green/30 px-4 py-3 shrink-0 border-b border-white/10">
            <h3 className="font-bold text-lg">Fixtures — Group {activeGroup}</h3>
          </div>
          <div className="overflow-y-auto p-4 custom-scrollbar flex-1 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGroup}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {[1, 2, 3].map((day) => (
                  <div key={day}>
                    <h4 className="text-sm text-wc-gold font-medium mb-3">Matchday {day}</h4>
                    <div className="space-y-3">
                      {(matchdays.get(day as 1 | 2 | 3) ?? []).map((m) => (
                        <MatchCard key={m.id} match={m} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="glass-strong rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Third Place Ranking (Best 8 Qualify)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/50 border-b border-white/10">
                <th className="py-2 px-3 text-left">Rank</th>
                <th className="py-2 px-3 text-left">Team</th>
                <th className="py-2 px-3 text-center">Pts</th>
                <th className="py-2 px-3 text-center">GD</th>
                <th className="py-2 px-3 text-center">GF</th>
                <th className="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {thirdPlaceRanking.map((s, i) => (
                <ThirdPlaceRow key={s.teamId} standing={s} rank={i + 1} isCutline={i === 7} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}

function ThirdPlaceRow({
  standing,
  rank,
  isCutline,
}: {
  standing: ReturnType<typeof useThirdPlaceRanking>[number];
  rank: number;
  isCutline: boolean;
}) {
  const team = useTeam(standing.teamId);

  return (
    <tr
      className={`border-b border-white/5 ${isCutline ? 'border-b-2 border-wc-gold/50' : ''
        }`}
    >
      <td className="py-2.5 px-3 font-bold text-wc-gold">{rank}</td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white/50 mr-2 shrink-0">{standing.groupId}</span>
          {team && (
            <>
              <TeamFlag
                isoCode={team.isoCode}
                name={team.name}
                size="sm"
                shape="rounded"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-wc-gold text-xs tracking-wider">{team.fifaCode}</span>
                </div>
                <span className="font-medium text-sm truncate block">{team.name}</span>
              </div>
            </>
          )}
        </div>
      </td>
      <td className="py-2.5 px-3 text-center">{standing.points}</td>
      <td className="py-2.5 px-3 text-center">{standing.goalDifference}</td>
      <td className="py-2.5 px-3 text-center">{standing.goalsFor}</td>
      <td className="py-2.5 px-3 text-center">
        {standing.qualified ? (
          <span className="text-emerald-400 font-medium">Qualified</span>
        ) : (
          <span className="text-red-400/70">Eliminated</span>
        )}
      </td>
    </tr>
  );
}
