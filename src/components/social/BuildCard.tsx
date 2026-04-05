import { Link } from 'react-router-dom';
import type { PublicBuildSummary } from '../../types';
import { getItemImageUrl } from '../../data/warframeData';
import { getWeaponByUniqueName } from '../../data/weaponData';
import { getWarframeByUniqueName } from '../../data/warframeData';

function getItemImage(summary: PublicBuildSummary): string | null {
  if (summary.itemCategory === 'Warframe') {
    const wf = getWarframeByUniqueName(summary.itemUniqueName);
    return wf?.imageName ? getItemImageUrl(wf.imageName) : null;
  }
  const weapon = getWeaponByUniqueName(summary.itemUniqueName);
  return weapon?.imageName ? getItemImageUrl(weapon.imageName) : null;
}

function getItemName(summary: PublicBuildSummary): string {
  if (summary.itemCategory === 'Warframe') {
    return getWarframeByUniqueName(summary.itemUniqueName)?.name ?? summary.itemUniqueName;
  }
  return getWeaponByUniqueName(summary.itemUniqueName)?.name ?? summary.itemUniqueName;
}

const CURRENT_VERSION = '38.5'; // Updated periodically; Phase 6 will fetch dynamically

function FreshnessBadge({ gameVersion }: { gameVersion: string | null }) {
  if (!gameVersion) return null;
  const isRecent = gameVersion === CURRENT_VERSION;
  return (
    <span
      className={`text-xs px-1.5 py-0.5 rounded ${
        isRecent
          ? 'bg-wf-success/10 text-wf-success'
          : 'bg-wf-warning/10 text-wf-warning'
      }`}
      title={isRecent ? 'Updated for current patch' : `Saved on patch ${gameVersion} — may be outdated`}
    >
      {isRecent ? `v${gameVersion} ✓` : `v${gameVersion} ?`}
    </span>
  );
}

interface BuildCardProps {
  build: PublicBuildSummary;
  /** Show visibility toggle (for the profile/my-builds view) */
  showOwnerControls?: boolean;
  onTogglePublic?: (id: string, current: boolean) => void;
}

export function BuildCard({ build, showOwnerControls, onTogglePublic }: BuildCardProps) {
  const imageUrl = getItemImage(build);
  const itemName = getItemName(build);

  return (
    <Link
      to={`/build/${build.id}`}
      className="block bg-wf-bg-card border border-wf-border rounded-lg overflow-hidden hover:border-wf-border-light hover:bg-wf-bg-hover transition-colors group"
    >
      {/* Item image banner */}
      <div className="h-24 bg-wf-bg flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={itemName}
            className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-wf-text-muted text-xs">{build.itemCategory}</span>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="text-xs text-wf-text-muted truncate">{itemName}</p>
            <h3 className="text-sm font-medium text-wf-text truncate">{build.name}</h3>
          </div>
          <FreshnessBadge gameVersion={build.gameVersion} />
        </div>

        <p className="text-xs text-wf-text-muted mb-2">
          by{' '}
          <span
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/user/${build.author.username}`;
            }}
            className="text-wf-blue hover:underline cursor-pointer"
          >
            {build.author.username}
          </span>
        </p>

        {build.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {build.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-wf-bg px-1.5 py-0.5 rounded text-wf-text-muted">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-wf-text-muted">
          <span title="Votes">▲ {build.voteScore}</span>
          <span title="Views">👁 {build.viewCount}</span>
          <span className="ml-auto">{new Date(build.updatedAt).toLocaleDateString()}</span>
        </div>

        {showOwnerControls && onTogglePublic && (
          <div className="mt-2 pt-2 border-t border-wf-border flex items-center justify-between">
            <span
              className={`text-xs ${build.isPublic ? 'text-wf-success' : 'text-wf-text-muted'}`}
            >
              {build.isPublic ? 'Public' : 'Private'}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                onTogglePublic(build.id, build.isPublic);
              }}
              className="text-xs px-2 py-0.5 border border-wf-border rounded hover:border-wf-border-light text-wf-text-dim transition-colors"
            >
              {build.isPublic ? 'Make Private' : 'Make Public'}
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
