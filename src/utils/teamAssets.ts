import type { ComponentType, SVGProps } from 'react';
import * as FlagIcons from 'country-flag-icons/react/3x2';

type FlagComponent = ComponentType<SVGProps<SVGSVGElement>>;

const FLAGS = FlagIcons as Record<string, FlagComponent>;

function isoToFlagKey(isoCode: string): string {
  if (isoCode === 'gb-eng') return 'GB_ENG';
  if (isoCode === 'gb-sct') return 'GB_SCT';
  return isoCode.toUpperCase();
}

export function getFlagComponent(isoCode: string): FlagComponent | null {
  return FLAGS[isoToFlagKey(isoCode)] ?? null;
}

/** National team crest — bundled in /public/crests/{fifaCode}.png */
export function getCrestUrl(fifaCode: string): string {
  return `/crests/${fifaCode}.png`;
}
