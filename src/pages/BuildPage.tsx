import { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBuildById, incrementViewCount, cloneBuild, findLoadoutsContainingBuild } from '../lib/social';
import { VoteButtons } from '../components/social/VoteButtons';
import { CommentsSection } from '../components/social/CommentsSection';
import { ReportButton } from '../components/social/ReportButton';
import { useAuthStore } from '../stores/authStore';
import { useBuilderStore } from '../stores/builderStore';
import { useWeaponBuilderStore } from '../stores/weaponBuilderStore';
import { getWarframeByUniqueName, getItemImageUrl, getModByUniqueName, getArcaneByUniqueName } from '../data/warframeData';
import { getWeaponByUniqueName } from '../data/weaponData';
import { calculateWarframeStats, formatStatValue, getStatDisplayName, type CalculatedStats } from '../lib/math/warframeCalc';
import { calculateWeaponStats, formatWeaponStatValue, type WeaponCalculatedStats } from '../lib/math/weaponCalc';
import { ELEMENT_COLORS, ELEMENT_DISPLAY_NAMES } from '../lib/math/elementCombiner';
import type { PublicBuild } from '../types';
import type { ModData, ArcaneData } from '../types/gameData';

// ─── Helpers ───────────────────────────────────────────────────────────────

function useItemData(build: PublicBuild | null | undefined) {
  if (!build) return { name: '', imageUrl: null };
  if (build.itemCategory === 'Warframe') {
    const wf = getWarframeByUniqueName(build.itemUniqueName);
    return {
      name: wf?.name ?? build.itemUniqueName,
      imageUrl: wf?.imageName ? getItemImageUrl(wf.imageName) : null,
    };
  }
  const weapon = getWeaponByUniqueName(build.itemUniqueName);
  return {
    name: weapon?.name ?? build.itemUniqueName,
    imageUrl: weapon?.imageName ? getItemImageUrl(weapon.imageName) : null,
  };
}

const CURRENT_VERSION = '38.5';

function FreshnessBanner({ gameVersion }: { gameVersion: string | null }) {
  if (!gameVersion) return null;
  if (gameVersion === CURRENT_VERSION) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-wf-success/10 border border-wf-success/30 rounded-lg text-sm text-wf-success">
        <span>&#10003;</span>
        <span>Updated for patch {gameVersion}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-wf-warning/10 border border-wf-warning/30 rounded-lg text-sm text-wf-warning">
      <span>&#9888;</span>
      <span>Saved on patch {gameVersion} — may be outdated</span>
    </div>
  );
}

// ─── Read-only mod slot display ─────────────────────────────────────────────

interface ReadOnlyModSlotProps {
  mod: { uniqueName: string; rank: number } | null;
  label?: string;
}

function ReadOnlyModSlot({ mod, label }: ReadOnlyModSlotProps) {
  const modData = mod ? getModByUniqueName(mod.uniqueName) : null;

  const rarityColors: Record<string, string> = {
    Common: 'border-rarity-common',
    Uncommon: 'border-rarity-uncommon',
    Rare: 'border-rarity-rare',
    Legendary: 'border-rarity-legendary',
    Riven: 'border-rarity-riven',
  };
  const rarityColor = modData ? (rarityColors[modData.rarity] ?? 'border-wf-border') : 'border-wf-border';

  return (
    <div
      className={`rounded border ${modData ? rarityColor : 'border-dashed border-wf-border'} bg-wf-bg p-2 min-h-[60px] flex flex-col justify-between`}
      title={modData ? `${modData.name} (rank ${mod?.rank})` : label ?? 'Empty'}
    >
      {modData ? (
        <>
          <p className="text-xs text-wf-text font-medium leading-tight truncate">{modData.name}</p>
          {modData.levelStats && mod && mod.rank > 0 && (
            <p className="text-xs text-wf-text-muted leading-tight mt-0.5 truncate">
              {modData.levelStats[mod.rank - 1]?.stats[0]?.replace(/<[^>]+>/g, '') ?? ''}
            </p>
          )}
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: (modData.fusionLimit ?? 5) + 1 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i <= (mod?.rank ?? 0) ? 'bg-wf-gold' : 'bg-wf-bg-card'}`}
              />
            ))}
          </div>
        </>
      ) : (
        <span className="text-xs text-wf-text-muted self-center m-auto">{label ?? '—'}</span>
      )}
    </div>
  );
}

function ReadOnlyModGrid({ build }: { build: PublicBuild }) {
  const isWarframe = build.itemCategory === 'Warframe';
  const { config } = build;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <ReadOnlyModSlot mod={config.aura} label={isWarframe ? 'Aura' : 'Stance'} />
        <ReadOnlyModSlot mod={config.exilus} label="Exilus" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {config.mods.map((mod, i) => (
          <ReadOnlyModSlot key={i} mod={mod} />
        ))}
      </div>
      {isWarframe && (config.arcanes[0] || config.arcanes[1]) && (
        <div className="grid grid-cols-2 gap-2">
          {config.arcanes.map((arc, i) => (
            <ReadOnlyModSlot key={i} mod={arc} label="Arcane" />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Computed Stats ────────────────────────────────────────────────────────

function deserializeMods(config: PublicBuild['config']): { mod: ModData; rank: number }[] {
  const mods: { mod: ModData; rank: number }[] = [];
  if (config.aura) {
    const m = getModByUniqueName(config.aura.uniqueName);
    if (m) mods.push({ mod: m, rank: config.aura.rank });
  }
  if (config.exilus) {
    const m = getModByUniqueName(config.exilus.uniqueName);
    if (m) mods.push({ mod: m, rank: config.exilus.rank });
  }
  for (const entry of config.mods) {
    if (entry) {
      const m = getModByUniqueName(entry.uniqueName);
      if (m) mods.push({ mod: m, rank: entry.rank });
    }
  }
  // Include stance if present
  if (config.stance) {
    const m = getModByUniqueName(config.stance.uniqueName);
    if (m) mods.push({ mod: m, rank: config.stance.rank });
  }
  return mods;
}

function deserializeArcanes(config: PublicBuild['config']): { arcane: ArcaneData; rank: number }[] {
  const arcanes: { arcane: ArcaneData; rank: number }[] = [];
  for (const entry of config.arcanes) {
    if (entry) {
      const a = getArcaneByUniqueName(entry.uniqueName);
      if (a) arcanes.push({ arcane: a, rank: entry.rank });
    }
  }
  return arcanes;
}

const WF_STAT_ORDER = [
  'health', 'shield', 'armor', 'energy', 'sprintSpeed',
  'abilityStrength', 'abilityDuration', 'abilityRange', 'abilityEfficiency',
];

function WarframeStatsReadOnly({ stats }: { stats: CalculatedStats }) {
  return (
    <div className="space-y-1.5">
      {WF_STAT_ORDER.map((statKey) => {
        const baseVal = stats.base[statKey];
        const moddedVal = stats.modded[statKey];
        if (baseVal === undefined && moddedVal === undefined) return null;

        const isModified = baseVal !== moddedVal;
        const isIncrease = (moddedVal ?? 0) > (baseVal ?? 0);

        return (
          <div key={statKey} className="flex items-center justify-between text-xs">
            <span className="text-wf-text-dim">{getStatDisplayName(statKey)}</span>
            <div className="flex items-center gap-2">
              {isModified && (
                <span className="text-wf-text-muted line-through">
                  {formatStatValue(statKey, baseVal ?? 0)}
                </span>
              )}
              <span className={isModified ? (isIncrease ? 'text-wf-success font-medium' : 'text-wf-danger font-medium') : 'text-wf-text'}>
                {formatStatValue(statKey, moddedVal ?? baseVal ?? 0)}
              </span>
            </div>
          </div>
        );
      })}

      {Object.entries(stats.modded)
        .filter(([key]) => !WF_STAT_ORDER.includes(key))
        .map(([key, value]) => (
          <div key={key} className="flex items-center justify-between text-xs">
            <span className="text-wf-text-dim">{getStatDisplayName(key)}</span>
            <span className="text-wf-accent">{formatStatValue(key, value)}</span>
          </div>
        ))}

      {stats.textEffects.length > 0 && (
        <div className="mt-3 pt-3 border-t border-wf-border">
          <h4 className="text-xs font-medium text-wf-text-dim mb-1">Effects</h4>
          {stats.textEffects.map((text, i) => (
            <p key={i} className="text-xs text-wf-text-muted">{text}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-wf-text-dim">{label}</span>
      <span className={highlight ? 'text-wf-gold font-medium' : 'text-wf-text'}>{value}</span>
    </div>
  );
}

function WeaponStatsReadOnly({ stats, isMelee }: { stats: WeaponCalculatedStats; isMelee: boolean }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-medium text-wf-gold mb-2">DPS</h4>
        <div className="space-y-1">
          <StatRow label="Avg Damage/Shot" value={formatWeaponStatValue('avgDamagePerShot', stats.avgDamagePerShot)} highlight />
          <StatRow label="Burst DPS" value={formatWeaponStatValue('burstDps', stats.burstDps)} highlight />
          {!isMelee && <StatRow label="Sustained DPS" value={formatWeaponStatValue('sustainedDps', stats.sustainedDps)} highlight />}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-wf-gold mb-2">Damage</h4>
        <div className="space-y-1">
          <StatRow label="Total Base" value={formatWeaponStatValue('totalDamage', stats.totalDamage)} />
          <StatRow label="Per Shot" value={formatWeaponStatValue('damagePerShot', stats.damagePerShot)} />
        </div>

        {Object.entries(stats.physicalDamage).map(([type, value]) => (
          <div key={type} className="flex items-center justify-between text-xs mt-1">
            <span className="text-wf-text-dim flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: ELEMENT_COLORS[type] }} />
              {ELEMENT_DISPLAY_NAMES[type] ?? type}
            </span>
            <span className="text-wf-text">{Math.round(value)}</span>
          </div>
        ))}

        {stats.elementalDamage.map((elem, i) => (
          <div key={`${elem.type}-${i}`} className="flex items-center justify-between text-xs mt-1">
            <span className="text-wf-text-dim flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: ELEMENT_COLORS[elem.type] }} />
              {ELEMENT_DISPLAY_NAMES[elem.type] ?? elem.type}
            </span>
            <span style={{ color: ELEMENT_COLORS[elem.type] }}>{Math.round(elem.damage)}</span>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-xs font-medium text-wf-gold mb-2">Combat</h4>
        <div className="space-y-1">
          <StatRow label="Critical Chance" value={formatWeaponStatValue('critChance', stats.critChance)} />
          <StatRow label="Critical Multiplier" value={formatWeaponStatValue('critMultiplier', stats.critMultiplier)} />
          <StatRow label="Status Chance" value={formatWeaponStatValue('statusChance', stats.statusChance)} />
          <StatRow label="Multishot" value={formatWeaponStatValue('multishot', stats.multishot)} />
          {isMelee ? (
            <>
              <StatRow label="Attack Speed" value={formatWeaponStatValue('attackSpeed', stats.attackSpeed ?? 0)} />
              {stats.range != null && <StatRow label="Range" value={formatWeaponStatValue('range', stats.range)} />}
              {stats.comboDuration != null && <StatRow label="Combo Duration" value={formatWeaponStatValue('comboDuration', stats.comboDuration)} />}
            </>
          ) : (
            <>
              <StatRow label="Fire Rate" value={formatWeaponStatValue('fireRate', stats.fireRate)} />
              <StatRow label="Magazine" value={formatWeaponStatValue('magazineSize', stats.magazineSize)} />
              <StatRow label="Reload" value={formatWeaponStatValue('reloadTime', stats.reloadTime)} />
            </>
          )}
        </div>
      </div>

      {stats.textEffects.length > 0 && (
        <div className="pt-3 border-t border-wf-border">
          <h4 className="text-xs font-medium text-wf-text-dim mb-1">Effects</h4>
          {stats.textEffects.map((text, i) => (
            <p key={i} className="text-xs text-wf-text-muted">{text}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Load in Builder action ─────────────────────────────────────────────────

function useLoadInBuilder(build: PublicBuild | null | undefined) {
  const importWarframeConfig = useBuilderStore((s) => s.importConfig);
  const importWeaponConfig = useWeaponBuilderStore((s) => s.importConfig);
  const navigate = useNavigate();

  return () => {
    if (!build) return;
    if (build.itemCategory === 'Warframe') {
      const wf = getWarframeByUniqueName(build.itemUniqueName);
      if (wf) {
        importWarframeConfig(build.config as Parameters<typeof importWarframeConfig>[0], wf);
        navigate('/builder');
      }
    } else {
      const weapon = getWeaponByUniqueName(build.itemUniqueName);
      if (weapon) {
        const cat = build.itemCategory.toLowerCase() as 'primary' | 'secondary' | 'melee';
        importWeaponConfig(build.config as Parameters<typeof importWeaponConfig>[0], weapon);
        navigate(`/builder/${cat}`);
      }
    }
  };
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function BuildPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: build, isLoading, isError } = useQuery({
    queryKey: ['build', id],
    queryFn: () => fetchBuildById(id!),
    enabled: !!id,
  });

  const loadInBuilder = useLoadInBuilder(build);

  // Increment view count once on mount
  useEffect(() => {
    if (id) incrementViewCount(id);
  }, [id]);

  // Find loadouts containing this build
  const { data: containingLoadouts } = useQuery({
    queryKey: ['buildLoadouts', id],
    queryFn: () => findLoadoutsContainingBuild(id!),
    enabled: !!id,
    staleTime: 60_000,
  });

  // Compute stats from config
  const computedStats = useMemo(() => {
    if (!build) return null;

    if (build.itemCategory === 'Warframe') {
      const wf = getWarframeByUniqueName(build.itemUniqueName);
      if (!wf) return null;
      const mods = deserializeMods(build.config);
      const arcanes = deserializeArcanes(build.config);
      return { type: 'warframe' as const, stats: calculateWarframeStats(wf, mods, arcanes) };
    }

    const weapon = getWeaponByUniqueName(build.itemUniqueName);
    if (!weapon) return null;
    const mods = deserializeMods(build.config);
    return {
      type: 'weapon' as const,
      stats: calculateWeaponStats(
        weapon,
        mods,
        (build.config.bonusElement as Parameters<typeof calculateWeaponStats>[2]) ?? undefined,
        build.config.bonusElementValue ?? undefined,
      ),
      isMelee: weapon.category === 'Melee',
    };
  }, [build]);

  async function handleClone() {
    if (!user || !build) return;
    const newId = await cloneBuild(build.id, user.id);
    if (newId) navigate('/profile');
  }

  const { name: itemName, imageUrl } = useItemData(build);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-wf-gold">Loading build...</div>
      </div>
    );
  }

  if (isError || !build) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-wf-text mb-2">Build not found or not public.</p>
          <Link to="/" className="text-wf-gold hover:underline text-sm">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const categoryRoute =
    build.itemCategory === 'Warframe'
      ? '/builder'
      : `/builder/${build.itemCategory.toLowerCase()}`;

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
      {/* Back link */}
      <Link to="/" className="text-sm text-wf-text-muted hover:text-wf-text mb-4 inline-block">
        &larr; Home
      </Link>

      {/* Header */}
      <div className="flex gap-4 mb-6">
        {imageUrl && (
          <div className="w-24 h-24 flex-shrink-0 bg-wf-bg rounded-lg flex items-center justify-center overflow-hidden">
            <img src={imageUrl} alt={itemName} className="h-full w-full object-contain p-1" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-wf-text-muted">{itemName} &middot; {build.itemCategory}</p>
          <h1 className="text-2xl font-bold text-wf-gold truncate">{build.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <Link
              to={`/user/${build.author.username}`}
              className="text-sm text-wf-blue hover:underline"
            >
              {build.author.username}
            </Link>
            <FreshnessBanner gameVersion={build.gameVersion} />
          </div>
          {build.description && (
            <p className="text-sm text-wf-text-dim mt-2">{build.description}</p>
          )}
          {build.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {build.tags.map((tag) => (
                <span key={tag} className="text-xs bg-wf-bg px-2 py-0.5 rounded text-wf-text-muted border border-wf-border">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loadout links */}
      {containingLoadouts && containingLoadouts.length > 0 && (
        <div className="mb-6 p-3 rounded-lg bg-wf-bg-card border border-wf-border">
          <h3 className="text-xs font-semibold text-wf-text-muted uppercase tracking-wide mb-2">
            Part of Loadout{containingLoadouts.length > 1 ? 's' : ''}
          </h3>
          <div className="flex flex-wrap gap-2">
            {containingLoadouts.map((loadout) => (
              <Link
                key={loadout.id}
                to={`/loadout/${loadout.id}`}
                className="text-sm text-wf-blue hover:underline"
              >
                {loadout.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Actions bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-wf-bg-card border border-wf-border rounded-lg">
        <VoteButtons
          targetId={build.id}
          targetType="build"
          initialScore={build.voteScore}
        />
        <span className="text-xs text-wf-text-muted">&#128065; {build.viewCount} views</span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={loadInBuilder}
            className="px-3 py-1.5 text-sm bg-wf-blue/20 text-wf-blue border border-wf-blue/30 rounded hover:bg-wf-blue/30 transition-colors"
          >
            Load in Builder
          </button>
          {user && user.id !== build.author.id && (
            <button
              onClick={handleClone}
              className="px-3 py-1.5 text-sm bg-wf-gold/20 text-wf-gold border border-wf-gold/30 rounded hover:bg-wf-gold/30 transition-colors"
            >
              Clone to My Builds
            </button>
          )}
          {user && user.id === build.author.id && (
            <Link
              to={categoryRoute}
              className="px-3 py-1.5 text-sm bg-wf-bg-hover border border-wf-border rounded text-wf-text-dim hover:text-wf-text transition-colors"
            >
              Edit
            </Link>
          )}
          <ReportButton targetType="build" targetId={build.id} />
        </div>
      </div>

      {/* Build layout: mods + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-sm font-semibold text-wf-text-muted uppercase tracking-wide mb-3">
            Mods
          </h2>
          <ReadOnlyModGrid build={build} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-wf-text-muted uppercase tracking-wide mb-3">
            Stats
          </h2>
          <div className="bg-wf-bg-card border border-wf-border rounded-lg p-4">
            {computedStats?.type === 'warframe' && (
              <WarframeStatsReadOnly stats={computedStats.stats} />
            )}
            {computedStats?.type === 'weapon' && (
              <WeaponStatsReadOnly stats={computedStats.stats} isMelee={computedStats.isMelee} />
            )}
            {!computedStats && (
              <p className="text-xs text-wf-text-muted">Stats unavailable — item data not found.</p>
            )}

            {/* Build details */}
            <div className="mt-4 pt-4 border-t border-wf-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-wf-text-muted">Forma</span>
                <span className="text-wf-text">{build.config.formaCount ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-wf-text-muted">
                  {build.itemCategory === 'Warframe' ? 'Orokin Reactor' : 'Orokin Catalyst'}
                </span>
                <span className={build.config.hasReactor ? 'text-wf-success' : 'text-wf-text-muted'}>
                  {build.config.hasReactor ? 'Yes' : 'No'}
                </span>
              </div>
              {build.config.helminthAbility && (
                <div className="flex justify-between text-sm">
                  <span className="text-wf-text-muted">Helminth</span>
                  <span className="text-wf-text">{build.config.helminthAbility.ability}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-wf-text-muted">Last updated</span>
                <span className="text-wf-text">
                  {new Date(build.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="border-t border-wf-border pt-6">
        <CommentsSection targetId={build.id} targetType="build" />
      </div>
    </div>
  );
}
