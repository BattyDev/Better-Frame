import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProfileByUsername, fetchUserPublicBuilds } from '../lib/social';
import { BuildCard } from '../components/social/BuildCard';

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchProfileByUsername(username!),
    enabled: !!username,
  });

  const { data: builds = [], isLoading: buildsLoading } = useQuery({
    queryKey: ['userBuilds', profile?.id],
    queryFn: () => fetchUserPublicBuilds(profile!.id),
    enabled: !!profile?.id,
  });

  if (profileLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-wf-gold">Loading profile…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-wf-text mb-2">User not found.</p>
          <Link to="/browse" className="text-wf-gold hover:underline text-sm">← Browse</Link>
        </div>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
      {/* Profile header */}
      <div className="bg-wf-bg-card border border-wf-border rounded-lg p-6 mb-6 flex items-center gap-4">
        {/* Avatar placeholder */}
        <div className="w-16 h-16 rounded-full bg-wf-bg-hover border border-wf-border flex items-center justify-center flex-shrink-0">
          <span className="text-wf-gold text-2xl font-bold">
            {profile.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-wf-gold">
            {profile.username}
          </h1>
          <p className="text-xs text-wf-text-muted mt-1">Member since {memberSince}</p>
        </div>
      </div>

      {/* Public builds */}
      <div>
        <h2 className="text-lg font-semibold text-wf-text mb-4">
          Public Builds{' '}
          {builds.length > 0 && (
            <span className="text-wf-text-muted text-sm">({builds.length})</span>
          )}
        </h2>

        {buildsLoading ? (
          <div className="text-wf-text-muted text-sm">Loading builds…</div>
        ) : builds.length === 0 ? (
          <div className="rounded-lg border border-dashed border-wf-border p-8 text-center text-wf-text-muted">
            No public builds yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {builds.map((build) => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
