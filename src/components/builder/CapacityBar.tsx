// Capacity bar: shows used/total mod capacity with visual fill
import { useBuilderStore } from '../../stores/builderStore';

export function CapacityBar() {
  const capacity = useBuilderStore((s) => s.capacity);
  const hasReactor = useBuilderStore((s) => s.hasReactor);
  const toggleReactor = useBuilderStore((s) => s.toggleReactor);

  const percentage = capacity.totalCapacity > 0
    ? Math.min((capacity.usedCapacity / capacity.totalCapacity) * 100, 100)
    : 0;

  const barColor = capacity.isOverCapacity
    ? 'bg-wf-danger'
    : percentage > 80
      ? 'bg-wf-warning'
      : 'bg-wf-gold';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-wf-text-dim">Capacity</span>
        <span className={capacity.isOverCapacity ? 'text-wf-danger font-bold' : 'text-wf-text'}>
          {capacity.usedCapacity} / {capacity.totalCapacity}
        </span>
      </div>

      {/* Bar */}
      <div className="h-2 bg-wf-bg-dark rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-200 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Reactor toggle */}
      <button
        onClick={toggleReactor}
        className={`
          text-xs px-3 py-1 rounded border transition-colors
          ${hasReactor
            ? 'border-wf-gold text-wf-gold bg-wf-gold/10'
            : 'border-wf-border text-wf-text-dim hover:border-wf-gold-dim'
          }
        `}
      >
        {hasReactor ? 'Orokin Reactor Installed' : 'Install Orokin Reactor'}
      </button>
    </div>
  );
}
