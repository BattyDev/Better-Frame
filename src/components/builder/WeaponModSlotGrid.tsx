// Weapon mod slot grid: 8 regular slots + exilus (guns) or stance (melee), with drag-and-drop
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { useWeaponBuilderStore, type SlottedModEntry } from '../../stores/weaponBuilderStore';
import { ModCard } from './ModCard';
import { PolarityIcon } from '../ui/PolarityIcon';
import type { Polarity } from '../../types';

function DraggableMod({
  id,
  entry,
  onRemove,
  onRankChange,
}: {
  id: string;
  entry: SlottedModEntry;
  onRemove: () => void;
  onRankChange: (rank: number) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

  return (
    <div ref={setNodeRef} {...attributes}>
      <ModCard
        mod={entry.mod}
        rank={entry.rank}
        onRemove={onRemove}
        onRankChange={onRankChange}
        isDragging={isDragging}
        dragListeners={listeners}
      />
    </div>
  );
}

function DroppableSlot({
  id,
  children,
  polarity,
  label,
  onClick,
}: {
  id: string;
  children: React.ReactNode;
  polarity: Polarity | null;
  label?: string;
  onClick?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`
        relative w-[100px] min-h-[130px] rounded-lg border border-dashed
        transition-colors flex flex-col items-center justify-center
        ${isOver ? 'border-wf-gold bg-wf-gold/10' : 'border-wf-border hover:border-wf-border-light'}
        ${!children ? 'cursor-pointer' : ''}
      `}
    >
      <div className="absolute top-1 right-1">
        <PolarityIcon polarity={polarity} size={14} />
      </div>
      {label && !children && (
        <span className="text-xs text-wf-text-muted">{label}</span>
      )}
      {children}
    </div>
  );
}

export function WeaponModSlotGrid() {
  const mods = useWeaponBuilderStore((s) => s.mods);
  const exilus = useWeaponBuilderStore((s) => s.exilus);
  const stance = useWeaponBuilderStore((s) => s.stance);
  const slotPolarities = useWeaponBuilderStore((s) => s.slotPolarities);
  const exilusPolarity = useWeaponBuilderStore((s) => s.exilusPolarity);
  const stancePolarity = useWeaponBuilderStore((s) => s.stancePolarity);
  const weapon = useWeaponBuilderStore((s) => s.weapon);

  const removeMod = useWeaponBuilderStore((s) => s.removeMod);
  const setModRank = useWeaponBuilderStore((s) => s.setModRank);
  const moveMod = useWeaponBuilderStore((s) => s.moveMod);
  const removeExilus = useWeaponBuilderStore((s) => s.removeExilus);
  const removeStance = useWeaponBuilderStore((s) => s.removeStance);
  const openModBrowser = useWeaponBuilderStore((s) => s.openModBrowser);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  if (!weapon) return null;

  const isMelee = weapon.category === 'Melee';

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = parseInt((active.id as string).replace('wmod-', ''));
    const toIndex = parseInt((over.id as string).replace('wslot-', ''));

    if (!isNaN(fromIndex) && !isNaN(toIndex)) {
      moveMod(fromIndex, toIndex);
    }
  }

  const draggedEntry = activeDragId
    ? mods[parseInt(activeDragId.replace('wmod-', ''))]
    : null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {/* Stance (melee) or Exilus (guns) row */}
        <div className="flex gap-3 justify-center">
          {isMelee ? (
            <DroppableSlot
              id="wslot-stance"
              polarity={stancePolarity}
              label="Stance"
              onClick={() => !stance && openModBrowser('stance')}
            >
              {stance && (
                <ModCard
                  mod={stance.mod}
                  rank={stance.rank}
                  onRemove={removeStance}
                />
              )}
            </DroppableSlot>
          ) : (
            <DroppableSlot
              id="wslot-exilus"
              polarity={exilusPolarity}
              label="Exilus"
              onClick={() => !exilus && openModBrowser('exilus')}
            >
              {exilus && (
                <ModCard
                  mod={exilus.mod}
                  rank={exilus.rank}
                  onRemove={removeExilus}
                />
              )}
            </DroppableSlot>
          )}
        </div>

        {/* 8 regular mod slots in 2 rows of 4 */}
        <div className="grid grid-cols-4 gap-3 justify-items-center">
          {mods.map((entry, index) => (
            <DroppableSlot
              key={index}
              id={`wslot-${index}`}
              polarity={slotPolarities[index]}
              label={`Slot ${index + 1}`}
              onClick={() => !entry && openModBrowser('regular', index)}
            >
              {entry && (
                <DraggableMod
                  id={`wmod-${index}`}
                  entry={entry}
                  onRemove={() => removeMod(index)}
                  onRankChange={(rank) => setModRank(index, rank)}
                />
              )}
            </DroppableSlot>
          ))}
        </div>
      </div>

      <DragOverlay>
        {draggedEntry && (
          <ModCard
            mod={draggedEntry.mod}
            rank={draggedEntry.rank}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
