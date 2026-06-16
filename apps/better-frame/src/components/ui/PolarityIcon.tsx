// Polarity icon component — renders Warframe polarity symbols
import type { Polarity } from '../../types';

interface PolarityIconProps {
  polarity: Polarity | null;
  size?: number;
  className?: string;
}

// SVG path data for each polarity symbol
const POLARITY_PATHS: Record<Polarity, string> = {
  madurai:
    'M12 2L4 22h16L12 2z', // upward triangle (V shape)
  vazarin:
    'M12 22L4 2h16L12 22z', // downward triangle
  naramon:
    'M12 2L2 12l10 10 10-10L12 2z', // dash/diamond
  zenurik:
    'M6 4h12v16H6V4z', // rectangle
  unairu:
    'M12 2l10 10-10 10L2 12 12 2z', // rotated square
  penjaga:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z', // circle with inner circle
  umbra:
    'M12 2L2 12h6v10h8V12h6L12 2z', // umbrella/arrow shape
  aura:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', // circle
};

const POLARITY_COLORS: Record<Polarity, string> = {
  madurai: 'var(--color-wf-polarity-madurai)',
  vazarin: 'var(--color-wf-polarity-vazarin)',
  naramon: 'var(--color-wf-polarity-naramon)',
  zenurik: 'var(--color-wf-polarity-zenurik)',
  unairu: 'var(--color-wf-polarity-unairu)',
  penjaga: 'var(--color-wf-polarity-penjaga)',
  umbra: 'var(--color-wf-polarity-umbra)',
  aura: 'var(--color-wf-gold)',
};

export function PolarityIcon({ polarity, size = 16, className = '' }: PolarityIconProps) {
  if (!polarity) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={`opacity-30 ${className}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        <circle cx={12} cy={12} r={8} strokeDasharray="4 4" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill={POLARITY_COLORS[polarity]}
    >
      <path d={POLARITY_PATHS[polarity]} />
    </svg>
  );
}
