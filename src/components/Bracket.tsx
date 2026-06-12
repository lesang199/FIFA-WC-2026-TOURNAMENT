import { memo, useMemo } from 'react';
import type { KnockoutMatch } from '../types';
import { KnockoutMatchCard } from './KnockoutMatchCard';

interface BracketProps {
  matches: KnockoutMatch[];
}

// Left side matches
const LEFT_R32 = ['R32-1', 'R32-2', 'R32-3', 'R32-4', 'R32-5', 'R32-6', 'R32-7', 'R32-8'];
const LEFT_R16 = ['R16-1', 'R16-2', 'R16-3', 'R16-4'];
const LEFT_QF = ['QF-1', 'QF-3'];

// Right side matches
const RIGHT_R32 = ['R32-9', 'R32-10', 'R32-11', 'R32-12', 'R32-13', 'R32-14', 'R32-15', 'R32-16'];
const RIGHT_R16 = ['R16-5', 'R16-6', 'R16-7', 'R16-8'];
const RIGHT_QF = ['QF-2', 'QF-4'];

function BracketColumn({
  title,
  matches,
}: {
  title: string;
  matches: KnockoutMatch[];
}) {
  return (
    <div className="flex flex-col min-w-[280px] w-[280px]">
      <h3 className="text-xs font-bold text-wc-gold uppercase tracking-wider mb-4 text-center sticky top-0 bg-wc-dark/95 backdrop-blur py-2 rounded-lg z-10 border border-white/5">
        {title}
      </h3>
      <div className="flex flex-col justify-around h-full min-h-[760px] py-2">
        {matches.map((match) => (
          <KnockoutMatchCard key={match.id} match={match} compact />
        ))}
      </div>
    </div>
  );
}

function CenterColumn({
  sf1,
  sf2,
  finalMatch,
  thirdPlaceMatch,
}: {
  sf1: KnockoutMatch | undefined;
  sf2: KnockoutMatch | undefined;
  finalMatch: KnockoutMatch | undefined;
  thirdPlaceMatch: KnockoutMatch | undefined;
}) {
  return (
    <div className="flex flex-col min-w-[300px] w-[300px]">
      <h3 className="text-xs font-bold text-wc-gold uppercase tracking-wider mb-4 text-center sticky top-0 bg-wc-dark/95 backdrop-blur py-2 rounded-lg z-10 border border-white/5">
        Finals
      </h3>
      <div className="flex flex-col justify-around h-full min-h-[760px] py-2">
        {/* Semi-Final 1 */}
        {sf1 ? (
          <div className="space-y-1">
            <h4 className="text-[10px] text-center text-wc-gold/70 font-bold uppercase tracking-wider">
              Semi-Final 1 (Left vs Right)
            </h4>
            <KnockoutMatchCard match={sf1} compact />
          </div>
        ) : (
          <div className="h-16" />
        )}

        {/* Final & Third Place */}
        <div className="space-y-8">
          {finalMatch ? (
            <div className="space-y-1.5 scale-105 transform transition-all duration-300 hover:scale-110">
              <h4 className="text-xs text-center text-wc-gold font-black uppercase tracking-widest flex items-center justify-center gap-1 animate-pulse">
                🏆 World Cup Final
              </h4>
              <KnockoutMatchCard match={finalMatch} />
            </div>
          ) : (
            <div className="h-24" />
          )}

          {thirdPlaceMatch ? (
            <div className="space-y-1 opacity-90">
              <h4 className="text-[10px] text-center text-white/50 font-bold uppercase tracking-wider">
                Third Place Playoff
              </h4>
              <KnockoutMatchCard match={thirdPlaceMatch} compact />
            </div>
          ) : (
            <div className="h-16" />
          )}
        </div>

        {/* Semi-Final 2 */}
        {sf2 ? (
          <div className="space-y-1">
            <h4 className="text-[10px] text-center text-wc-gold/70 font-bold uppercase tracking-wider">
              Semi-Final 2 (Left vs Right)
            </h4>
            <KnockoutMatchCard match={sf2} compact />
          </div>
        ) : (
          <div className="h-16" />
        )}
      </div>
    </div>
  );
}

function BracketComponent({ matches }: BracketProps) {
  const data = useMemo(() => {
    const leftR32 = matches.filter((m) => LEFT_R32.includes(m.id));
    const leftR16 = matches.filter((m) => LEFT_R16.includes(m.id));
    const leftQF = matches.filter((m) => LEFT_QF.includes(m.id));

    const rightR32 = matches.filter((m) => RIGHT_R32.includes(m.id));
    const rightR16 = matches.filter((m) => RIGHT_R16.includes(m.id));
    const rightQF = matches.filter((m) => RIGHT_QF.includes(m.id));

    const sf1 = matches.find((m) => m.id === 'SF-1');
    const sf2 = matches.find((m) => m.id === 'SF-2');
    const finalMatch = matches.find((m) => m.id === 'FINAL');
    const thirdPlaceMatch = matches.find((m) => m.id === 'TP-1');

    return {
      leftR32,
      leftR16,
      leftQF,
      rightR32,
      rightR16,
      rightQF,
      sf1,
      sf2,
      finalMatch,
      thirdPlaceMatch,
    };
  }, [matches]);

  if (matches.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center border border-white/5">
        <p className="text-white/50 text-lg">Complete all group stage matches to generate the knockout bracket.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-6 min-w-max px-2 py-4 items-stretch justify-center">
          {/* Left Branch */}
          <BracketColumn title="Round of 32 (Left)" matches={data.leftR32} />
          <BracketColumn title="Round of 16 (Left)" matches={data.leftR16} />
          <BracketColumn title="Quarter-Finals (Left)" matches={data.leftQF} />

          {/* Central Finals */}
          <CenterColumn
            sf1={data.sf1}
            sf2={data.sf2}
            finalMatch={data.finalMatch}
            thirdPlaceMatch={data.thirdPlaceMatch}
          />

          {/* Right Branch */}
          <BracketColumn title="Quarter-Finals (Right)" matches={data.rightQF} />
          <BracketColumn title="Round of 16 (Right)" matches={data.rightR16} />
          <BracketColumn title="Round of 32 (Right)" matches={data.rightR32} />
        </div>
      </div>
    </div>
  );
}

export const Bracket = memo(BracketComponent);
