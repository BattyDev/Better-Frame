// Mod slot grid: 8 regular slots + aura + exilus, with drag-and-drop support
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
import { useBuilderStore, type SlottedModEntry } from '../../stores/builderStore';
import { ModCard } from './ModCard';
import { PolarityIcon } from '../ui/PolarityIcon';
import type { Polarity } from '../../types';

// Draggable mod wrapper
function DraggableMod({
  id,
  entry,
  slotIndex,
  onRemove,
  onRankChange,
}: {
  id: string;
  entry: SlottedModEntry;
  slotIndex: number;
  onRemove: () => void;
  onRankChange: (rank: number) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <ModCard
        mod={entry.mod}
        rank={entry.rank}
        onRemove={onRemove}
        onRankChange={onRankChange}
        isDragging={isDragging}
      />
    </div>
  );
}

// Droppable slot wrapper
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
      {/* Polarity indicator */}
      <div className="absolute top-1 right-1">
        <PolarityIcon polarity={polarity} size={14} />
      </div>

      {/* Label */}
      {label && !children && (
        <span className="text-xs text-wf-text-muted">{label}</span>
      )}

      {children}
    </div>
  );
}

export function ModSlotGrid() {
  const mods = useBuilderStore((s) => s.mods);
  const aura = useBuilderStore((s) => s.aura);
  const exilus = useBuilderStore((s) => s.exilus);
  const slotPolarities = useBuilderStore((s) => s.slotPolarities);
  const auraPolarity = useBuilderStore((s) => s.auraPolarity);
  const exilusPolarity = useBuilderStore((s) => s.exilusPolarity);
  const warframe = useBuilderStore((s) => s.warframe);

  const setMod = useBuilderStore((s) => s.setMod);
  const removeMod = useBuilderStore((s) => s.removeMod);
  const setModRank = useBuilderStore((s) => s.setModRank);
  const moveMod = useBuilderStore((s) => s.moveMod);
  const removeAura = useBuilderStore((s) => s.removeAura);
  const removeExilus = useBuilderStore((s) => s.removeExilus);
  const openModBrowser = useBuilderStore((s) => s.openModBrowser);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  if (!warframe) return null;

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = parseInt((active.id as string).replace('mod-', ''));
    const toIndex = parseInt((over.id as string).replace('slot-', ''));

    if (!isNaN(fromIndex) && !isNaN(toIndex)) {
      moveMod(fromIndex, toIndex);
    }
  }

  // Get the currently dragged mod for overlay
  const draggedEntry = activeDragId
    ? mods[parseInt(activeDragId.replace('mod-', ''))]
    : null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {/* Aura + Exilus row */}
        <div className="flex gap-3 justify-center">
          <DroppableSlot
            id="slot-aura"
            polarity={auraPolarity}
            label="Aura"
            onClick={() => !aura && openModBrowser('aura')}
          >
            {aura && (
              <ModCard
                mod={aura.mod}
                rank={aura.rank}
                onRemove={removeAura}
              />
            )}
          </DroppableSlot>

          <DroppableSlot
            id="slot-exilus"
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
        </div>

        {/* 8 regular mod slots in 2 rows of 4 */}
        <div className="grid grid-cols-4 gap-3 justify-items-center">
          {mods.map((entry, index) => (
            <DroppableSlot
              key={index}
              id={`slot-${index}`}
              polarity={slotPolarities[index]}
              label={`Slot ${index + 1}`}
              onClick={() => !entry && openModBrowser('regular', index)}
            >
              {entry && (
                <DraggableMod
                  id={`mod-${index}`}
                  entry={entry}
                  slotIndex={index}
                  onRemove={() => removeMod(index)}
                  onRankChange={(rank) => setModRank(index, rank)}
                />
              )}
            </DroppableSlot>
          ))}
        </div>
      </div>

      {/* Drag overlay */}
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
