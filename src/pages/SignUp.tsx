import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Navigate, Link } from 'react-router-dom';
import { OAuthButtons } from '../components/auth/OAuthButtons';

export default function SignUp() {
  const { user, signUp, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    const result = await signUp(email, password, username);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-wf-gold mb-4">Check your email</h1>
          <p className="text-wf-text-dim">
            We sent a confirmation link to <strong className="text-wf-text">{email}</strong>.
          </p>
          <Link to="/login" className="mt-4 inline-block text-wf-blue hover:text-wf-blue-light underline">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-wf-gold mb-6 text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-wf-danger/20 border border-wf-danger/30 text-wf-danger text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="username" className="block text-sm text-wf-text-dim mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="w-full px-3 py-2 bg-wf-bg-light border border-wf-border rounded-lg text-wf-text focus:outline-none focus:border-wf-gold"
            />
          </div>
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
              minLength={6}
              className="w-full px-3 py-2 bg-wf-bg-light border border-wf-border rounded-lg text-wf-text focus:outline-none focus:border-wf-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-wf-gold text-wf-bg-dark font-semibold rounded-lg hover:bg-wf-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-4">
          <OAuthButtons withDivider onError={setError} />
        </div>
        <p className="mt-4 text-center text-sm text-wf-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-wf-blue hover:text-wf-blue-light underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
