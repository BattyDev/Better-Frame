import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { searchWarframes, getItemImageUrl } from '../../data/warframeData';
import { searchWeapons } from '../../data/weaponData';
import { BugReportModal } from '../BugReportModal';

interface QuickResult {
  name: string;
  category: string;
  imageUrl: string | null;
  to: string;
}

function useQuickSearch(query: string): QuickResult[] {
  return useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];

    const results: QuickResult[] = [];

    for (const wf of searchWarframes(q).slice(0, 3)) {
      results.push({
        name: wf.name,
        category: 'Warframe',
        imageUrl: wf.imageName ? getItemImageUrl(wf.imageName) : null,
        to: `/builds/warframe?item=${encodeURIComponent(wf.uniqueName)}`,
      });
    }

    for (const w of searchWeapons(q).slice(0, 3)) {
      results.push({
        name: w.name,
        category: w.category,
        imageUrl: w.imageName ? getItemImageUrl(w.imageName) : null,
        to: `/builds/${w.category.toLowerCase()}?item=${encodeURIComponent(w.uniqueName)}`,
      });
    }

    return results.slice(0, 5);
  }, [query]);
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const quickResults = useQuickSearch(searchQuery);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
      setSearchQuery('');
    }
  }

  const coreLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  const browseLinks = [
    { to: '/browse/loadouts', label: 'Loadouts' },
    { to: '/builds/warframe', label: 'Warframes' },
    { to: '/builds/primary', label: 'Primary Weapons' },
    { to: '/builds/secondary', label: 'Secondary Weapons' },
    { to: '/builds/melee', label: 'Melee Weapons' },
    { to: '/builds/companion', label: 'Companions' },
    { to: '/builds/archwing', label: 'Archwing' },
    { to: '/builds/necramech', label: 'Necramech' },
    { to: '/compare', label: 'Compare Builds' },
  ];

  return (
    <nav className="bg-wf-bg border-b border-wf-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        {/* Left: hamburger + brand + core links */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="sm:hidden p-1 rounded-md text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-light transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link to="/" className="text-wf-gold font-bold text-xl tracking-tight">
            Tenno Trove
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {coreLinks.map((link) => (
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

        {/* Center: search bar (desktop only) */}
        <div ref={searchRef} className="hidden sm:block flex-1 max-w-md relative">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search warframes, weapons, builds..."
              className="w-full px-3 py-1.5 rounded-md bg-wf-bg-dark border border-wf-border
                         text-wf-text text-sm placeholder:text-wf-text-muted
                         focus:outline-none focus:border-wf-gold-dim transition-colors"
            />
          </form>

          {/* Quick results dropdown */}
          {showDropdown && quickResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-wf-bg-card border border-wf-border rounded-lg shadow-lg z-50 overflow-hidden">
              {quickResults.map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  onClick={() => {
                    setShowDropdown(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-wf-bg-hover transition-colors"
                >
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt={r.name} className="w-6 h-6 object-contain" />
                  ) : (
                    <div className="w-6 h-6" />
                  )}
                  <span className="text-sm text-wf-text truncate">{r.name}</span>
                  <span className="text-xs text-wf-text-muted ml-auto shrink-0">{r.category}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setShowDropdown(false);
                    setSearchQuery('');
                  }
                }}
                className="w-full px-3 py-2 text-sm text-wf-blue hover:bg-wf-bg-hover transition-colors text-left border-t border-wf-border"
              >
                See all results for &ldquo;{searchQuery.trim()}&rdquo;
              </button>
            </div>
          )}
        </div>

        {/* Right: auth (desktop) */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {user && (
            <button
              onClick={() => setBugOpen(true)}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-wf-text-dim hover:text-wf-warning hover:bg-wf-bg-light transition-colors"
              title="Report a bug"
            >
              Report Bug
            </button>
          )}
          {user ? (
            <>
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
              {profile && (profile.role === 'admin' || profile.role === 'moderator') && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-wf-bg-hover text-wf-warning'
                      : 'text-wf-warning/60 hover:text-wf-warning hover:bg-wf-bg-light'
                  }`}
                >
                  Admin
                </Link>
              )}
            </>
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

        {/* Right: condensed auth (mobile) */}
        <div className="sm:hidden flex items-center shrink-0">
          {user ? (
            <Link
              to="/profile"
              className="px-2 py-1.5 rounded-md text-sm font-medium text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-light transition-colors"
            >
              {profile?.username ?? 'Profile'}
            </Link>
          ) : (
            <Link
              to="/signup"
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-wf-gold text-wf-bg-dark hover:bg-wf-gold-light transition-colors"
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-wf-border px-4 py-3 space-y-3">
          {/* Mobile search */}
          <div ref={mobileMenuOpen ? undefined : searchRef} className="relative">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search warframes, weapons, builds..."
                className="w-full px-3 py-2 rounded-md bg-wf-bg-dark border border-wf-border
                           text-wf-text text-sm placeholder:text-wf-text-muted
                           focus:outline-none focus:border-wf-gold-dim transition-colors"
              />
            </form>

            {showDropdown && quickResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-wf-bg-card border border-wf-border rounded-lg shadow-lg z-50 overflow-hidden">
                {quickResults.map((r) => (
                  <Link
                    key={r.to}
                    to={r.to}
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-wf-bg-hover transition-colors"
                  >
                    {r.imageUrl ? (
                      <img src={r.imageUrl} alt={r.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <div className="w-6 h-6" />
                    )}
                    <span className="text-sm text-wf-text truncate">{r.name}</span>
                    <span className="text-xs text-wf-text-muted ml-auto shrink-0">
                      {r.category}
                    </span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setShowDropdown(false);
                      setSearchQuery('');
                    }
                  }}
                  className="w-full px-3 py-2 text-sm text-wf-blue hover:bg-wf-bg-hover transition-colors text-left border-t border-wf-border"
                >
                  See all results for &ldquo;{searchQuery.trim()}&rdquo;
                </button>
              </div>
            )}
          </div>

          {/* Mobile nav links */}
          <div className="flex flex-col gap-1">
            {coreLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-wf-bg-hover text-wf-gold'
                    : 'text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Browse links */}
          <div className="flex flex-col gap-1 border-t border-wf-border pt-3">
            <span className="px-3 text-xs font-medium text-wf-text-muted uppercase tracking-wider">
              Browse
            </span>
            {browseLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-wf-bg-hover text-wf-gold'
                    : 'text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile auth links */}
          <div className="flex flex-col gap-1 border-t border-wf-border pt-3">
            {user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setBugOpen(true);
                }}
                className="px-3 py-2 rounded-md text-sm font-medium text-left text-wf-text-dim hover:text-wf-warning hover:bg-wf-bg-light transition-colors"
              >
                Report Bug
              </button>
            )}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/profile'
                      ? 'bg-wf-bg-hover text-wf-gold'
                      : 'text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-light'
                  }`}
                >
                  {profile?.username ?? 'Profile'}
                </Link>
                {profile && (profile.role === 'admin' || profile.role === 'moderator') && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/admin'
                        ? 'bg-wf-bg-hover text-wf-warning'
                        : 'text-wf-warning/60 hover:text-wf-warning hover:bg-wf-bg-light'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-light transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-wf-gold text-wf-bg-dark hover:bg-wf-gold-light transition-colors text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <BugReportModal open={bugOpen} onClose={() => setBugOpen(false)} />
    </nav>
  );
}
