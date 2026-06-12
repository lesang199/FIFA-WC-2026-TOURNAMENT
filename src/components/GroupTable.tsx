import { memo } from 'react';
import { motion } from 'framer-motion';
import type { GroupId } from '../types';
import { useGroupStandings } from '../hooks/useStandings';
import { useTeam } from '../hooks/useTeam';
import { TeamFlag } from './TeamFlag';

interface GroupTableProps {
  groupId: GroupId;
}

function StandingRow({ teamId, standing }: { teamId: string; standing: ReturnType<typeof useGroupStandings>[number] }) {
  const team = useTeam(teamId);

  if (!team) return null;

  const statusClass = standing.qualified
    ? 'text-emerald-400'
    : standing.eliminated
      ? 'text-red-400/70'
      : 'text-white/60';

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-2.5 px-2 text-center font-bold text-wc-gold">{standing.position}</td>
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-2 min-w-0">
          <TeamFlag
            isoCode={team.isoCode}
            name={team.name}
            size="sm"
            shape="rounded"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-wc-gold text-xs tracking-wider">{team.fifaCode}</span>
              {standing.qualified && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                  Q
                </span>
              )}
              {standing.eliminated && standing.position === 3 && (
                <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
                  OUT
                </span>
              )}
            </div>
            <span className="font-medium text-sm truncate block">{team.name}</span>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-2 text-center text-sm">{standing.played}</td>
      <td className="py-2.5 px-2 text-center text-sm hidden sm:table-cell">{standing.wins}</td>
      <td className="py-2.5 px-2 text-center text-sm hidden sm:table-cell">{standing.draws}</td>
      <td className="py-2.5 px-2 text-center text-sm hidden sm:table-cell">{standing.losses}</td>
      <td className="py-2.5 px-2 text-center text-sm">{standing.goalsFor}</td>
      <td className="py-2.5 px-2 text-center text-sm hidden md:table-cell">{standing.goalsAgainst}</td>
      <td className={`py-2.5 px-2 text-center text-sm font-medium ${standing.goalDifference >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
      </td>
      <td className={`py-2.5 px-2 text-center font-bold ${statusClass}`}>{standing.points}</td>
    </tr>
  );
}

function GroupTableComponent({ groupId }: GroupTableProps) {
  const standings = useGroupStandings(groupId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-strong rounded-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-wc-blue/60 to-wc-green/30 px-4 py-3">
        <h3 className="font-bold text-lg">Group {groupId}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-white/90">
          <thead>
            <tr className="text-xs text-white/50 border-b border-white/10">
              <th className="py-2 px-2 text-center w-8">#</th>
              <th className="py-2 px-2 text-left">Team</th>
              <th className="py-2 px-2 text-center w-8">P</th>
              <th className="py-2 px-2 text-center w-8 hidden sm:table-cell">W</th>
              <th className="py-2 px-2 text-center w-8 hidden sm:table-cell">D</th>
              <th className="py-2 px-2 text-center w-8 hidden sm:table-cell">L</th>
              <th className="py-2 px-2 text-center w-8">GF</th>
              <th className="py-2 px-2 text-center w-8 hidden md:table-cell">GA</th>
              <th className="py-2 px-2 text-center w-10">GD</th>
              <th className="py-2 px-2 text-center w-10">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <StandingRow key={s.teamId} teamId={s.teamId} standing={s} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export const GroupTable = memo(GroupTableComponent);
