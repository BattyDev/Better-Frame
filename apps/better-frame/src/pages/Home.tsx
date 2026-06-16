import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getItemImageUrl } from '../data/warframeData';

const CATEGORY_CARDS = [
  {
    label: 'Loadouts',
    description: 'Complete loadout setups with every slot filled.',
    to: '/browse/loadouts',
    image: null,
  },
  {
    label: 'Warframes',
    description: 'Browse and create warframe builds with full stat calculations.',
    to: '/builds/warframe',
    image: getItemImageUrl('excalibur-2621a69bfa.png'),
  },
  {
    label: 'Primary Weapons',
    description: 'Rifles, shotguns, bows, and more. Find your primary setup.',
    to: '/builds/primary',
    image: getItemImageUrl('braton-3e4617eb07.png'),
  },
  {
    label: 'Secondary Weapons',
    description: 'Pistols, throwing weapons, and sidearms.',
    to: '/builds/secondary',
    image: getItemImageUrl('lex-815d312d76.png'),
  },
  {
    label: 'Melee Weapons',
    description: 'Swords, polearms, heavy blades, and every other melee type.',
    to: '/builds/melee',
    image: getItemImageUrl('skana-ea97e089d8.png'),
  },
  {
    label: 'Companions',
    description: 'Sentinels, kubrows, kavats, and their weapons.',
    to: '/builds/companion',
    image: getItemImageUrl('carrier-f4e5806f6e.png'),
  },
  {
    label: 'Archwing',
    description: 'Archwing, arch-gun, and arch-melee builds.',
    to: '/builds/archwing',
    image: getItemImageUrl('odonata-0425304f27.png'),
  },
  {
    label: 'Necramech',
    description: 'Voidrig and Bonewidow builds.',
    to: '/builds/necramech',
    image: getItemImageUrl('voidrig-51bc3a4b3c.png'),
  },
];

export function Home() {
  const user = useAuthStore((s: ReturnType<typeof useAuthStore.getState>) => s.user);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <div className="flex flex-col items-center px-4">
      {/* ── Hero Search ── */}
      <section className="flex flex-col items-center justify-center py-16 lg:py-24 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-wf-gold mb-3 tracking-tight">
          Tenno Trove
        </h1>
        <p className="text-wf-text-dim text-lg mb-8">
          Find builds, plan loadouts, and discover what other Tenno are running.
        </p>

        <form onSubmit={handleSearchSubmit} className="w-full max-w-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search warframes, weapons, builds..."
            className="w-full px-4 py-3 rounded-lg bg-wf-bg-dark border border-wf-border
                       text-wf-text text-base placeholder:text-wf-text-muted
                       focus:outline-none focus:border-wf-gold-dim transition-colors"
          />
        </form>
      </section>

      {/* ── Category Cards ── */}
      <section className="w-full max-w-5xl pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="flex flex-col items-center p-5 rounded-lg bg-wf-bg-card border border-wf-border
                         hover:border-wf-gold-dim hover:bg-wf-bg-hover transition-colors group"
            >
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.label}
                  className="w-16 h-16 object-contain mb-3 group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="w-16 h-16 mb-3 flex items-center justify-center text-2xl text-wf-text-muted">
                  ⚔
                </div>
              )}
              <h3 className="text-sm font-semibold text-wf-gold mb-1 group-hover:text-wf-gold-light">
                {card.label}
              </h3>
              <p className="text-xs text-wf-text-dim text-center">{card.description}</p>
            </Link>
          ))}
        </div>

        {/* Compare card — secondary style */}
        <Link
          to="/compare"
          className="mt-4 block p-4 rounded-lg border border-dashed border-wf-border
                     hover:border-wf-gold-dim hover:bg-wf-bg-hover transition-colors text-center"
        >
          <span className="text-sm font-medium text-wf-text-dim">Compare Builds</span>
          <span className="text-xs text-wf-text-muted ml-2">
            Side-by-side build comparison
          </span>
        </Link>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="w-full max-w-5xl pb-8">
        <div className="rounded-lg bg-wf-bg-card border border-wf-border p-8 text-center">
          {user ? (
            <>
              <h2 className="text-xl font-bold text-wf-text mb-2">Your builds are waiting.</h2>
              <p className="text-sm text-wf-text-dim mb-6">
                Pick up where you left off or start something new.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-wf-gold text-wf-bg-dark font-semibold rounded-lg hover:bg-wf-gold-light transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/builder"
                  className="px-6 py-3 border border-wf-border text-wf-text rounded-lg hover:bg-wf-bg-hover transition-colors"
                >
                  Build Something New
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-wf-text mb-2">
                Ready to plan your arsenal?
              </h2>
              <p className="text-sm text-wf-text-dim mb-6">
                Sign up free to save builds, create loadouts, and share with the community.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-wf-gold text-wf-bg-dark font-semibold rounded-lg hover:bg-wf-gold-light transition-colors"
                >
                  Sign Up Free
                </Link>
                <Link
                  to="/builder"
                  className="px-6 py-3 border border-wf-border text-wf-text rounded-lg hover:bg-wf-bg-hover transition-colors"
                >
                  Try the Builder First
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
