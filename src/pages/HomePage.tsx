import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Users, Zap } from 'lucide-react';
import { useTournamentStore } from '../store/tournamentStore';
import { useStatistics } from '../hooks/useStatistics';
import { teams } from '../data/worldcup2026';
import { PageTransition } from '../components/PageTransition';
import { TeamBadge } from '../components/TeamBadge';
import heroBg from '../assets/wc2026-bg.png';

export function HomePage() {
  const groupStageComplete = useTournamentStore((s) => s.groupStageComplete);
  const groupMatches = useTournamentStore((s) => s.groupMatches);
  const stats = useStatistics();

  const playedGroup = groupMatches.filter(
    (m) => m.homeScore !== null && m.awayScore !== null,
  ).length;

  const features = [
    {
      icon: Users,
      title: '48 Teams · 12 Groups',
      desc: 'Official FIFA World Cup 2026 draw with all confirmed participants.',
    },
    {
      icon: Zap,
      title: 'Live Standings',
      desc: 'FIFA ranking rules with head-to-head, fair play, and third-place cutline.',
    },
    {
      icon: Trophy,
      title: 'Full Knockout',
      desc: 'Round of 32 through Final with extra time and penalty shootouts.',
    },
  ];

  return (
    <PageTransition>
      <section className="relative overflow-hidden rounded-2xl glass-strong p-8 md:p-12 mb-8 min-h-[380px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wc-dark via-wc-dark/90 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black mb-4"
          >
            Simulate the{' '}
            <span className="bg-gradient-to-r from-wc-gold via-yellow-300 to-wc-gold bg-clip-text text-transparent">
              Greatest Show
            </span>
          </motion.h2>
          <p className="text-white/60 text-lg max-w-2xl mb-6">
            Enter scores for all 72 group matches and watch standings update instantly.
            The knockout bracket generates automatically when the group stage completes.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="glass rounded-lg px-4 py-2">
              <span className="text-wc-gold font-bold text-2xl">{playedGroup}</span>
              <span className="text-white/50 text-sm"> / 72 group matches</span>
            </div>
            <div className="glass rounded-lg px-4 py-2">
              <span className="text-wc-gold font-bold text-2xl">{teams.length}</span>
              <span className="text-white/50 text-sm"> teams</span>
            </div>
            {groupStageComplete && (
              <div className="glass rounded-lg px-4 py-2 border border-emerald-500/30">
                <span className="text-emerald-400 font-medium text-sm">Group stage complete ✓</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/groups"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-wc-gold text-wc-dark font-bold hover:bg-yellow-400 transition-colors"
            >
              Start Simulating <ArrowRight size={18} />
            </Link>
            {groupStageComplete && (
              <Link
                to="/knockout"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 font-medium hover:bg-white/15 transition-colors"
              >
                View Bracket <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-6"
          >
            <f.icon className="text-wc-gold mb-3" size={28} />
            <h3 className="font-bold mb-2">{f.title}</h3>
            <p className="text-white/50 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {stats.champion && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-strong rounded-xl p-6 mb-8 border border-wc-gold/30 text-center"
        >
          <Trophy className="mx-auto text-wc-gold mb-2" size={40} />
          <h3 className="text-2xl font-bold">Champion Crowned!</h3>
          <div className="flex justify-center mt-4">
            <TeamBadge teamId={stats.champion} size="lg" layout="stacked" />
          </div>
        </motion.div>
      )}


    </PageTransition>
  );
}
