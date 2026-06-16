import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const TIMEOUT_MS = 10_000;

export default function AuthCallback() {
  const session = useAuthStore((s) => s.session);
  const [searchParams] = useSearchParams();
  const [timedOut, setTimedOut] = useState(false);

  const errorParam = searchParams.get('error_description') || searchParams.get('error');

  useEffect(() => {
    if (errorParam) return;
    const id = window.setTimeout(() => setTimedOut(true), TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [errorParam]);

  if (errorParam) {
    return <Navigate to={`/login?error=${encodeURIComponent(errorParam)}`} replace />;
  }

  if (session) {
    return <Navigate to="/profile" replace />;
  }

  if (timedOut) {
    return <Navigate to="/login?error=Sign-in%20timed%20out.%20Please%20try%20again." replace />;
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-wf-bg-dark">
      <div className="text-wf-gold text-lg">Signing you in...</div>
    </div>
  );
}
