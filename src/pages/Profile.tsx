import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const { user, profile, signOut } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold text-wf-gold mb-4">Profile</h1>
      <div className="rounded-lg border border-wf-border bg-wf-bg-card p-6 max-w-md">
        <div className="space-y-3">
          <div>
            <span className="text-wf-text-muted text-sm">Username</span>
            <p className="text-wf-text">{profile?.username ?? 'Not set'}</p>
          </div>
          <div>
            <span className="text-wf-text-muted text-sm">Email</span>
            <p className="text-wf-text">{user.email}</p>
          </div>
          <div>
            <span className="text-wf-text-muted text-sm">Member since</span>
            <p className="text-wf-text">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-6 px-4 py-2 bg-wf-danger/20 text-wf-danger border border-wf-danger/30 rounded-lg hover:bg-wf-danger/30 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
