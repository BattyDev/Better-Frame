import { useState, useEffect, useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  fetchWorldState,
  getTimeRemaining,
  formatCredits,
  getSoonestExpiry,
  EmptyResponseError,
  type WorldState,
  type Fissure,
  type Invasion,
  type VoidTraderItem,
} from '../lib/worldState';

// ─── Countdown hook ─────────────────────────────────────────────────────────

function useCountdown(expiry: string) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(expiry));
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeRemaining(expiry)), 1000);
    return () => clearInterval(id);
  }, [expiry]);
  return timeLeft;
}

// ─── Pinned trackers ────────────────────────────────────────────────────────

type TrackerKey =
  | 'cycles' | 'baro' | 'fissures' | 'sortie'
  | 'archonHunt' | 'invasions' | 'nightwave' | 'steelPath';

const TRACKER_LABELS: Record<TrackerKey, string> = {
  cycles: 'World Cycles',
  baro: 'Baro Ki\'Teer',
  fissures: 'Void Fissures',
  sortie: 'Sortie',
  archonHunt: 'Archon Hunt',
  invasions: 'Invasions',
  nightwave: 'Nightwave',
  steelPath: 'Steel Path',
};

const ALL_TRACKERS: TrackerKey[] = [
  'cycles', 'baro', 'fissures', 'sortie',
  'archonHunt', 'invasions', 'nightwave', 'steelPath',
];

function getStoredPins(): Set<TrackerKey> {
  try {
    const stored = localStorage.getItem('bf-pinned-trackers');
    if (stored) return new Set(JSON.parse(stored));
  } catch { /* ignore */ }
  return new Set(ALL_TRACKERS);
}

function savePins(pins: Set<TrackerKey>) {
  localStorage.setItem('bf-pinned-trackers', JSON.stringify([...pins]));
}

// ─── Section wrapper ────────────────────────────────────────────────────────

function TrackerSection({ title, pinned, onTogglePin, children }: {
  title: string;
  pinned: boolean;
  onTogglePin: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-wf-bg-card border border-wf-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-wf-border">
        <h3 className="text-sm font-medium text-wf-gold">{title}</h3>
        <button
          onClick={onTogglePin}
          className={`text-xs px-2 py-0.5 rounded transition-colors ${
            pinned
              ? 'text-wf-gold bg-wf-gold/10 hover:bg-wf-gold/20'
              : 'text-wf-text-muted hover:text-wf-text hover:bg-wf-bg-light'
          }`}
          title={pinned ? 'Unpin tracker' : 'Pin tracker'}
        >
          {pinned ? 'Pinned' : 'Pin'}
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Cycle card ─────────────────────────────────────────────────────────────

function CycleCard({ name, state, expiry, color }: {
  name: string;
  state: string;
  expiry: string;
  color: string;
}) {
  const timeLeft = useCountdown(expiry);
  return (
    <div className="flex items-center justify-between p-3 rounded bg-wf-bg border border-wf-border">
      <div>
        <div className="text-xs text-wf-text-dim">{name}</div>
        <div className={`text-sm font-medium ${color}`}>
          {state.charAt(0).toUpperCase() + state.slice(1)}
        </div>
      </div>
      <div className="text-xs text-wf-text-muted font-mono">{timeLeft}</div>
    </div>
  );
}

// ─── World Cycles ───────────────────────────────────────────────────────────

function CyclesTracker({ data }: { data: WorldState }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <CycleCard
        name="Cetus"
        state={data.cetusCycle.isDay ? 'Day' : 'Night'}
        expiry={data.cetusCycle.expiry}
        color={data.cetusCycle.isDay ? 'text-wf-warning' : 'text-blue-400'}
      />
      <CycleCard
        name="Orb Vallis"
        state={data.vallisCycle.isWarm ? 'Warm' : 'Cold'}
        expiry={data.vallisCycle.expiry}
        color={data.vallisCycle.isWarm ? 'text-orange-400' : 'text-cyan-400'}
      />
      <CycleCard
        name="Cambion Drift"
        state={data.cambionCycle.state}
        expiry={data.cambionCycle.expiry}
        color={data.cambionCycle.state === 'fass' ? 'text-yellow-400' : 'text-purple-400'}
      />
      <CycleCard
        name="Earth"
        state={data.earthCycle.isDay ? 'Day' : 'Night'}
        expiry={data.earthCycle.expiry}
        color={data.earthCycle.isDay ? 'text-wf-warning' : 'text-blue-400'}
      />
      <CycleCard
        name="Zariman"
        state={data.zarimanCycle.isCorpus ? 'Corpus' : 'Grineer'}
        expiry={data.zarimanCycle.expiry}
        color={data.zarimanCycle.isCorpus ? 'text-cyan-300' : 'text-red-400'}
      />
      <CycleCard
        name="Duviri"
        state={data.duviriCycle.state}
        expiry={data.duviriCycle.expiry}
        color="text-wf-text"
      />
    </div>
  );
}

// ─── Baro Ki'Teer ───────────────────────────────────────────────────────────

function BaroTracker({ data }: { data: WorldState }) {
  const baro = data.voidTrader;
  const timeLeft = useCountdown(baro.expiry);
  const arrivalTime = useCountdown(baro.activation);
  const isActive = new Date(baro.activation).getTime() <= Date.now() &&
                   new Date(baro.expiry).getTime() > Date.now();

  if (!isActive) {
    return (
      <div className="text-center py-4">
        <div className="text-sm text-wf-text-dim">Baro Ki'Teer arrives in</div>
        <div className="text-2xl font-bold text-wf-gold font-mono mt-1">{arrivalTime}</div>
        <div className="text-xs text-wf-text-muted mt-1">{baro.location}</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-wf-text">{baro.location}</div>
          <div className="text-xs text-wf-text-muted">Leaves in {timeLeft}</div>
        </div>
        <div className="text-xs text-wf-gold font-medium">
          {baro.inventory.length} items
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-1">
        {baro.inventory.map((item: VoidTraderItem) => (
          <div
            key={item.uniqueName}
            className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-wf-bg"
          >
            <span className="text-wf-text truncate flex-1 mr-2">{item.item}</span>
            <div className="flex items-center gap-3 shrink-0">
              {item.ducats > 0 && (
                <span className="text-wf-warning">{item.ducats}d</span>
              )}
              <span className="text-wf-text-muted">{formatCredits(item.credits)}cr</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Void Fissures ──────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  'Lith': 'text-green-400',
  'Meso': 'text-cyan-400',
  'Neo': 'text-blue-400',
  'Axi': 'text-yellow-400',
  'Requiem': 'text-red-400',
  'Omnia': 'text-purple-400',
};

function FissuresTracker({ data }: { data: WorldState }) {
  const [filterTier, setFilterTier] = useState<string | null>(null);
  const [showSteel, setShowSteel] = useState(false);

  const activeFissures = data.fissures
    .filter((f: Fissure) => new Date(f.expiry).getTime() > Date.now())
    .filter((f: Fissure) => showSteel ? f.isHard : !f.isHard)
    .filter((f: Fissure) => !filterTier || f.tier === filterTier)
    .sort((a: Fissure, b: Fissure) => a.tierNum - b.tierNum);

  const tiers = ['Lith', 'Meso', 'Neo', 'Axi', 'Requiem', 'Omnia'];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowSteel(!showSteel)}
          className={`text-xs px-2 py-0.5 rounded transition-colors ${
            showSteel ? 'bg-wf-warning/20 text-wf-warning' : 'bg-wf-bg text-wf-text-muted hover:text-wf-text'
          }`}
        >
          Steel Path
        </button>
        <div className="h-3 w-px bg-wf-border" />
        {tiers.map(tier => (
          <button
            key={tier}
            onClick={() => setFilterTier(filterTier === tier ? null : tier)}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${
              filterTier === tier
                ? `${TIER_COLORS[tier] ?? 'text-wf-text'} bg-wf-bg-light`
                : 'text-wf-text-muted hover:text-wf-text'
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1">
        {activeFissures.map((f: Fissure) => (
          <div key={f.id} className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-wf-bg">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`shrink-0 font-medium ${TIER_COLORS[f.tier] ?? 'text-wf-text'}`}>
                {f.tier}
              </span>
              <span className="text-wf-text truncate">{f.node}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-wf-text-muted">{f.missionType}</span>
              <span className="text-wf-text-muted font-mono">{f.eta}</span>
            </div>
          </div>
        ))}
        {activeFissures.length === 0 && (
          <p className="text-xs text-wf-text-muted text-center py-3">No active fissures</p>
        )}
      </div>
    </div>
  );
}

// ─── Sortie ─────────────────────────────────────────────────────────────────

function SortieTracker({ data }: { data: WorldState }) {
  const sortie = data.sortie;
  const timeLeft = useCountdown(sortie.expiry);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-wf-text-dim">
          {sortie.boss} ({sortie.faction})
        </span>
        <span className="text-wf-text-muted font-mono">{timeLeft}</span>
      </div>
      {sortie.variants.map((v, i) => (
        <div key={i} className="p-2 rounded bg-wf-bg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-wf-text font-medium">{v.missionType}</span>
            <span className="text-wf-text-muted">{v.node}</span>
          </div>
          <div className="text-xs text-wf-warning mt-0.5">{v.modifier}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Archon Hunt ────────────────────────────────────────────────────────────

function ArchonHuntTracker({ data }: { data: WorldState }) {
  const hunt = data.archonHunt;
  const timeLeft = useCountdown(hunt.expiry);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-wf-text-dim">{hunt.boss}</span>
        <span className="text-wf-text-muted font-mono">{timeLeft}</span>
      </div>
      {hunt.missions.map((m, i) => (
        <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-wf-bg">
          <span className="text-wf-text font-medium">{m.type}</span>
          <span className="text-wf-text-muted">{m.node}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Invasions ──────────────────────────────────────────────────────────────

function InvasionsTracker({ data }: { data: WorldState }) {
  const active = data.invasions.filter((inv: Invasion) => inv.completion < 100);

  return (
    <div className="max-h-48 overflow-y-auto space-y-2">
      {active.map((inv: Invasion) => (
        <div key={inv.id} className="p-2 rounded bg-wf-bg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-wf-text font-medium">{inv.node}</span>
            <span className="text-wf-text-muted">{Math.round(inv.completion)}%</span>
          </div>
          <div className="text-xs text-wf-text-dim mt-0.5">{inv.desc}</div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-red-400">{inv.attacker.faction}</span>
            <span className="text-blue-400">{inv.defender.faction}</span>
          </div>
          {/* Progress bar */}
          <div className="h-1 rounded-full bg-blue-900 mt-1 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${inv.completion}%` }}
            />
          </div>
        </div>
      ))}
      {active.length === 0 && (
        <p className="text-xs text-wf-text-muted text-center py-3">No active invasions</p>
      )}
    </div>
  );
}

// ─── Nightwave ──────────────────────────────────────────────────────────────

function NightwaveTracker({ data }: { data: WorldState }) {
  const nw = data.nightwave;
  if (!nw) return <p className="text-xs text-wf-text-muted">No active Nightwave season</p>;

  const active = nw.activeChallenges
    .filter(c => new Date(c.expiry).getTime() > Date.now())
    .sort((a, b) => b.reputation - a.reputation);

  return (
    <div className="space-y-2">
      <div className="text-xs text-wf-text-dim">Season {nw.season}</div>
      <div className="max-h-48 overflow-y-auto space-y-1">
        {active.map(c => (
          <div key={c.id} className="p-2 rounded bg-wf-bg">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${
                c.isElite ? 'text-wf-warning' : c.isDaily ? 'text-wf-text-dim' : 'text-wf-text'
              }`}>
                {c.title}
              </span>
              <span className="text-xs text-wf-accent">{c.reputation.toLocaleString()}</span>
            </div>
            <p className="text-xs text-wf-text-muted mt-0.5">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Steel Path ─────────────────────────────────────────────────────────────

function SteelPathTracker({ data }: { data: WorldState }) {
  const sp = data.steelPath;
  const timeLeft = useCountdown(sp.expiry);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-wf-text">{sp.currentReward.name}</div>
          <div className="text-xs text-wf-text-muted">{sp.currentReward.cost} Steel Essence</div>
        </div>
        <div className="text-xs text-wf-text-muted font-mono">{timeLeft}</div>
      </div>
      <div className="text-xs text-wf-text-dim">Upcoming rotation:</div>
      <div className="flex flex-wrap gap-1">
        {sp.rotation.slice(0, 8).map((r, i) => (
          <span
            key={i}
            className={`text-xs px-2 py-0.5 rounded ${
              r.name === sp.currentReward.name
                ? 'bg-wf-gold/20 text-wf-gold'
                : 'bg-wf-bg text-wf-text-muted'
            }`}
          >
            {r.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const [pins, setPins] = useState<Set<TrackerKey>>(getStoredPins);

  const { data, isLoading, error, dataUpdatedAt, refetch, isRefetching } = useQuery({
    queryKey: ['worldState'],
    queryFn: fetchWorldState,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchInterval: (query) => {
      const ws = query.state.data as WorldState | undefined;
      if (!ws) return 60_000;
      const msUntilExpiry = getSoonestExpiry(ws) - Date.now() + 5_000;
      return Math.max(10_000, Math.min(msUntilExpiry, 300_000));
    },
    retry: (failureCount, error) => {
      if (error instanceof EmptyResponseError) return failureCount < 5;
      return failureCount < 3;
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15_000),
  });

  const togglePin = useCallback((key: TrackerKey) => {
    setPins(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      savePins(next);
      return next;
    });
  }, []);

  // Sort: pinned first, then unpinned
  const sortedTrackers = [...ALL_TRACKERS].sort((a, b) => {
    const ap = pins.has(a) ? 0 : 1;
    const bp = pins.has(b) ? 0 : 1;
    return ap - bp;
  });

  if (isLoading && !data) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center py-20">
        <div className="text-wf-gold text-lg">Loading world state...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-wf-danger text-sm">
          Failed to load world state.
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="px-4 py-1.5 text-sm rounded bg-wf-gold/20 text-wf-gold hover:bg-wf-gold/30 disabled:opacity-50 transition-colors"
        >
          {isRefetching ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  const trackerComponents: Record<TrackerKey, React.ReactNode> = {
    cycles: <CyclesTracker data={data} />,
    baro: <BaroTracker data={data} />,
    fissures: <FissuresTracker data={data} />,
    sortie: <SortieTracker data={data} />,
    archonHunt: <ArchonHuntTracker data={data} />,
    invasions: <InvasionsTracker data={data} />,
    nightwave: <NightwaveTracker data={data} />,
    steelPath: <SteelPathTracker data={data} />,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-wf-gold">World State</h1>
        <div className="flex items-center gap-3">
          {dataUpdatedAt > 0 && (
            <span className="text-xs text-wf-text-muted">
              Updated {new Date(dataUpdatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between px-4 py-2 rounded bg-wf-warning/10 border border-wf-warning/30">
          <span className="text-xs text-wf-warning">
            Using cached data — last update failed
          </span>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="text-xs px-3 py-1 rounded bg-wf-warning/20 text-wf-warning hover:bg-wf-warning/30 disabled:opacity-50 transition-colors"
          >
            {isRefetching ? 'Retrying...' : 'Retry Now'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedTrackers.map(key => (
          <TrackerSection
            key={key}
            title={TRACKER_LABELS[key]}
            pinned={pins.has(key)}
            onTogglePin={() => togglePin(key)}
          >
            {trackerComponents[key]}
          </TrackerSection>
        ))}
      </div>
    </div>
  );
}
