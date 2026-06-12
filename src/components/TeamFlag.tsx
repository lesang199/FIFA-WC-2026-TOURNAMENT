import { memo } from 'react';
import { getFlagComponent } from '../utils/teamAssets';

interface TeamFlagProps {
  isoCode: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded';
  className?: string;
}

const SIZE_MAP = { sm: 20, md: 28, lg: 40 };

function TeamFlagComponent({
  isoCode,
  name,
  size = 'md',
  shape = 'rounded',
  className = '',
}: TeamFlagProps) {
  const px = SIZE_MAP[size];
  const height = px;
  const width = Math.round(px * 1.5);
  const Flag = getFlagComponent(isoCode);
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-md';

  if (!Flag) {
    return (
      <span
        className={`inline-flex items-center justify-center bg-white/10 text-white/40 text-[10px] font-bold shrink-0 ${radius} ${className}`}
        style={{ width: width, height: height }}
        title={name}
      >
        ?
      </span>
    );
  }

  return (
    <span
      className={`inline-flex overflow-hidden shrink-0 ring-1 ring-white/20 ${radius} ${className}`}
      style={{ width: width, height: height }}
      title={`${name} flag`}
    >
      <Flag
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
        aria-label={`${name} flag`}
      />
    </span>
  );
}

export const TeamFlag = memo(TeamFlagComponent);
