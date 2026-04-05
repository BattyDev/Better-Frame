// World State API service — fetches live game data from warframestat.us
const API_BASE = 'https://api.warframestat.us/pc';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CycleState {
  id: string;
  state: string;
  timeLeft: string;
  expiry: string;
  activation: string;
}

export interface CetusCycle extends CycleState {
  isDay: boolean;
}

export interface VallisCycle extends CycleState {
  isWarm: boolean;
}

export interface CambionCycle extends CycleState {
  // state: 'fass' | 'vome'
}

export interface EarthCycle extends CycleState {
  isDay: boolean;
}

export interface ZarimanCycle extends CycleState {
  isCorpus: boolean;
}

export interface DuviriCycle extends CycleState {
  choices: { category: string; categoryKey: string; choices: string[] }[];
}

export interface VoidTrader {
  id: string;
  activation: string;
  expiry: string;
  character: string;
  location: string;
  active: boolean;
  inventory: VoidTraderItem[];
}

export interface VoidTraderItem {
  uniqueName: string;
  item: string;
  ducats: number;
  credits: number;
}

export interface Fissure {
  id: string;
  activation: string;
  expiry: string;
  node: string;
  missionType: string;
  missionTypeKey: string;
  enemy: string;
  tier: string;
  tierNum: number;
  isStorm: boolean;
  isHard: boolean;
  active: boolean;
  eta: string;
}

export interface SortieVariant {
  missionType: string;
  modifier: string;
  modifierDescription: string;
  node: string;
}

export interface Sortie {
  id: string;
  activation: string;
  expiry: string;
  rewardPool: string;
  variants: SortieVariant[];
  boss: string;
  faction: string;
  eta: string;
}

export interface ArchonHunt {
  id: string;
  activation: string;
  expiry: string;
  rewardPool: string;
  missions: { node: string; type: string; faction: string }[];
  boss: string;
  eta: string;
}

export interface Invasion {
  id: string;
  activation: string;
  node: string;
  desc: string;
  attacker: { reward: { items: string[]; countedItems: { count: number; type: string }[] }; faction: string };
  defender: { reward: { items: string[]; countedItems: { count: number; type: string }[] }; faction: string };
  eta: string;
  completion: number;
}

export interface Alert {
  id: string;
  activation: string;
  expiry: string;
  mission: { node: string; type: string; faction: string; reward: { items: string[]; credits: number } };
  eta: string;
  active: boolean;
}

export interface NightwaveChallenge {
  id: string;
  activation: string;
  expiry: string;
  title: string;
  desc: string;
  reputation: number;
  isDaily: boolean;
  isElite: boolean;
  active: boolean;
}

export interface Nightwave {
  id: string;
  activation: string;
  expiry: string;
  season: number;
  tag: string;
  phase: number;
  activeChallenges: NightwaveChallenge[];
}

export interface SteelPathReward {
  name: string;
  cost: number;
}

export interface SteelPath {
  currentReward: SteelPathReward;
  activation: string;
  expiry: string;
  remaining: string;
  rotation: SteelPathReward[];
}

export interface WorldState {
  cetusCycle: CetusCycle;
  vallisCycle: VallisCycle;
  cambionCycle: CambionCycle;
  earthCycle: EarthCycle;
  zarimanCycle: ZarimanCycle;
  duviriCycle: DuviriCycle;
  voidTrader: VoidTrader;
  fissures: Fissure[];
  sortie: Sortie;
  archonHunt: ArchonHunt;
  invasions: Invasion[];
  alerts: Alert[];
  nightwave: Nightwave;
  steelPath: SteelPath;
  timestamp: string;
}

// ─── Fetch ──────────────────────────────────────────────────────────────────

export class EmptyResponseError extends Error {
  constructor() {
    super('World state API returned an empty response');
    this.name = 'EmptyResponseError';
  }
}

export async function fetchWorldState(): Promise<WorldState> {
  const res = await fetch(`${API_BASE}/`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`World state API error: ${res.status}`);
  const text = await res.text();
  if (!text.trim()) throw new EmptyResponseError();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('World state API returned invalid JSON');
  }
}

/** Returns the soonest future cycle expiry as a timestamp (ms). */
export function getSoonestExpiry(ws: WorldState): number {
  const expiries = [
    ws.cetusCycle?.expiry,
    ws.vallisCycle?.expiry,
    ws.cambionCycle?.expiry,
    ws.earthCycle?.expiry,
    ws.zarimanCycle?.expiry,
    ws.duviriCycle?.expiry,
  ]
    .filter(Boolean)
    .map(e => new Date(e!).getTime())
    .filter(t => t > Date.now());
  return expiries.length ? Math.min(...expiries) : Date.now() + 60_000;
}

// ─── Time helpers ───────────────────────────────────────────────────────────

export function getTimeRemaining(expiry: string): string {
  const diff = new Date(expiry).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const w = Math.floor(diff / 604800000);
  const d = Math.floor((diff % 604800000) / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (w > 0) return `${w}w ${d}d ${h}h ${m}m`;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatCredits(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

// ─── localStorage cache ────────────────────────────────────────────────────

const WS_CACHE_KEY = 'bf-worldstate-cache';
const WS_CACHE_MAX_AGE = 3_600_000; // 1 hour

interface WorldStateCache {
  data: WorldState;
  savedAt: number;
}

export function saveWorldStateCache(data: WorldState): void {
  try {
    const entry: WorldStateCache = { data, savedAt: Date.now() };
    localStorage.setItem(WS_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // quota exceeded or unavailable — silently degrade
  }
}

export function loadWorldStateCache(): WorldStateCache | null {
  try {
    const raw = localStorage.getItem(WS_CACHE_KEY);
    if (!raw) return null;
    const entry: WorldStateCache = JSON.parse(raw);
    if (Date.now() - entry.savedAt > WS_CACHE_MAX_AGE) return null;
    return entry;
  } catch {
    return null;
  }
}
