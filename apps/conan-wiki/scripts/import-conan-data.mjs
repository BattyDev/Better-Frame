// Imports Conan Wiki CSV dataset into Supabase.
//
// Usage:
//   1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in apps/conan-wiki/.env
//   2. Run: npm run import-conan-data -w conan-wiki -- --source "<path-to-data-folder>"
//
// The script is idempotent — reference tables use upsert on PK, relation
// tables truncate-and-insert (they have surrogate PKs).

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';
import { config as loadDotenv } from 'dotenv';

loadDotenv();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in apps/conan-wiki/.env'
  );
  process.exit(1);
}

const srcIdx = process.argv.indexOf('--source');
if (srcIdx === -1 || !process.argv[srcIdx + 1]) {
  console.error('Pass --source <path-to-data-folder> with the CSV files.');
  process.exit(1);
}
const SRC_DIR = process.argv[srcIdx + 1];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// --- Coercion helpers ----------------------------------------------------

function num(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function int(v) {
  if (v == null || v === '') return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}

function bool(v) {
  if (v == null || v === '') return null;
  if (v === '1' || v === 'true' || v === 'True') return true;
  if (v === '0' || v === 'false' || v === 'False') return false;
  return null;
}

function txt(v) {
  if (v == null) return null;
  const t = String(v).trim();
  return t === '' ? null : t;
}

// --- CSV loader -----------------------------------------------------------

function readCsv(filename) {
  const path = resolve(SRC_DIR, filename);
  const raw = readFileSync(path, 'utf-8');
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  });
}

// --- Dedup -----------------------------------------------------------------

// Keep the last row per key. Required for upsert: a single batch cannot
// contain two rows that conflict on the same constrained column.
function dedupBy(rows, keyFn) {
  const m = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    if (k == null) continue;
    m.set(k, r);
  }
  return [...m.values()];
}

// --- Batch insert / upsert -----------------------------------------------

const BATCH_SIZE = 500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Retry transient network failures (ECONNRESET, fetch failed, etc.) with
// exponential backoff. PostgREST errors (RLS, constraint violations) come
// back in `error` and are NOT retried — only thrown fetch/network errors.
async function withRetry(label, fn, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      const last = i === attempts - 1;
      const wait = 1000 * 2 ** i;
      console.warn(`  ~ ${label} retry ${i + 1}/${attempts} (${e.message ?? e}); waiting ${wait}ms`);
      if (last) throw e;
      await sleep(wait);
    }
  }
}

async function upsertInBatches(table, rows, onConflict) {
  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await withRetry(`${table}@${i}`, () =>
      supabase.from(table).upsert(batch, onConflict ? { onConflict } : undefined)
    );
    if (error) {
      console.error(`  ! ${table} batch at row ${i}:`, error.message);
      throw error;
    }
    total += batch.length;
  }
  return total;
}

async function truncateAndInsert(table, rows) {
  // Service role bypasses RLS so DELETE works without policies.
  const { error: delErr } = await withRetry(`${table}.delete`, () =>
    supabase.from(table).delete().gte('id', 0)
  );
  if (delErr) {
    console.error(`  ! ${table} truncate:`, delErr.message);
    throw delErr;
  }
  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await withRetry(`${table}@${i}`, () =>
      supabase.from(table).insert(batch)
    );
    if (error) {
      console.error(`  ! ${table} batch at row ${i}:`, error.message);
      throw error;
    }
    total += batch.length;
  }
  return total;
}

// --- Per-table importers --------------------------------------------------

async function importItems() {
  const raw = readCsv('items.csv');
  const rows = dedupBy(
    raw.map((r) => ({
      id: int(r.id),
      name: txt(r.name),
      type: txt(r.type),
      grade: txt(r.grade),
      source: txt(r.source),
      dlc: txt(r.dlc),
      equip_slot: txt(r.equip_slot),
      weapontype: txt(r.weapontype),
      dmg: num(r.dmg),
      armor_pen: num(r.armor_pen),
      armor: num(r.armor),
      armortype: txt(r.armortype),
      durability: num(r.durability),
      weight: num(r.weight),
      heat_res: num(r.heat_res),
      cold_res: num(r.cold_res),
      is_craftable: bool(r.is_craftable),
      is_crafting_station: bool(r.is_crafting_station),
      knowledge_feat_ids: txt(r.knowledge_feat_ids),
    })).filter((r) => r.id != null && r.name),
    (r) => r.id
  );
  return upsertInBatches('conan_items', rows, 'id');
}

async function importRecipes() {
  const raw = readCsv('recipes.csv');
  const rows = dedupBy(
    raw.map((r) => ({
      recipe_id: int(r.recipe_id),
      product_name: txt(r.product_name),
      category: txt(r.category),
      player_level: int(r.player_level),
      kp_cost: int(r.kp_cost),
      feat_required: txt(r.feat_required),
      feat_id_required: int(r.feat_id_required),
      teaches_feat: txt(r.teaches_feat),
      journey_reward: txt(r.journey_reward),
    })).filter((r) => r.recipe_id != null && r.product_name),
    (r) => r.recipe_id
  );
  return upsertInBatches('conan_recipes', rows, 'recipe_id');
}

async function importRecipeIngredients() {
  const raw = readCsv('recipe_ingredients.csv');
  // outcome is the PK — dedup just in case.
  const byOutcome = new Map();
  for (const r of raw) {
    const outcome = txt(r.outcome);
    if (!outcome) continue;
    byOutcome.set(outcome, {
      outcome,
      outcome_qty: int(r.outcome_qty),
      n_ingredients: int(r.n_ingredients),
      ingredients: txt(r.ingredients),
    });
  }
  return upsertInBatches('conan_recipe_ingredients', [...byOutcome.values()], 'outcome');
}

async function importFeats() {
  const raw = readCsv('feats.csv');
  const rows = dedupBy(
    raw.map((r) => ({
      feat: txt(r.feat),
      category: txt(r.category),
      min_player_level: int(r.min_player_level),
      recipes_unlocked: int(r.recipes_unlocked),
      is_ancestral: bool(r.is_ancestral),
    })).filter((r) => r.feat),
    (r) => r.feat
  );
  return upsertInBatches('conan_feats', rows, 'feat');
}

async function importThralls() {
  const raw = readCsv('thralls.csv');
  const rows = dedupBy(
    raw.map((r) => ({
      id: txt(r.id),
      name: txt(r.name),
      category: txt(r.category),
      profession: txt(r.profession),
      race: txt(r.race),
      faction: txt(r.faction),
      crafting_spec: txt(r.crafting_spec),
      capturable: bool(r.capturable),
    })).filter((r) => r.id && r.name),
    (r) => r.id
  );
  return upsertInBatches('conan_thralls', rows, 'id');
}

async function importCreatures() {
  const raw = readCsv('creatures.csv');
  const rows = dedupBy(
    raw.map((r) => ({
      id: txt(r.id),
      name: txt(r.name),
      hp: num(r.hp),
      armor: num(r.armor),
      temperament: txt(r.temperament),
      map: txt(r.map),
      biomes: txt(r.biomes),
      locations: txt(r.locations),
      drops: txt(r.drops),
    })).filter((r) => r.id && r.name),
    (r) => r.id
  );
  return upsertInBatches('conan_creatures', rows, 'id');
}

async function importLocations() {
  const raw = readCsv('locations.csv');
  const byName = new Map();
  for (const r of raw) {
    const name = txt(r.name);
    if (!name) continue;
    byName.set(name, {
      name,
      map: txt(r.map),
      biome: txt(r.biome),
      type: txt(r.type),
      faction: txt(r.faction),
      unmarked: bool(r.unmarked),
    });
  }
  return upsertInBatches('conan_locations', [...byName.values()], 'name');
}

async function importRelItemFeat() {
  const raw = readCsv('rel_item_feat.csv');
  const rows = raw.map((r) => ({
    item_id: int(r.item_id),
    item_name: txt(r.item_name),
    feat_id: int(r.feat_id),
    feat_name: txt(r.feat_name),
  }));
  return truncateAndInsert('conan_rel_item_feat', rows);
}

async function importRelItemRecipe() {
  const raw = readCsv('rel_item_recipe.csv');
  const rows = raw.map((r) => ({
    item_id: int(r.item_id),
    item_name: txt(r.item_name),
    recipe_id: int(r.recipe_id),
    category: txt(r.category),
    player_level: int(r.player_level),
    kp_cost: int(r.kp_cost),
    feat_required: txt(r.feat_required),
    feat_id_required: int(r.feat_id_required),
  }));
  return truncateAndInsert('conan_rel_item_recipe', rows);
}

async function importRelCreatureDrops() {
  const raw = readCsv('rel_creature_drops.csv');
  const rows = raw.map((r) => ({
    creature: txt(r.creature),
    item_dropped: txt(r.item_dropped),
  })).filter((r) => r.creature && r.item_dropped);
  return truncateAndInsert('conan_rel_creature_drops', rows);
}

async function importRelCreatureBiomes() {
  const raw = readCsv('rel_creature_biomes.csv');
  const rows = raw.map((r) => ({
    creature: txt(r.creature),
    biome: txt(r.biome),
  })).filter((r) => r.creature && r.biome);
  return truncateAndInsert('conan_rel_creature_biomes', rows);
}

async function importRelRecipeIngredients() {
  const raw = readCsv('rel_recipe_ingredients.csv');
  const rows = raw.map((r) => ({
    outcome: txt(r.outcome),
    ingredient: txt(r.ingredient),
    quantity: num(r.quantity),
  })).filter((r) => r.outcome && r.ingredient);
  return truncateAndInsert('conan_rel_recipe_ingredients', rows);
}

// --- Driver --------------------------------------------------------------

const tasks = [
  ['items', importItems],
  ['recipes', importRecipes],
  ['recipe_ingredients', importRecipeIngredients],
  ['feats', importFeats],
  ['thralls', importThralls],
  ['creatures', importCreatures],
  ['locations', importLocations],
  ['rel_item_feat', importRelItemFeat],
  ['rel_item_recipe', importRelItemRecipe],
  ['rel_creature_drops', importRelCreatureDrops],
  ['rel_creature_biomes', importRelCreatureBiomes],
  ['rel_recipe_ingredients', importRelRecipeIngredients],
];

console.log(`Importing from: ${SRC_DIR}`);
console.log(`Target: ${SUPABASE_URL}\n`);

const start = Date.now();
for (const [label, fn] of tasks) {
  process.stdout.write(`  ${label.padEnd(28)} `);
  const t0 = Date.now();
  const count = await fn();
  console.log(`${count.toString().padStart(6)} rows  (${Date.now() - t0}ms)`);
}
console.log(`\nDone in ${((Date.now() - start) / 1000).toFixed(1)}s.`);
