import { memo, useState } from 'react';
import { getCrestUrl } from '../utils/teamAssets';
import { TeamFlag } from './TeamFlag';

interface TeamCrestProps {
  fifaCode: string;
  isoCode: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = { sm: 24, md: 32, lg: 48 };

function TeamCrestComponent({ fifaCode, isoCode, name, size = 'md' }: TeamCrestProps) {
  const [failed, setFailed] = useState(false);
  const px = SIZE_MAP[size];

  if (failed) {
    return <TeamFlag isoCode={isoCode} name={name} size={size} shape="rounded" />;
  }

  return (
    <img
      src={getCrestUrl(fifaCode)}
      alt={`${name} crest`}
      width={px}
      height={px}
      loading="lazy"
      onError={() => setFailed(true)}
      className="object-contain shrink-0 drop-shadow-sm"
      style={{ width: px, height: px }}
    />
  );
}

export const TeamCrest = memo(TeamCrestComponent);
