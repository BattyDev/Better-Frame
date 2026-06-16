import { Link } from 'react-router-dom';
import type { PublicLoadoutSummary } from '../../types';
import { getFocusSchoolData } from '../../data/focusSchools';
import type { FocusSchool } from '../../types';

const SLOT_GROUPS: { label: string; slots: string[] }[] = [
  { label: 'Combat', slots: ['Warframe', 'Primary', 'Secondary', 'Melee', 'Exalted'] },
  { label: 'Companion', slots: ['Companion', 'Companion Weapon'] },
  { label: 'Archwing', slots: ['Archwing', 'Arch-Gun', 'Arch-Melee'] },
  { label: 'Other', slots: ['Necramech', 'Parazon', 'K-Drive'] },
];

export function LoadoutCard({ loadout }: { loadout: PublicLoadoutSummary }) {
  return (
    <Link
      to={`/loadout/${loadout.id}`}
      className="block bg-wf-bg-card border border-wf-border rounded-lg overflow-hidden hover:border-wf-border-light hover:bg-wf-bg-hover transition-colors group"
    >
      {/* Slot indicator banner */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex flex-wrap gap-1.5">
          {SLOT_GROUPS.map((group) => {
            const filled = group.slots.filter((s) => loadout.filledSlots.includes(s));
            if (filled.length === 0) return null;
            return (
              <span
                key={group.label}
                className="text-xs bg-wf-bg px-1.5 py-0.5 rounded text-wf-text-muted"
                title={`${group.label}: ${filled.join(', ')}`}
              >
                {group.label} {filled.length}/{group.slots.length}
              </span>
            );
          })}
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-wf-text truncate">{loadout.name}</h3>
            {loadout.description && (
              <p className="text-xs text-wf-text-muted truncate">{loadout.description}</p>
            )}
          </div>
          {loadout.focusSchool && (
            <span
              className="text-xs px-1.5 py-0.5 rounded bg-wf-gold/10 text-wf-gold shrink-0"
              title={getFocusSchoolData(loadout.focusSchool as FocusSchool).description}
            >
              {loadout.focusSchool}
            </span>
          )}
        </div>

        <p className="text-xs text-wf-text-muted mb-2">
          by{' '}
          <span
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/user/${loadout.author.username}`;
            }}
            className="text-wf-blue hover:underline cursor-pointer"
          >
            {loadout.author.username}
          </span>
        </p>

        <div className="flex items-center gap-3 text-xs text-wf-text-muted">
          <span title="Slots filled">{loadout.slotCount}/13</span>
          <span title="Votes">▲ {loadout.voteScore}</span>
          <span title="Views">👁 {loadout.viewCount}</span>
          <span className="ml-auto">{new Date(loadout.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
