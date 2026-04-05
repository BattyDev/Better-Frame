// Generic equipment builder page: Archwing, Companion, CompanionWeapon, Necramech, Parazon
import { useEffect, useCallback, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useEquipmentBuilderStore, type EquipmentCategory, type EquipmentItem, EQUIPMENT_SLOT_COUNT, EQUIPMENT_USES_REACTOR } from '../stores/equipmentBuilderStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { getItemImageUrl } from '../data/warframeData';
import {
  getAllArchwings, getArchwingMods,
  getAllCompanions, getCompanionMods,
  getAllSentinelWeapons, getSentinelWeaponMods,
  getAllNecramechs, getNecramechMods,
  getParazonMods,
  getAllKDrives, getKDriveMods,
} from '../data/equipmentData';
import { ModCard } from '../components/builder/ModCard';
import { PolarityIcon } from '../components/ui/PolarityIcon';
import type { ModData } from '../types/gameData';
import type { Polarity } from '../types';

// ─── Route param → category ───────────────────────────────────────────────────

function parseCategory(param: string | undefined): EquipmentCategory | null {
  const map: Record<string, EquipmentCategory> = {
    archwing: 'Archwing',
    companion: 'Companion',
    'companion-weapon': 'CompanionWeapon',
    necramech: 'Necramech',
    parazon: 'Parazon',
    kdrive: 'KDrive',
  };
  return param ? (map[param.toLowerCase()] ?? null) : null;
}

function getCategoryLabel(cat: EquipmentCategory): string {
  const labels: Record<EquipmentCategory, string> = {
    Archwing: 'Archwing',
    Companion: 'Companion',
    CompanionWeapon: 'Companion Weapon',
    Necramech: 'Necramech',
    Parazon: 'Parazon',
    KDrive: 'K-Drive',
  };
  return labels[cat];
}

function getReactorLabel(cat: EquipmentCategory): string {
  return EQUIPMENT_USES_REACTOR[cat] ? 'Reactor' : 'Catalyst';
}

function getDraftKey(cat: EquipmentCategory) {
  return `better-frame-equipment-draft-${cat.toLowerCase()}`;
}

// ─── Item data helpers ─────────────────────────────────────────────────────────

function getItemsForCategory(cat: EquipmentCategory): EquipmentItem[] {
  switch (cat) {
    case 'Archwing':
      return getAllArchwings().map(a => ({
        uniqueName: a.uniqueName,
        name: a.name,
        imageName: a.imageName,
        polarities: a.polarities,
      }));
    case 'Companion':
      return getAllCompanions().map(c => ({
        uniqueName: c.uniqueName,
        name: c.name,
        imageName: c.imageName,
        polarities: c.polarities,
      }));
    case 'CompanionWeapon':
      return getAllSentinelWeapons().map(w => ({
        uniqueName: w.uniqueName,
        name: w.name,
        imageName: w.imageName,
        polarities: w.polarities,
      }));
    case 'Necramech':
      return getAllNecramechs().map(m => ({
        uniqueName: m.uniqueName,
        name: m.name,
        imageName: m.imageName,
        polarities: m.polarities,
      }));
    case 'Parazon':
      // Parazon is a single item — just show a placeholder
      return [{
        uniqueName: '/Lotus/Types/Player/MechWeapons/Parazon',
        name: 'Parazon',
        imageName: 'parazon-f34e5b17ee.png',
        polarities: [],
      }];
    case 'KDrive':
      return getAllKDrives().map(k => ({
        uniqueName: k.uniqueName,
        name: k.name,
        imageName: k.imageName,
        polarities: [],
      }));
  }
}

function getModsForCategory(cat: EquipmentCategory, itemName?: string): ModData[] {
  switch (cat) {
    case 'Archwing': return getArchwingMods(itemName);
    case 'Companion': return getCompanionMods(itemName);
    case 'CompanionWeapon': return getSentinelWeaponMods();
    case 'Necramech': return getNecramechMods(itemName);
    case 'Parazon': return getParazonMods();
    case 'KDrive': return getKDriveMods();
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EquipmentBuilder() {
  const { category: categoryParam } = useParams<{ category: string }>();
  const category = parseCategory(categoryParam);

  const initCategory = useEquipmentBuilderStore((s) => s.initCategory);
  const item = useEquipmentBuilderStore((s) => s.item);
  const hasReactor = useEquipmentBuilderStore((s) => s.hasReactor);
  const formaCount = useEquipmentBuilderStore((s) => s.formaCount);
  const exportConfig = useEquipmentBuilderStore((s) => s.exportConfig);
  const importConfig = useEquipmentBuilderStore((s) => s.importConfig);
  const resetBuild = useEquipmentBuilderStore((s) => s.resetBuild);
  const toggleReactor = useEquipmentBuilderStore((s) => s.toggleReactor);
  const user = useAuthStore((s) => s.user);

  // Init / reset when category changes
  useEffect(() => {
    if (category) initCategory(category);
  }, [category, initCategory]);

  // Auto-save draft
  useEffect(() => {
    if (!item || !category) return;
    const config = exportConfig();
    localStorage.setItem(getDraftKey(category), JSON.stringify({ itemUniqueName: item.uniqueName, config }));
  }, [item, exportConfig, category]);

  // Load draft on mount
  useEffect(() => {
    if (!category) return;
    const saved = localStorage.getItem(getDraftKey(category));
    if (!saved) return;
    try {
      const draft = JSON.parse(saved);
      if (draft.itemUniqueName && draft.config) {
        const items = getItemsForCategory(category);
        const foundItem = items.find(i => i.uniqueName === draft.itemUniqueName);
        if (foundItem) importConfig(draft.config, foundItem);
      }
    } catch {
      // Invalid draft
    }
  }, [category, importConfig]);

  const handleSave = useCallback(async () => {
    if (!user || !item || !category) return;
    const config = exportConfig();

    const { error } = await supabase.from('builds').insert({
      user_id: user.id,
      name: `${item.name} Build`,
      item_unique_name: item.uniqueName,
      item_category: category,
      config,
      is_public: false,
    });

    if (error) {
      console.error('Failed to save build:', error);
    } else {
      if (category) localStorage.removeItem(getDraftKey(category));
    }
  }, [user, item, exportConfig, category]);

  const handleReset = useCallback(() => {
    resetBuild();
    if (category) localStorage.removeItem(getDraftKey(category));
  }, [resetBuild, category]);

  if (!category) {
    return (
      <div className="flex-1 p-4 lg:p-6">
        <p className="text-wf-text-muted">Invalid equipment category.</p>
      </div>
    );
  }

  const label = getCategoryLabel(category);
  const reactorLabel = getReactorLabel(category);
  const showReactor = category !== 'Parazon';

  return (
    <div className="flex-1 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-wf-gold">{label} Builder</h1>
        <div className="flex items-center gap-3">
          {item && (
            <>
              {formaCount > 0 && (
                <span className="text-xs text-wf-text-muted">{formaCount} Forma</span>
              )}

              {showReactor && (
                <button
                  onClick={toggleReactor}
                  className={`
                    px-3 py-1.5 text-xs rounded border transition-colors
                    ${hasReactor
                      ? 'border-wf-accent text-wf-accent bg-wf-accent/10'
                      : 'border-wf-border text-wf-text-dim hover:border-wf-border-light'
                    }
                  `}
                >
                  {hasReactor ? `${reactorLabel} ✓` : reactorLabel}
                </button>
              )}

              {user && (
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 text-sm rounded bg-wf-gold text-wf-bg-dark
                             font-medium hover:bg-wf-gold-light transition-colors"
                >
                  Save
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-1.5 text-sm rounded border border-wf-border
                           text-wf-text-dim hover:border-wf-danger hover:text-wf-danger
                           transition-colors"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Item selector */}
      <EquipmentItemSelector category={category} />

      {/* Builder content */}
      {item && (
        <div className="mt-6 space-y-4">
          {/* Capacity bar */}
          <EquipmentCapacityBar />

          {/* Mod slot grid */}
          <EquipmentModSlotGrid category={category} />

          {/* Effects panel */}
          <EquipmentEffectsPanel />
        </div>
      )}

      {/* Mod browser modal */}
      <EquipmentModBrowser category={category} />
    </div>
  );
}

// ─── Item Selector ─────────────────────────────────────────────────────────────

function EquipmentItemSelector({ category }: { category: EquipmentCategory }) {
  const [search, setSearch] = useState('');
  const item = useEquipmentBuilderStore((s) => s.item);
  const selectItem = useEquipmentBuilderStore((s) => s.selectItem);
  const clearItem = useEquipmentBuilderStore((s) => s.clearItem);

  const allItems = useMemo(() => getItemsForCategory(category), [category]);

  const filtered = useMemo(() => {
    if (!search) return allItems;
    const lower = search.toLowerCase();
    return allItems.filter(i => i.name.toLowerCase().includes(lower));
  }, [allItems, search]);

  if (item) {
    return (
      <div className="flex items-center gap-4 p-3 rounded-lg bg-wf-bg-card border border-wf-border">
        <img
          src={getItemImageUrl(item.imageName)}
          alt={item.name}
          className="w-16 h-16 object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="flex-1">
          <h2 className="text-lg font-medium text-wf-gold">{item.name}</h2>
          <p className="text-xs text-wf-text-muted">{getCategoryLabel(category)}</p>
        </div>
        <button
          onClick={clearItem}
          className="px-3 py-1.5 text-sm rounded border border-wf-border text-wf-text-dim
                     hover:border-wf-danger hover:text-wf-danger transition-colors"
        >
          Change
        </button>
      </div>
    );
  }

  // Parazon is a single implicit item — auto-select it
  if (category === 'Parazon' && allItems.length === 1) {
    selectItem(allItems[0]);
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-wf-gold">Select {getCategoryLabel(category)}</h2>

      {category !== 'Parazon' && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${getCategoryLabel(category).toLowerCase()}...`}
          className="w-full max-w-sm px-3 py-2 rounded bg-wf-bg-dark border border-wf-border
                     text-wf-text text-sm placeholder:text-wf-text-muted
                     focus:outline-none focus:border-wf-gold-dim"
        />
      )}

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {filtered.map((it) => (
          <button
            key={it.uniqueName}
            onClick={() => selectItem(it)}
            className="flex flex-col items-center p-2 rounded-lg border border-transparent
                       hover:border-wf-gold-dim hover:bg-wf-bg-hover transition-colors group"
          >
            <img
              src={getItemImageUrl(it.imageName)}
              alt={it.name}
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="text-xs text-wf-text-dim mt-1 text-center leading-tight">
              {it.name}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-wf-text-muted text-center py-8">
          No items found matching "{search}"
        </p>
      )}
    </div>
  );
}

// ─── Capacity Bar ──────────────────────────────────────────────────────────────

function EquipmentCapacityBar() {
  const capacity = useEquipmentBuilderStore((s) => s.capacity);
  const usedPercent = capacity.totalCapacity > 0
    ? Math.min(100, (capacity.usedCapacity / capacity.totalCapacity) * 100)
    : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-wf-text-dim">Capacity</span>
        <span className={capacity.isOverCapacity ? 'text-wf-danger font-medium' : 'text-wf-text'}>
          {capacity.usedCapacity} / {capacity.totalCapacity}
        </span>
      </div>
      <div className="h-2 rounded-full bg-wf-bg-dark overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            capacity.isOverCapacity ? 'bg-wf-danger' : 'bg-wf-gold'
          }`}
          style={{ width: `${usedPercent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Mod Slot Grid (with drag-and-drop) ───────────────────────────────────────

function DraggableMod({ id, entry, onRemove, onRankChange }: {
  id: string;
  entry: { mod: ModData; rank: number };
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

function DroppableSlot({ id, children, polarity, label, onClick }: {
  id: string;
  children?: React.ReactNode;
  polarity: Polarity | null;
  label: string;
  onClick?: () => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`
        w-28 h-28 rounded-lg border flex flex-col items-center justify-center
        transition-colors relative cursor-pointer
        ${children
          ? 'border-wf-border bg-wf-bg-card cursor-default'
          : 'border-dashed border-wf-border-dim hover:border-wf-gold-dim hover:bg-wf-bg-hover'
        }
        ${isOver ? 'border-wf-gold bg-wf-bg-hover' : ''}
      `}
    >
      {children ?? (
        <>
          {polarity && (
            <PolarityIcon polarity={polarity} className="w-5 h-5 opacity-40 mb-1" />
          )}
          <span className="text-[10px] text-wf-text-muted">{label}</span>
        </>
      )}
    </div>
  );
}

function EquipmentModSlotGrid({ category }: { category: EquipmentCategory }) {
  const mods = useEquipmentBuilderStore((s) => s.mods);
  const slotPolarities = useEquipmentBuilderStore((s) => s.slotPolarities);
  const removeMod = useEquipmentBuilderStore((s) => s.removeMod);
  const setModRank = useEquipmentBuilderStore((s) => s.setModRank);
  const moveMod = useEquipmentBuilderStore((s) => s.moveMod);
  const openModBrowser = useEquipmentBuilderStore((s) => s.openModBrowser);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const slotCount = EQUIPMENT_SLOT_COUNT[category];
  const cols = slotCount <= 4 ? `grid-cols-${slotCount}` : 'grid-cols-4';

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = parseInt((active.id as string).replace('emod-', ''));
    const toIndex = parseInt((over.id as string).replace('eslot-', ''));
    if (!isNaN(fromIndex) && !isNaN(toIndex)) moveMod(fromIndex, toIndex);
  }

  const draggedEntry = activeDragId
    ? mods[parseInt(activeDragId.replace('emod-', ''))]
    : null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`grid ${cols} gap-3 justify-items-center`}>
        {Array.from({ length: slotCount }).map((_, index) => {
          const entry = mods[index];
          return (
            <DroppableSlot
              key={index}
              id={`eslot-${index}`}
              polarity={slotPolarities[index]}
              label={`Slot ${index + 1}`}
              onClick={() => !entry && openModBrowser(index)}
            >
              {entry && (
                <DraggableMod
                  id={`emod-${index}`}
                  entry={entry}
                  onRemove={() => removeMod(index)}
                  onRankChange={(rank) => setModRank(index, rank)}
                />
              )}
            </DroppableSlot>
          );
        })}
      </div>

      <DragOverlay>
        {draggedEntry && <ModCard mod={draggedEntry.mod} rank={draggedEntry.rank} />}
      </DragOverlay>
    </DndContext>
  );
}

// ─── Effects Panel ─────────────────────────────────────────────────────────────

function EquipmentEffectsPanel() {
  const mods = useEquipmentBuilderStore((s) => s.mods);
  const equipped = mods.filter((e): e is NonNullable<typeof e> => e !== null);

  if (equipped.length === 0) return null;

  return (
    <div className="p-4 rounded-lg bg-wf-bg-card border border-wf-border space-y-3">
      <h3 className="text-sm font-medium text-wf-gold">Equipped Effects</h3>
      <div className="space-y-2">
        {equipped.map(({ mod, rank }) => {
          const statLine = mod.levelStats?.[rank]?.stats?.[0]
            ?? mod.levelStats?.[mod.levelStats.length - 1]?.stats?.[0]
            ?? mod.description
            ?? '';
          const cleaned = statLine
            .replace(/<[^>]+>/g, '') // strip XML color tags
            .replace(/\s+/g, ' ')
            .trim();
          return (
            <div key={mod.uniqueName} className="flex gap-2 text-xs">
              <span className="text-wf-gold shrink-0 font-medium">{mod.name}</span>
              <span className="text-wf-text-dim">{cleaned}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mod Browser Modal ─────────────────────────────────────────────────────────

const RARITY_OPTIONS = ['Common', 'Uncommon', 'Rare', 'Legendary'];

function EquipmentModBrowser({ category }: { category: EquipmentCategory }) {
  const activeModBrowserSlot = useEquipmentBuilderStore((s) => s.activeModBrowserSlot);
  const closeModBrowser = useEquipmentBuilderStore((s) => s.closeModBrowser);
  const setMod = useEquipmentBuilderStore((s) => s.setMod);
  const mods = useEquipmentBuilderStore((s) => s.mods);
  const item = useEquipmentBuilderStore((s) => s.item);

  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);

  const availableMods = useMemo(() => {
    return getModsForCategory(category, item?.name);
  }, [category, item?.name]);

  const equippedNames = useMemo(() => {
    const names = new Set<string>();
    for (const e of mods) if (e) names.add(e.mod.uniqueName);
    return names;
  }, [mods]);

  const filteredMods = useMemo(() => {
    return availableMods.filter((mod) => {
      if (equippedNames.has(mod.uniqueName)) return false;
      if (search && !mod.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (rarityFilter && mod.rarity !== rarityFilter) return false;
      return true;
    });
  }, [availableMods, equippedNames, search, rarityFilter]);

  if (activeModBrowserSlot === null) return null;

  function handleSelectMod(mod: ModData) {
    if (activeModBrowserSlot === null) return;
    setMod(activeModBrowserSlot, mod, mod.fusionLimit);
    closeModBrowser();
    setSearch('');
    setRarityFilter(null);
  }

  function handleClose() {
    closeModBrowser();
    setSearch('');
    setRarityFilter(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl max-h-[80vh] bg-wf-bg rounded-lg border border-wf-border
                      shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wf-border">
          <h3 className="text-lg font-medium text-wf-gold">Select Mod</h3>
          <button onClick={handleClose} className="text-wf-text-muted hover:text-wf-text transition-colors">
            Close
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 space-y-3 border-b border-wf-border">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mods..."
            autoFocus
            className="w-full px-3 py-2 rounded bg-wf-bg-dark border border-wf-border
                       text-wf-text text-sm placeholder:text-wf-text-muted
                       focus:outline-none focus:border-wf-gold-dim"
          />
          <div className="flex gap-1">
            {RARITY_OPTIONS.map((rarity) => (
              <button
                key={rarity}
                onClick={() => setRarityFilter(rarityFilter === rarity ? null : rarity)}
                className={`
                  px-2 py-1 rounded text-xs transition-colors
                  ${rarityFilter === rarity
                    ? 'bg-wf-gold/20 text-wf-gold border border-wf-gold'
                    : 'bg-wf-bg-dark text-wf-text-dim border border-wf-border hover:border-wf-border-light'
                  }
                `}
              >
                {rarity}
              </button>
            ))}
          </div>
        </div>

        {/* Mod list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredMods.map((mod) => (
              <ModCard
                key={mod.uniqueName}
                mod={mod}
                rank={mod.fusionLimit}
                compact
                onClick={() => handleSelectMod(mod)}
              />
            ))}
          </div>
          {filteredMods.length === 0 && (
            <p className="text-sm text-wf-text-muted text-center py-8">No mods found</p>
          )}
        </div>
      </div>
    </div>
  );
}
