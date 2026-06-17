-- Phase 7: Conan Wiki reference tables
--
-- Public game data — anyone reads, nobody writes (no INSERT/UPDATE/DELETE
-- policies means default deny once RLS is enabled).
--
-- Data is loaded via apps/conan-wiki/scripts/import-conan-data.mjs using
-- the service-role key, which bypasses RLS.

create extension if not exists pg_trgm;

-- ============================================================
-- Reference tables
-- ============================================================

create table conan_items (
  id bigint primary key,
  name text not null,
  type text,
  grade text,
  source text,
  dlc text,
  equip_slot text,
  weapontype text,
  dmg numeric,
  armor_pen numeric,
  armor numeric,
  armortype text,
  durability numeric,
  weight numeric,
  heat_res numeric,
  cold_res numeric,
  is_craftable boolean,
  is_crafting_station boolean,
  knowledge_feat_ids text
);

create index conan_items_name_trgm_idx on conan_items using gin (name gin_trgm_ops);
create index conan_items_type_idx on conan_items (type);
create index conan_items_source_idx on conan_items (source);

create table conan_recipes (
  recipe_id bigint primary key,
  product_name text not null,
  category text,
  player_level integer,
  kp_cost integer,
  feat_required text,
  feat_id_required bigint,
  teaches_feat text,
  journey_reward text
);

create index conan_recipes_product_name_idx on conan_recipes (product_name);

create table conan_recipe_ingredients (
  outcome text primary key,
  outcome_qty integer,
  n_ingredients integer,
  ingredients text
);

create table conan_feats (
  feat text primary key,
  category text,
  min_player_level integer,
  recipes_unlocked integer,
  is_ancestral boolean
);

create table conan_thralls (
  id text primary key,
  name text not null,
  category text,
  profession text,
  race text,
  faction text,
  crafting_spec text,
  capturable boolean
);

create index conan_thralls_profession_idx on conan_thralls (profession);
create index conan_thralls_faction_idx on conan_thralls (faction);

create table conan_creatures (
  id text primary key,
  name text not null,
  hp numeric,
  armor numeric,
  temperament text,
  map text,
  biomes text,
  locations text,
  drops text
);

create table conan_locations (
  name text primary key,
  map text,
  biome text,
  type text,
  faction text,
  unmarked boolean
);

create index conan_locations_faction_idx on conan_locations (faction);
create index conan_locations_biome_idx on conan_locations (biome);

-- ============================================================
-- Relation / join tables
--
-- These use surrogate bigserial PKs since the source CSV rows are
-- not guaranteed unique on (left, right) pairs, and we want to be
-- able to reimport idempotently via truncate-and-insert.
-- ============================================================

create table conan_rel_item_feat (
  id bigserial primary key,
  item_id bigint,
  item_name text,
  feat_id bigint,
  feat_name text
);

create index conan_rel_item_feat_item_id_idx on conan_rel_item_feat (item_id);
create index conan_rel_item_feat_feat_id_idx on conan_rel_item_feat (feat_id);

create table conan_rel_item_recipe (
  id bigserial primary key,
  item_id bigint,
  item_name text,
  recipe_id bigint,
  category text,
  player_level integer,
  kp_cost integer,
  feat_required text,
  feat_id_required bigint
);

create index conan_rel_item_recipe_item_id_idx on conan_rel_item_recipe (item_id);
create index conan_rel_item_recipe_recipe_id_idx on conan_rel_item_recipe (recipe_id);

create table conan_rel_creature_drops (
  id bigserial primary key,
  creature text,
  item_dropped text
);

create index conan_rel_creature_drops_item_dropped_idx on conan_rel_creature_drops (item_dropped);
create index conan_rel_creature_drops_creature_idx on conan_rel_creature_drops (creature);

create table conan_rel_creature_biomes (
  id bigserial primary key,
  creature text,
  biome text
);

create index conan_rel_creature_biomes_creature_idx on conan_rel_creature_biomes (creature);

create table conan_rel_recipe_ingredients (
  id bigserial primary key,
  outcome text,
  ingredient text,
  quantity numeric
);

create index conan_rel_recipe_ingredients_outcome_idx on conan_rel_recipe_ingredients (outcome);
create index conan_rel_recipe_ingredients_ingredient_idx on conan_rel_recipe_ingredients (ingredient);

-- ============================================================
-- RLS: anyone reads, nobody writes
-- ============================================================

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'conan_items',
      'conan_recipes',
      'conan_recipe_ingredients',
      'conan_feats',
      'conan_thralls',
      'conan_creatures',
      'conan_locations',
      'conan_rel_item_feat',
      'conan_rel_item_recipe',
      'conan_rel_creature_drops',
      'conan_rel_creature_biomes',
      'conan_rel_recipe_ingredients'
    ])
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy %I on %I for select to anon, authenticated using (true)',
      t || '_select', t
    );
  end loop;
end$$;
