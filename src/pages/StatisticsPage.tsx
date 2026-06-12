import { motion } from 'framer-motion';
import { Crown, Medal, Shield, Target, Trophy } from 'lucide-react';
import { useStatistics } from '../hooks/useStatistics';
import { PageTransition } from '../components/PageTransition';
import { TeamBadge } from '../components/TeamBadge';

function StatCard({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-strong rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="text-wc-gold" size={24} />
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export function StatisticsPage() {
  const stats = useStatistics();

  return (
    <PageTransition>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Tournament Statistics</h2>
        <p className="text-white/50 text-sm">Auto-generated from match results</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={Target} title="Goals" delay={0}>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/40 uppercase mb-1">Most Goals Scored</p>
              {stats.topScorer ? (
                <div className="flex items-center justify-between">
                  <TeamBadge teamId={stats.topScorer.teamId} />
                  <span className="text-2xl font-bold text-wc-gold">{stats.topScorer.goals}</span>
                </div>
              ) : (
                <p className="text-white/40 text-sm">No goals scored yet</p>
              )}
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase mb-1">Least Goals Conceded</p>
              {stats.bestDefense ? (
                <div className="flex items-center justify-between">
                  <TeamBadge teamId={stats.bestDefense.teamId} />
                  <span className="text-2xl font-bold text-emerald-400">{stats.bestDefense.conceded}</span>
                </div>
              ) : (
                <p className="text-white/40 text-sm">No data yet</p>
              )}
            </div>
          </div>
        </StatCard>

        <StatCard icon={Shield} title="Qualification" delay={0.1}>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-emerald-400/80 uppercase mb-2">
                Qualified ({stats.qualified.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.qualified.length > 0 ? (
                  stats.qualified.map((id) => (
                    <TeamBadge key={id} teamId={id} size="sm" showName={false} />
                  ))
                ) : (
                  <p className="text-white/40 text-sm">Complete group stage</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-red-400/80 uppercase mb-2">
                Eliminated ({stats.eliminated.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.eliminated.length > 0 ? (
                  stats.eliminated.map((id) => (
                    <TeamBadge key={id} teamId={id} size="sm" showName={false} />
                  ))
                ) : (
                  <p className="text-white/40 text-sm">None yet</p>
                )}
              </div>
            </div>
          </div>
        </StatCard>

        <StatCard icon={Trophy} title="Tournament" delay={0.2}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Crown className="text-wc-gold shrink-0" size={20} />
              <div>
                <p className="text-xs text-white/40">Champion</p>
                {stats.champion ? (
                  <TeamBadge teamId={stats.champion} />
                ) : (
                  <span className="text-white/40 text-sm">TBD</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Medal className="text-gray-300 shrink-0" size={20} />
              <div>
                <p className="text-xs text-white/40">Runner-up</p>
                {stats.runnerUp ? (
                  <TeamBadge teamId={stats.runnerUp} />
                ) : (
                  <span className="text-white/40 text-sm">TBD</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Medal className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-xs text-white/40">Third Place</p>
                {stats.thirdPlace ? (
                  <TeamBadge teamId={stats.thirdPlace} />
                ) : (
                  <span className="text-white/40 text-sm">TBD</span>
                )}
              </div>
            </div>
          </div>
        </StatCard>
      </div>
    </PageTransition>
  );
}
