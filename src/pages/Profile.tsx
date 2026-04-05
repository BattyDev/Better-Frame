import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { fetchMyBuilds, toggleBuildPublic } from '../lib/social';
import { BuildCard } from '../components/social/BuildCard';

export default function Profile() {
  const { user, profile, signOut, resendConfirmation, updateProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'builds' | 'account'>('builds');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState(profile?.username ?? '');
  const [editDisplayName, setEditDisplayName] = useState(profile?.displayName ?? '');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: builds = [], isLoading } = useQuery({
    queryKey: ['myBuilds', user?.id],
    queryFn: () => fetchMyBuilds(user!.id),
    enabled: !!user,
  });

  const togglePublicMutation = useMutation({
    mutationFn: ({ id, current }: { id: string; current: boolean }) =>
      toggleBuildPublic(id, !current),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBuilds', user?.id] });
    },
  });

  const handleResendConfirmation = async () => {
    if (!user?.email) return;
    setResendLoading(true);
    setResendMessage(null);

    const { error } = await resendConfirmation(user.email);

    if (error) {
      setResendMessage({ type: 'error', text: error });
    } else {
      setResendMessage({
        type: 'success',
        text: 'Confirmation email sent! Check your inbox.',
      });
    }
    setResendLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage(null);

    if (!editUsername.trim()) {
      setUpdateMessage({ type: 'error', text: 'Username cannot be empty' });
      setUpdateLoading(false);
      return;
    }

    const { error } = await updateProfile({
      username: editUsername.trim(),
      displayName: editDisplayName.trim() || null,
    });

    if (error) {
      setUpdateMessage({ type: 'error', text: error });
    } else {
      setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditMode(false);
    }
    setUpdateLoading(false);
  };

  const handleCancelEdit = () => {
    setEditUsername(profile?.username ?? '');
    setEditDisplayName(profile?.displayName ?? '');
    setEditMode(false);
    setUpdateMessage(null);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const publicCount = builds.filter((b) => b.isPublic).length;

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
      {/* Profile header */}
      <div className="bg-wf-bg-card border border-wf-border rounded-lg p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-wf-bg-hover border border-wf-border flex items-center justify-center flex-shrink-0">
          <span className="text-wf-gold text-2xl font-bold">
            {(profile?.displayName ?? profile?.username ?? 'U').charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-wf-gold truncate">
            {profile?.displayName ?? profile?.username ?? 'Tenno'}
          </h1>
          {profile?.displayName && (
            <p className="text-sm text-wf-text-muted">@{profile.username}</p>
          )}
          <div className="flex gap-4 mt-1 text-xs text-wf-text-muted">
            <span>{builds.length} build{builds.length !== 1 ? 's' : ''}</span>
            <span>{publicCount} public</span>
          </div>
        </div>
        {profile && (
          <Link
            to={`/user/${profile.username}`}
            className="text-sm text-wf-blue hover:underline flex-shrink-0"
          >
            Public profile →
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-wf-border mb-6">
        {(['builds', 'account'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-wf-gold text-wf-gold'
                : 'border-transparent text-wf-text-dim hover:text-wf-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Builds tab */}
      {activeTab === 'builds' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-wf-text">My Builds</h2>
            <div className="flex gap-2">
              <Link
                to="/builder"
                className="px-3 py-1.5 text-sm bg-wf-gold text-wf-bg-dark rounded font-medium hover:bg-wf-gold-light transition-colors"
              >
                + Warframe Build
              </Link>
              <Link
                to="/builder/primary"
                className="px-3 py-1.5 text-sm border border-wf-border rounded text-wf-text-dim hover:text-wf-text hover:border-wf-border-light transition-colors"
              >
                + Weapon Build
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 rounded-lg bg-wf-bg-card border border-wf-border animate-pulse" />
              ))}
            </div>
          ) : builds.length === 0 ? (
            <div className="rounded-lg border border-dashed border-wf-border p-12 text-center">
              <p className="text-wf-text-dim mb-3">No builds yet.</p>
              <Link
                to="/builder"
                className="text-sm text-wf-gold hover:underline"
              >
                Create your first build →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {builds.map((build) => (
                <BuildCard
                  key={build.id}
                  build={build}
                  showOwnerControls
                  onTogglePublic={(id, current) =>
                    togglePublicMutation.mutate({ id, current })
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Account tab */}
      {activeTab === 'account' && (
        <div className="max-w-md space-y-6">
          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="bg-wf-bg-card border border-wf-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-wf-text">Edit Profile</h3>
              
              <div>
                <label className="block text-wf-text-muted text-sm mb-1">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-wf-bg-hover border border-wf-border rounded text-wf-text focus:outline-none focus:border-wf-gold"
                  placeholder="Username"
                />
              </div>

              <div>
                <label className="block text-wf-text-muted text-sm mb-1">Display Name (optional)</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-wf-bg-hover border border-wf-border rounded text-wf-text focus:outline-none focus:border-wf-gold"
                  placeholder="Display Name"
                />
              </div>

              {updateMessage && (
                <p
                  className={`text-sm ${
                    updateMessage.type === 'success'
                      ? 'text-wf-success'
                      : 'text-wf-danger'
                  }`}
                >
                  {updateMessage.text}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 px-4 py-2 bg-wf-gold text-wf-bg-dark rounded-lg hover:bg-wf-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 bg-wf-bg-hover text-wf-text border border-wf-border rounded-lg hover:border-wf-border-light transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="bg-wf-bg-card border border-wf-border rounded-lg p-6 space-y-3">
                <div>
                  <span className="text-wf-text-muted text-sm">Username</span>
                  <p className="text-wf-text">{profile?.username ?? '—'}</p>
                </div>
                {profile?.displayName && (
                  <div>
                    <span className="text-wf-text-muted text-sm">Display Name</span>
                    <p className="text-wf-text">{profile.displayName}</p>
                  </div>
                )}
                <div>
                  <span className="text-wf-text-muted text-sm">Email</span>
                  <p className="text-wf-text">{user.email}</p>
                  <p className="text-xs text-wf-text-muted mt-1">
                    {user.email_confirmed_at ? '✓ Confirmed' : '⚠ Unconfirmed'}
                  </p>
                </div>
                <div>
                  <span className="text-wf-text-muted text-sm">Member since</span>
                  <p className="text-wf-text">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditMode(true);
                  setEditUsername(profile?.username ?? '');
                  setEditDisplayName(profile?.displayName ?? '');
                }}
                className="w-full px-4 py-2 bg-wf-blue/20 text-wf-blue border border-wf-blue/30 rounded-lg hover:bg-wf-blue/30 transition-colors text-sm font-medium"
              >
                Edit Profile
              </button>
            </>
          )}

          {!user.email_confirmed_at && (
            <div className="bg-wf-warning/10 border border-wf-warning/30 rounded-lg p-4 space-y-3">
              <p className="text-sm text-wf-text">
                Your email address is not confirmed. Please check your inbox for a confirmation link.
              </p>
              <button
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="w-full px-4 py-2 bg-wf-gold text-wf-bg-dark rounded-lg hover:bg-wf-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
              </button>
              {resendMessage && (
                <p
                  className={`text-sm ${
                    resendMessage.type === 'success'
                      ? 'text-wf-success'
                      : 'text-wf-danger'
                  }`}
                >
                  {resendMessage.text}
                </p>
              )}
            </div>
          )}

          <button
            onClick={signOut}
            className="w-full px-4 py-2 bg-wf-danger/20 text-wf-danger border border-wf-danger/30 rounded-lg hover:bg-wf-danger/30 transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
