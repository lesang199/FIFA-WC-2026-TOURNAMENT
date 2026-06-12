import { memo } from 'react';
import { useTeam } from '../hooks/useTeam';
import { TeamCrest } from './TeamCrest';
import { TeamFlag } from './TeamFlag';

interface TeamBadgeProps {
  teamId: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showCode?: boolean;
  showCrest?: boolean;
  showFlag?: boolean;
  layout?: 'horizontal' | 'stacked';
  align?: 'left' | 'right';
}

function TeamBadgeComponent({
  teamId,
  size = 'md',
  showName = true,
  showCode = true,
  showCrest = false,
  showFlag = true,
  layout = 'horizontal',
  align = 'left',
}: TeamBadgeProps) {
  const team = useTeam(teamId);

  if (!team) {
    return <span className="text-white/40 italic text-sm">TBD</span>;
  }

  const nameSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';
  const codeSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs';

  const icons = (
    <div className="flex items-center gap-1.5 shrink-0">
      {showCrest && (
        <TeamCrest
          fifaCode={team.fifaCode}
          isoCode={team.isoCode}
          name={team.name}
          size={size}
        />
      )}
      {showFlag && (
        <TeamFlag isoCode={team.isoCode} name={team.name} size={size} />
      )}
    </div>
  );

  if (layout === 'stacked') {
    return (
      <div className="flex flex-col items-center gap-1 min-w-0 text-center">
        {icons}
        {showCode && (
          <span className={`font-black text-wc-gold tracking-wider ${codeSize}`}>
            {team.fifaCode}
          </span>
        )}
        {showName && (
          <span className={`font-medium leading-tight ${nameSize}`}>{team.name}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full flex items-center gap-2 min-w-0 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      {icons}
      <div className={`min-w-0 flex flex-col justify-center ${align === 'right' ? 'items-end' : 'items-start'}`}>
        {showCode && (
          <span className={`font-black text-wc-gold leading-tight tracking-wider shrink-0 ${codeSize}`}>
            {team.fifaCode}
          </span>
        )}
        {showName && (
          <span
            className={`text-white/60 font-medium leading-tight truncate block ${
              size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]'
            }`}
            title={team.name}
          >
            {team.name}
          </span>
        )}
      </div>
    </div>
  );
}

export const TeamBadge = memo(TeamBadgeComponent);
