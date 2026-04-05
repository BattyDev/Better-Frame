import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBuildById, incrementViewCount, cloneBuild } from '../lib/social';
import { VoteButtons } from '../components/social/VoteButtons';
import { CommentsSection } from '../components/social/CommentsSection';
import { ReportButton } from '../components/social/ReportButton';
import { useAuthStore } from '../stores/authStore';
import { useBuilderStore } from '../stores/builderStore';
import { useWeaponBuilderStore } from '../stores/weaponBuilderStore';
import { getWarframeByUniqueName, getItemImageUrl, getModByUniqueName } from '../data/warframeData';
import { getWeaponByUniqueName } from '../data/weaponData';
import type { PublicBuild } from '../types';

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
        <span>✓</span>
        <span>Updated for patch {gameVersion}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-wf-warning/10 border border-wf-warning/30 rounded-lg text-sm text-wf-warning">
      <span>⚠</span>
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

interface ReadOnlyModGridProps {
  build: PublicBuild;
}

function ReadOnlyModGrid({ build }: ReadOnlyModGridProps) {
  const isWarframe = build.itemCategory === 'Warframe';
  const { config } = build;

  return (
    <div className="space-y-3">
      {/* Aura / Stance + Exilus row */}
      <div className="grid grid-cols-2 gap-2">
        <ReadOnlyModSlot mod={config.aura} label={isWarframe ? 'Aura' : 'Stance'} />
        <ReadOnlyModSlot mod={config.exilus} label="Exilus" />
      </div>

      {/* 8 regular mod slots */}
      <div className="grid grid-cols-4 gap-2">
        {config.mods.map((mod, i) => (
          <ReadOnlyModSlot key={i} mod={mod} />
        ))}
      </div>

      {/* Arcanes (warframe only) */}
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

  async function handleClone() {
    if (!user || !build) return;
    const newId = await cloneBuild(build.id, user.id);
    if (newId) navigate('/profile');
  }

  const { name: itemName, imageUrl } = useItemData(build);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-wf-gold">Loading build…</div>
      </div>
    );
  }

  if (isError || !build) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-wf-text mb-2">Build not found or not public.</p>
          <Link to="/browse" className="text-wf-gold hover:underline text-sm">
            ← Back to Browse
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
      <Link to="/browse" className="text-sm text-wf-text-muted hover:text-wf-text mb-4 inline-block">
        ← Browse
      </Link>

      {/* Header */}
      <div className="flex gap-4 mb-6">
        {imageUrl && (
          <div className="w-24 h-24 flex-shrink-0 bg-wf-bg rounded-lg flex items-center justify-center overflow-hidden">
            <img src={imageUrl} alt={itemName} className="h-full w-full object-contain p-1" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-wf-text-muted">{itemName} · {build.itemCategory}</p>
          <h1 className="text-2xl font-bold text-wf-gold truncate">{build.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <Link
              to={`/user/${build.author.username}`}
              className="text-sm text-wf-blue hover:underline"
            >
              {build.author.displayName ?? build.author.username}
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

      {/* Actions bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-wf-bg-card border border-wf-border rounded-lg">
        <VoteButtons
          targetId={build.id}
          targetType="build"
          initialScore={build.voteScore}
        />
        <span className="text-xs text-wf-text-muted">👁 {build.viewCount} views</span>
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

      {/* Build layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-sm font-semibold text-wf-text-muted uppercase tracking-wide mb-3">
            Mods
          </h2>
          <ReadOnlyModGrid build={build} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-wf-text-muted uppercase tracking-wide mb-3">
            Build Details
          </h2>
          <div className="bg-wf-bg-card border border-wf-border rounded-lg p-4 space-y-2">
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

      {/* Comments */}
      <div className="border-t border-wf-border pt-6">
        <CommentsSection targetId={build.id} targetType="build" />
      </div>
    </div>
  );
}
