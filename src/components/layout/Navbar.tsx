import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/builder', label: 'Warframe' },
  { to: '/builder/primary', label: 'Primary' },
  { to: '/builder/secondary', label: 'Secondary' },
  { to: '/builder/melee', label: 'Melee' },
  { to: '/loadout', label: 'Loadout' },
  { to: '/browse', label: 'Browse' },
];

export default function Navbar() {
  const location = useLocation();
  const { user, profile } = useAuthStore();

  return (
    <nav className="bg-wf-bg border-b border-wf-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-wf-gold font-bold text-xl tracking-tight">
            Better Frame
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-wf-bg-hover text-wf-gold'
                    : 'text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/profile"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/profile'
                  ? 'bg-wf-bg-hover text-wf-gold'
                  : 'text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-light'
              }`}
            >
              {profile?.username ?? 'Profile'}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-sm font-medium text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-light transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-wf-gold text-wf-bg-dark hover:bg-wf-gold-light transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
