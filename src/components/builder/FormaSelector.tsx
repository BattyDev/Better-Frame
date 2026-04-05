// Forma selector: lets user change slot polarities
import { useState } from 'react';
import { useBuilderStore } from '../../stores/builderStore';
import { PolarityIcon } from '../ui/PolarityIcon';
import type { Polarity } from '../../types';

const ALL_POLARITIES: Polarity[] = [
  'madurai', 'vazarin', 'naramon', 'zenurik', 'unairu', 'penjaga', 'umbra',
];

interface FormaSelectorProps {
  slotType: 'regular' | 'aura' | 'exilus';
  slotIndex?: number;
  currentPolarity: Polarity | null;
}

export function FormaSelector({ slotType, slotIndex, currentPolarity }: FormaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const setSlotPolarity = useBuilderStore((s) => s.setSlotPolarity);
  const setAuraPolarity = useBuilderStore((s) => s.setAuraPolarity);
  const setExilusPolarity = useBuilderStore((s) => s.setExilusPolarity);
  function handleSelect(polarity: Polarity | null) {
    if (slotType === 'aura') {
      setAuraPolarity(polarity);
    } else if (slotType === 'exilus') {
      setExilusPolarity(polarity);
    } else if (slotIndex !== undefined) {
      setSlotPolarity(slotIndex, polarity);
    }
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded hover:bg-wf-bg-hover transition-colors"
        title="Apply Forma"
      >
        <PolarityIcon polarity={currentPolarity} size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-1 p-2 rounded-lg bg-wf-bg-card
                        border border-wf-border shadow-lg">
          <div className="grid grid-cols-4 gap-1">
            {/* Clear polarity option */}
            <button
              onClick={() => handleSelect(null)}
              className="p-1.5 rounded hover:bg-wf-bg-hover transition-colors"
              title="Remove polarity"
            >
              <PolarityIcon polarity={null} size={18} />
            </button>
            {ALL_POLARITIES.map((pol) => (
              <button
                key={pol}
                onClick={() => handleSelect(pol)}
                className={`
                  p-1.5 rounded transition-colors capitalize
                  ${pol === currentPolarity ? 'bg-wf-gold/20' : 'hover:bg-wf-bg-hover'}
                `}
                title={pol}
              >
                <PolarityIcon polarity={pol} size={18} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FormaCounter() {
  const formaCount = useBuilderStore((s) => s.formaCount);

  if (formaCount === 0) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-wf-gold">
      <span className="font-medium">{formaCount}</span>
      <span className="text-wf-text-dim">Forma</span>
    </div>
  );
}
