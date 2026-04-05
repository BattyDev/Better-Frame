import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Home() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-16">
      <h1 className="text-5xl font-bold text-wf-gold mb-4 tracking-tight">
        Tenno Trove
      </h1>
      <p className="text-wf-text-dim text-lg mb-8 max-w-xl text-center">
        A vault full of builds.
        Build, share, and discover complete Warframe loadouts.
        Not just single builds — full loadouts with every slot.
      </p>

      <div className="flex gap-4">
        <Link
          to="/builder"
          className="px-6 py-3 bg-wf-gold text-wf-bg-dark font-semibold rounded-lg hover:bg-wf-gold-light transition-colors"
        >
          Open Builder
        </Link>
        <Link
          to="/browse"
          className="px-6 py-3 border border-wf-border text-wf-text rounded-lg hover:bg-wf-bg-hover transition-colors"
        >
          Browse Builds
        </Link>
      </div>

      {!user && (
        <p className="mt-8 text-wf-text-muted text-sm">
          <Link to="/login" className="text-wf-blue hover:text-wf-blue-light underline">
            Sign in
          </Link>{' '}
          to save and share your builds.
        </p>
      )}
    </div>
  );
}
