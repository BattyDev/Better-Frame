-- Seed: Example builds for development/demo purposes
-- All seed data uses a dedicated profile tagged '[SEED]' in display_name
-- To remove: DELETE FROM profiles WHERE display_name = '[SEED] BetterFrame Bot';
-- (cascades to builds via FK)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create a seed user in auth.users (Supabase will auto-create profile via trigger)
--    If the trigger isn't set up yet, we create the profile manually below.

-- Create seed profile directly (uses a fixed UUID so this is idempotent)
INSERT INTO profiles (id, username, display_name, avatar_url, is_premium, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'betterframe_bot',
  '[SEED] BetterFrame Bot',
  null,
  false,
  'user'
) ON CONFLICT (id) DO NOTHING;

-- 2. Warframe builds
-- ─────────────────────────────────────────────────────────────────────────────

-- Saryn Prime — Spore Nuke Build
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags)
VALUES (
  '00000000-0000-0000-0000-seed00000001',
  '00000000-0000-0000-0000-000000000001',
  'Spore Nuke',
  'Max range and strength Saryn for spreading spores across the map. Great for ESO and Steel Path survival.',
  '/Lotus/Powersuits/Saryn/SarynPrime',
  'Warframe',
  '{
    "mods": [
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarHealthMaxMod", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarAbilityStrengthMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarAbilityRangeMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedRangePowerWarframe", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerStrengthPowerDurationWarframe", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert", "rank": 10}
    ],
    "aura": {"uniqueName": "/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod", "rank": 5},
    "exilus": null,
    "arcanes": [
      {"uniqueName": "/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage", "rank": 5}
    ],
    "slotPolarities": ["madurai", "madurai", "naramon", "naramon", null, null, null, null],
    "auraPolarity": "naramon",
    "exilusPolarity": null,
    "formaCount": 4,
    "hasReactor": true,
    "helminthAbility": null
  }'::jsonb,
  true, 42, 1280, '38.5',
  ARRAY['steel-path', 'eso', 'nuke']
);

-- Mesa Prime — Peacemaker DPS
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags)
VALUES (
  '00000000-0000-0000-0000-seed00000002',
  '00000000-0000-0000-0000-000000000001',
  'Peacemaker DPS',
  'High strength Mesa for melting everything with Regulators. Shatter Shield keeps you alive.',
  '/Lotus/Powersuits/Cowgirl/MesaPrime',
  'Warframe',
  '{
    "mods": [
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarHealthMaxMod", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarAbilityStrengthMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarArmourMod", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Nemesis/AvatarSentientArmourMod", "rank": 10}
    ],
    "aura": {"uniqueName": "/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod", "rank": 5},
    "exilus": null,
    "arcanes": [
      {"uniqueName": "/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/CosmeticEnhancers/Defensive/HealthRegenOnDamage", "rank": 5}
    ],
    "slotPolarities": ["madurai", "madurai", "vazarin", "naramon", null, null, null, null],
    "auraPolarity": "naramon",
    "exilusPolarity": null,
    "formaCount": 3,
    "hasReactor": true,
    "helminthAbility": null
  }'::jsonb,
  true, 67, 2150, '38.5',
  ARRAY['dps', 'steel-path', 'endgame']
);

-- Wisp — Haste Mote Support
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags)
VALUES (
  '00000000-0000-0000-0000-seed00000003',
  '00000000-0000-0000-0000-000000000001',
  'Haste Mote Support',
  'Duration and strength focused Wisp for maximum mote buffs. Great team support for any mission type.',
  '/Lotus/Powersuits/Wisp/Wisp',
  'Warframe',
  '{
    "mods": [
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarHealthMaxMod", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarAbilityStrengthMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarAbilityRangeMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod", "rank": 10}
    ],
    "aura": {"uniqueName": "/Lotus/Upgrades/Mods/Aura/PlayerEnergyRegenAuraMod", "rank": 5},
    "exilus": null,
    "arcanes": [
      {"uniqueName": "/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage", "rank": 5}
    ],
    "slotPolarities": ["madurai", "vazarin", "naramon", "naramon", null, null, null, null],
    "auraPolarity": "naramon",
    "exilusPolarity": null,
    "formaCount": 3,
    "hasReactor": true,
    "helminthAbility": null
  }'::jsonb,
  true, 35, 980, '38.5',
  ARRAY['support', 'motes', 'team']
);

-- 3. Primary weapon builds
-- ─────────────────────────────────────────────────────────────────────────────

-- Ignis Wraith — Status Primer
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags)
VALUES (
  '00000000-0000-0000-0000-seed00000004',
  '00000000-0000-0000-0000-000000000001',
  'Corrosive Status Primer',
  'AoE status primer Ignis Wraith. Strips armor with corrosive procs, pairs well with condition overload melee.',
  '/Lotus/Weapons/ClanTech/Chemical/FlameThrowerWraith',
  'Primary',
  '{
    "mods": [
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponFireIterationsMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponToxinDamageMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponElectricityDamageMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponCritChanceMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponCritDamageMod", "rank": 5},
      null
    ],
    "aura": null,
    "exilus": null,
    "arcanes": [null, null],
    "slotPolarities": ["madurai", "madurai", "naramon", null, null, null, null, null],
    "auraPolarity": null,
    "exilusPolarity": null,
    "formaCount": 5,
    "hasReactor": false,
    "hasCatalyst": true,
    "helminthAbility": null
  }'::jsonb,
  true, 28, 750, '38.5',
  ARRAY['status', 'aoe', 'steel-path']
);

-- Soma Prime — Crit Hunter
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags)
VALUES (
  '00000000-0000-0000-0000-seed00000005',
  '00000000-0000-0000-0000-000000000001',
  'Crit Hunter',
  'Classic crit build for the Soma Prime. High sustained DPS with great ammo economy.',
  '/Lotus/Weapons/Tenno/LongGuns/PrimeSoma/PrimeSomaRifle',
  'Primary',
  '{
    "mods": [
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponFireIterationsMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponCritChanceMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponCritDamageMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponToxinDamageMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/WeaponElectricityDamageMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle", "rank": 10},
      null
    ],
    "aura": null,
    "exilus": null,
    "arcanes": [null, null],
    "slotPolarities": ["madurai", "madurai", "madurai", null, null, null, null, null],
    "auraPolarity": null,
    "exilusPolarity": null,
    "formaCount": 4,
    "hasReactor": false,
    "hasCatalyst": true,
    "helminthAbility": null
  }'::jsonb,
  true, 19, 620, '38.5',
  ARRAY['crit', 'dps', 'beginner-friendly']
);

-- 4. Secondary weapon build
-- ─────────────────────────────────────────────────────────────────────────────

-- Pyrana Prime — Crit Status Hybrid
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags)
VALUES (
  '00000000-0000-0000-0000-seed00000006',
  '00000000-0000-0000-0000-000000000001',
  'Phantom Shredder',
  'Crit-status hybrid Pyrana Prime. Kill 3 enemies to summon the phantom for double the firepower.',
  '/Lotus/Weapons/Tenno/Pistols/PrimePyrana/PrimePyranaPistol',
  'Secondary',
  '{
    "mods": [
      {"uniqueName": "/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Pistol/WeaponFireIterationsMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod", "rank": 5},
      null, null, null, null, null
    ],
    "aura": null,
    "exilus": null,
    "arcanes": [null, null],
    "slotPolarities": ["madurai", "madurai", null, null, null, null, null, null],
    "auraPolarity": null,
    "exilusPolarity": null,
    "formaCount": 3,
    "hasReactor": false,
    "hasCatalyst": true,
    "helminthAbility": null
  }'::jsonb,
  true, 15, 430, '38.5',
  ARRAY['crit', 'status', 'hybrid']
);

-- 5. Melee weapon builds
-- ─────────────────────────────────────────────────────────────────────────────

-- Nikana Prime — Blood Rush Combo
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags)
VALUES (
  '00000000-0000-0000-0000-seed00000007',
  '00000000-0000-0000-0000-000000000001',
  'Blood Rush Combo',
  'Combo-scaling crit build for Nikana Prime. Ramps up to red crits at 12x combo. Condition Overload for extra scaling.',
  '/Lotus/Weapons/Tenno/Melee/Swords/PrimeKatana/PrimeNikana',
  'Melee',
  '{
    "mods": [
      {"uniqueName": "/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Melee/WeaponFireRateMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Melee/WeaponMeleeRangeIncMod", "rank": 3},
      null, null, null
    ],
    "aura": null,
    "exilus": null,
    "arcanes": [null, null],
    "slotPolarities": ["madurai", "naramon", "naramon", null, null, null, null, null],
    "auraPolarity": null,
    "exilusPolarity": null,
    "formaCount": 3,
    "hasReactor": false,
    "hasCatalyst": true,
    "helminthAbility": null
  }'::jsonb,
  true, 53, 1840, '38.5',
  ARRAY['combo', 'crit', 'steel-path', 'endgame']
);

-- Orthos Prime — Spin-to-Win
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags)
VALUES (
  '00000000-0000-0000-0000-seed00000008',
  '00000000-0000-0000-0000-000000000001',
  'Spin to Win',
  'Extended range Orthos Prime for clearing rooms. Great for low-to-mid level content and relic farming.',
  '/Lotus/Weapons/Tenno/Melee/Polearms/PrimePolearmWeapon',
  'Melee',
  '{
    "mods": [
      {"uniqueName": "/Lotus/Upgrades/Mods/Melee/WeaponMeleeDamageMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Melee/WeaponFireRateMod", "rank": 5},
      {"uniqueName": "/Lotus/Upgrades/Mods/Melee/WeaponMeleeRangeIncMod", "rank": 3},
      {"uniqueName": "/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod", "rank": 10},
      {"uniqueName": "/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive", "rank": 5},
      null, null, null
    ],
    "aura": null,
    "exilus": null,
    "arcanes": [null, null],
    "slotPolarities": ["madurai", "naramon", null, null, null, null, null, null],
    "auraPolarity": null,
    "exilusPolarity": null,
    "formaCount": 2,
    "hasReactor": false,
    "hasCatalyst": true,
    "helminthAbility": null
  }'::jsonb,
  true, 22, 890, '38.5',
  ARRAY['range', 'aoe', 'farming']
);

-- ─────────────────────────────────────────────────────────────────────────────
-- CLEANUP INSTRUCTIONS:
-- To remove ALL seed data, run:
--   DELETE FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001';
-- This cascades to all builds owned by the seed user.
-- ─────────────────────────────────────────────────────────────────────────────
