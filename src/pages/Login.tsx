import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Navigate, Link } from 'react-router-dom';

export default function Login() {
  const { user, signIn, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-wf-gold mb-6 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-wf-danger/20 border border-wf-danger/30 text-wf-danger text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm text-wf-text-dim mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-wf-bg-light border border-wf-border rounded-lg text-wf-text focus:outline-none focus:border-wf-gold"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-wf-text-dim mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-wf-bg-light border border-wf-border rounded-lg text-wf-text focus:outline-none focus:border-wf-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-wf-gold text-wf-bg-dark font-semibold rounded-lg hover:bg-wf-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-wf-text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="text-wf-blue hover:text-wf-blue-light underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
