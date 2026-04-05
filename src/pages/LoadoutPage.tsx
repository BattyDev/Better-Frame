import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLoadoutById, fetchBuildSummariesByIds } from '../lib/social';
import { VoteButtons } from '../components/social/VoteButtons';
import { CommentsSection } from '../components/social/CommentsSection';
import { ReportButton } from '../components/social/ReportButton';
import { getFocusSchoolData } from '../data/focusSchools';
import type { Loadout, FocusSchool } from '../types';

const SLOT_LABELS: { key: keyof Loadout; label: string; group: string }[] = [
  { key: 'warframeBuildId', label: 'Warframe', group: 'Combat' },
  { key: 'primaryBuildId', label: 'Primary', group: 'Combat' },
  { key: 'secondaryBuildId', label: 'Secondary', group: 'Combat' },
  { key: 'meleeBuildId', label: 'Melee', group: 'Combat' },
  { key: 'exaltedBuildId', label: 'Exalted', group: 'Combat' },
  { key: 'companionBuildId', label: 'Companion', group: 'Companion' },
  { key: 'companionWeaponBuildId', label: 'Companion Weapon', group: 'Companion' },
  { key: 'archwingBuildId', label: 'Archwing', group: 'Archwing' },
  { key: 'archgunBuildId', label: 'Arch-Gun', group: 'Archwing' },
  { key: 'archmeleeBuildId', label: 'Arch-Melee', group: 'Archwing' },
  { key: 'necramechBuildId', label: 'Necramech', group: 'Other' },
  { key: 'parazonBuildId', label: 'Parazon', group: 'Other' },
  { key: 'kdriveBuildId', label: 'K-Drive', group: 'Other' },
];

export default function LoadoutPage() {
  const { id } = useParams<{ id: string }>();

  const { data: loadout, isLoading, isError } = useQuery({
    queryKey: ['loadout', id],
    queryFn: () => fetchLoadoutById(id!),
    enabled: !!id,
  });

  // Collect all build IDs from the loadout to fetch summaries
  const buildIds = useMemo(() => {
    if (!loadout) return [];
    return SLOT_LABELS
      .map(s => loadout[s.key] as string | null)
      .filter((v): v is string => !!v);
  }, [loadout]);

  const { data: buildMap = {} } = useQuery({
    queryKey: ['loadoutBuilds', buildIds],
    queryFn: () => fetchBuildSummariesByIds(buildIds),
    enabled: buildIds.length > 0,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-wf-gold">Loading loadout...</div>
      </div>
    );
  }

  if (isError || !loadout) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-wf-text mb-2">Loadout not found or not public.</p>
          <Link to="/browse" className="text-wf-gold hover:underline text-sm">
            ← Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const groups = ['Combat', 'Companion', 'Archwing', 'Other'] as const;

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-3xl mx-auto w-full">
      <Link to="/browse" className="text-sm text-wf-text-muted hover:text-wf-text mb-4 inline-block">
        ← Browse
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-wf-gold">{loadout.name}</h1>
        <div className="flex items-center gap-3 mt-1">
          <Link
            to={`/user/${loadout.author.username}`}
            className="text-sm text-wf-blue hover:underline"
          >
            {loadout.author.displayName ?? loadout.author.username}
          </Link>
          {loadout.gameVersion && (
            <span className="text-xs text-wf-text-muted">Patch {loadout.gameVersion}</span>
          )}
        </div>
        {loadout.description && (
          <p className="text-sm text-wf-text-dim mt-2">{loadout.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-6 p-3 bg-wf-bg-card border border-wf-border rounded-lg">
        <VoteButtons targetId={loadout.id} targetType="loadout" initialScore={loadout.voteScore} />
        <div className="ml-auto">
          <ReportButton targetType="loadout" targetId={loadout.id} />
        </div>
      </div>

      {/* Build slots */}
      {groups.map((group) => {
        const slots = SLOT_LABELS.filter(s => s.group === group);
        const hasAny = slots.some(s => loadout[s.key]);
        if (!hasAny) return null;

        return (
          <div key={group} className="mb-5">
            <h2 className="text-xs font-semibold text-wf-text-dim uppercase tracking-wider mb-2">
              {group}
            </h2>
            <div className="space-y-2">
              {slots.map(({ key, label }) => {
                const buildId = loadout[key] as string | null;
                if (!buildId) return null;
                const build = buildMap[buildId];
                return (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-wf-bg-card border border-wf-border">
                    <span className="text-xs text-wf-text-dim w-24 shrink-0">{label}</span>
                    {build ? (
                      <Link
                        to={`/build/${build.id}`}
                        className="text-sm text-wf-gold hover:underline"
                      >
                        {build.name}
                      </Link>
                    ) : (
                      <span className="text-xs text-wf-text-muted">Build #{buildId.slice(0, 8)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Focus School */}
      {loadout.focusSchool && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-wf-text-dim uppercase tracking-wider mb-2">
            Focus School
          </h2>
          <div className="p-3 rounded-lg bg-wf-bg-card border border-wf-border">
            <span className="text-sm font-medium text-wf-gold">{loadout.focusSchool}</span>
            <p className="text-xs text-wf-text-muted mt-1">
              {getFocusSchoolData(loadout.focusSchool as FocusSchool).description}
            </p>
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="border-t border-wf-border pt-6">
        <CommentsSection targetId={loadout.id} targetType="loadout" />
      </div>
    </div>
  );
}
