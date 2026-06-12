import { useTournamentStore } from '../store/tournamentStore';
import { Bracket } from '../components/Bracket';
import { PageTransition } from '../components/PageTransition';

export function KnockoutPage() {
  const knockoutMatches = useTournamentStore((s) => s.knockoutMatches);
  const groupStageComplete = useTournamentStore((s) => s.groupStageComplete);

  return (
    <PageTransition>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Knockout Stage</h2>
        <p className="text-white/50 text-sm">
          Round of 32 → Round of 16 → Quarter Finals → Semi Finals → Final
        </p>
      </div>

      {!groupStageComplete && (
        <div className="glass rounded-xl p-6 mb-6 border border-amber-500/30 bg-amber-500/5">
          <p className="text-amber-200/90 text-sm">
            Complete all 72 group stage matches to automatically generate the Round of 32 bracket
            using official FIFA Annex C third-place mapping rules.
          </p>
        </div>
      )}

      <Bracket matches={knockoutMatches} />
    </PageTransition>
  );
}
