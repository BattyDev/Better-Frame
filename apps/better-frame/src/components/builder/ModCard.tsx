// Mod card component: shows mod name, rank dots, drain, polarity, rarity border
import type { ModData } from '../../types/gameData';
import { PolarityIcon } from '../ui/PolarityIcon';
import { getModDrain } from '../../lib/math/modParser';
import { getItemImageUrl } from '../../data/warframeData';
import type { Polarity } from '../../types';

interface ModCardProps {
  mod: ModData;
  rank: number;
  onRankChange?: (rank: number) => void;
  onRemove?: () => void;
  compact?: boolean;
  onClick?: () => void;
  isDragging?: boolean;
  dragListeners?: Record<string, unknown>;
}

const RARITY_BORDER_COLORS: Record<string, string> = {
  Common: 'border-wf-rarity-common',
  Uncommon: 'border-wf-rarity-uncommon',
  Rare: 'border-wf-rarity-rare',
  Legendary: 'border-wf-rarity-legendary',
  Riven: 'border-wf-rarity-riven',
  Peculiar: 'border-wf-rarity-uncommon',
};

const RARITY_GLOW_COLORS: Record<string, string> = {
  Common: 'shadow-wf-rarity-common/20',
  Uncommon: 'shadow-wf-rarity-uncommon/20',
  Rare: 'shadow-wf-rarity-rare/20',
  Legendary: 'shadow-wf-rarity-legendary/20',
  Riven: 'shadow-wf-rarity-riven/20',
};

export function ModCard({
  mod,
  rank,
  onRankChange,
  onRemove,
  compact = false,
  onClick,
  isDragging = false,
  dragListeners,
}: ModCardProps) {
  const drain = getModDrain(mod, rank);
  const maxRank = mod.fusionLimit;
  const borderColor = RARITY_BORDER_COLORS[mod.rarity] ?? 'border-wf-border';
  const glowColor = RARITY_GLOW_COLORS[mod.rarity] ?? '';

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`
          flex items-center gap-2 p-2 rounded border ${borderColor}
          bg-wf-bg-card hover:bg-wf-bg-hover transition-colors text-left w-full
          cursor-pointer
        `}
      >
        <img
          src={getItemImageUrl(mod.imageName)}
          alt={mod.name}
          className="w-8 h-8 object-contain"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-wf-text truncate">{mod.name}</div>
          <div className="flex items-center gap-1 text-xs text-wf-text-muted">
            <PolarityIcon polarity={mod.polarity as Polarity} size={10} />
            <span>{drain}</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`
        relative rounded-lg border-2 ${borderColor} bg-wf-bg-card
        shadow-lg ${glowColor} transition-all
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${onClick ? 'cursor-pointer hover:bg-wf-bg-hover' : ''}
      `}
      onClick={onClick}
    >
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-wf-danger
                     text-white text-xs flex items-center justify-center z-10
                     hover:bg-wf-danger/80 transition-colors"
        >
          x
        </button>
      )}

      {/* Mod image — drag handle */}
      <div className="p-2 flex justify-center cursor-grab" {...dragListeners}>
        <img
          src={getItemImageUrl(mod.imageName)}
          alt={mod.name}
          className="w-14 h-14 object-contain"
          loading="lazy"
        />
      </div>

      {/* Mod info */}
      <div className="px-2 pb-1.5 space-y-1">
        <div className="text-xs text-wf-text font-medium truncate text-center">
          {mod.name}
        </div>

        {/* Drain and polarity */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <PolarityIcon polarity={mod.polarity as Polarity} size={12} />
          </div>
          <span className="text-wf-text-muted">{drain}</span>
        </div>

        {/* Rank dots */}
        <div className="flex items-center justify-center gap-0.5 flex-wrap">
          {Array.from({ length: maxRank }, (_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                onRankChange?.(i + 1 === rank ? i : i + 1);
              }}
              className={`
                w-2 h-2 rounded-full transition-colors
                ${i < rank
                  ? 'bg-wf-gold'
                  : 'bg-wf-bg-dark border border-wf-border'
                }
                ${onRankChange ? 'cursor-pointer hover:bg-wf-gold-light' : ''}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
