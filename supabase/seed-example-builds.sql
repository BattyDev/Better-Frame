-- Seed: Example builds and loadouts for development/demo purposes
-- All seed data uses profiles with 'seed_' username prefix and '5eed' in UUIDs
-- ─────────────────────────────────────────────────────────────────────────────
-- CLEANUP: DELETE FROM profiles WHERE id IN (
--   '00000000-0000-0000-0000-000000000001',
--   '00000000-0000-0000-0000-000000000002',
--   '00000000-0000-0000-0000-000000000003'
-- );
-- This cascades to all builds and loadouts via FK.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED PROFILES
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO profiles (id, username, is_premium, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'seed_betterframe_bot', false, 'user'),
  ('00000000-0000-0000-0000-000000000002', 'seed_void_trader', true, 'user'),
  ('00000000-0000-0000-0000-000000000003', 'seed_steel_essence', false, 'user')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════
-- WARFRAME BUILDS (20)
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Saryn Prime — Spore Nuke
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000001', '00000000-0000-0000-0000-000000000001',
  'Spore Nuke', 'Max range and strength Saryn for spreading spores across the map. Great for ESO and Steel Path survival.',
  '/Lotus/Powersuits/Saryn/SarynPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedRangePowerWarframe","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerStrengthPowerDurationWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5}],"slotPolarities":["madurai","madurai","naramon","naramon","madurai",null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 142, 4280, '38.5', ARRAY['steel-path','eso','nuke']
);

-- 2. Mesa Prime — Peacemaker DPS
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000002', '00000000-0000-0000-0000-000000000001',
  'Peacemaker DPS', 'High strength Mesa for melting everything with Regulators. Shatter Shield keeps you alive.',
  '/Lotus/Powersuits/Cowgirl/MesaPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarArmourMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Nemesis/AvatarSentientArmourMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/HealthRegenOnDamage","rank":5}],"slotPolarities":["madurai","madurai","vazarin","naramon","madurai",null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":4,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 267, 8150, '38.5', ARRAY['dps','steel-path','endgame']
);

-- 3. Wisp — Haste Mote Support
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000003', '00000000-0000-0000-0000-000000000002',
  'Haste Mote Support', 'Duration and strength focused Wisp for maximum mote buffs. Great team support for any mission type.',
  '/Lotus/Powersuits/Wisp/Wisp', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/PlayerEnergyRegenAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5}],"slotPolarities":["madurai","vazarin","naramon","naramon","madurai",null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":4,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 135, 3980, '38.5', ARRAY['support','motes','team']
);

-- 4. Rhino Prime — Iron Skin Tank
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000004', '00000000-0000-0000-0000-000000000002',
  'Iron Skin Tank', 'Unkillable Rhino with massive Iron Skin HP. Roar buffs the whole team. The ultimate beginner frame.',
  '/Lotus/Powersuits/Rhino/RhinoPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModB","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Nemesis/AvatarSentientArmourMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/PlayerMeleeAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/HealthRegenOnDamage","rank":5}],"slotPolarities":["madurai","madurai","madurai","naramon","vazarin",null,null,null],"auraPolarity":"madurai","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 198, 6720, '38.5', ARRAY['tank','beginner-friendly','roar','support']
);

-- 5. Volt Prime — Speed Nova Eidolon
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000005', '00000000-0000-0000-0000-000000000003',
  'Eidolon Shield Breaker', 'Volt built for Eidolon hunts. Max strength for shields, speed for repositioning.',
  '/Lotus/Powersuits/Volt/VoltPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerStrengthPowerDurationWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarCastingSpeedMod","rank":3}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/FairyQuest/FairyQuestCritToAbilityAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/MagneticProcResist","rank":5}],"slotPolarities":["madurai","madurai","naramon","naramon","vazarin",null,null,null],"auraPolarity":"madurai","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 89, 2940, '38.5', ARRAY['eidolon','shields','speed']
);

-- 6. Nekros Prime — Desecrate Farmer
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000006', '00000000-0000-0000-0000-000000000003',
  'Desecrate Farmer', 'Max range Nekros for resource farming. Equilibrium keeps energy topped off from all the health orbs.',
  '/Lotus/Powersuits/Necro/NekrosPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarHealthMaxMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedRangePowerWarframe","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarPickupBonusMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarArmourMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Nemesis/AvatarSentientArmourMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/PlayerEnemyRadarAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5}],"slotPolarities":["naramon","naramon","madurai","vazarin",null,null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":4,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 156, 5130, '38.5', ARRAY['farming','desecrate','resources','survival']
);

-- 7. Nova Prime — Molecular Prime CC
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000007', '00000000-0000-0000-0000-000000000001',
  'Slow Nova', 'Maximum duration Molecular Prime for slowing enemies to a crawl. Essential for defense and mobile defense.',
  '/Lotus/Powersuits/AntiMatter/NovaPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerStrengthPowerDurationWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Augur/WarframeAugurMessageMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5}],"slotPolarities":["madurai","naramon","naramon","madurai","vazarin",null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 112, 3670, '38.5', ARRAY['cc','slow','defense','mobile-defense']
);

-- 8. Octavia Prime — Infinite Scaling
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000008', '00000000-0000-0000-0000-000000000002',
  'Infinite Scaling AFK', 'Duration-focused Octavia that scales infinitely. Mallet does all the work, you just crouch for invis.',
  '/Lotus/Powersuits/Bard/OctaviaPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarHealthMaxMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Augur/WarframeAugurSecretsMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Augur/WarframeAugurReachMod","rank":5}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/HealthRegenOnDamage","rank":5}],"slotPolarities":["naramon","naramon","madurai","madurai",null,null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":4,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 203, 7210, '38.5', ARRAY['infinite-scaling','afk','mallet','survival']
);

-- 9. Ivara Prime — Spy Stealth
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000009', '00000000-0000-0000-0000-000000000003',
  'Stealth Spy Queen', 'Permanent prowl Ivara with max efficiency. Walk through any spy vault undetected.',
  '/Lotus/Powersuits/Ranger/IvaraPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarHealthMaxMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedEfficiencyDurationWarframe","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Sets/Hunter/WarframeHunterAdrenalineMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/PlayerEnemyRadarAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5}],"slotPolarities":["naramon","naramon","vazarin","madurai",null,null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":3,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 78, 2540, '38.5', ARRAY['spy','stealth','prowl','solo']
);

-- 10. Wukong Prime — Celestial Twin
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000010', '00000000-0000-0000-0000-000000000001',
  'Celestial Twin Nuker', 'Let your twin do all the killing. High strength and duration for a powerful clone.',
  '/Lotus/Powersuits/MonkeyKing/WukongPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Nemesis/AvatarSentientArmourMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/CritChanceOnDamage","rank":5}],"slotPolarities":["madurai","madurai","naramon","naramon","vazarin",null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 94, 3120, '38.5', ARRAY['twin','dps','lazy','survival']
);

-- 11. Khora Prime — Strangledome CC
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000011', '00000000-0000-0000-0000-000000000002',
  'Strangledome Lockdown', 'Max range Khora for locking down entire tiles. Whipclaw hits everything in the dome.',
  '/Lotus/Powersuits/Khora/KhoraPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedRangePowerWarframe","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5}],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":4,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 121, 4050, '38.5', ARRAY['cc','strangledome','defense','interception']
);

-- 12. Garuda Prime — Blood Altar Tank
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000012', '00000000-0000-0000-0000-000000000003',
  'Blood Queen', 'Strength-focused Garuda for massive Seeking Talons damage. Blood Altar for sustain.',
  '/Lotus/Powersuits/Garuda/GarudaPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerStrengthPowerDurationWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarDamageToEnergyModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/FairyQuest/FairyQuestCritToAbilityAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/HealthRegenOnDamage","rank":5}],"slotPolarities":["madurai","madurai","naramon","vazarin",null,null,null,null],"auraPolarity":"madurai","exilusPolarity":null,"formaCount":4,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 67, 2180, '38.5', ARRAY['dps','slash','blood','steel-path']
);

-- 13. Revenant Prime — Mesmer Skin Immortal
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000013', '00000000-0000-0000-0000-000000000001',
  'Mesmer Immortal', 'Truly immortal Revenant. Mesmer Skin charges never run out with this strength build. Reave to refresh.',
  '/Lotus/Powersuits/Revenant/RevenantPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerStrengthPowerDurationWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarCastingSpeedMod","rank":3}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/FairyQuest/FairyQuestCritToAbilityAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5}],"slotPolarities":["madurai","madurai","naramon","naramon","vazarin",null,null,null],"auraPolarity":"madurai","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 176, 5890, '38.5', ARRAY['immortal','mesmer','tank','steel-path']
);

-- 14. Nidus Prime — Mutation Stacker
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000014', '00000000-0000-0000-0000-000000000002',
  'Mutation Stacker', 'Range and duration Nidus for grouping enemies with Larva and stacking mutations fast.',
  '/Lotus/Powersuits/Infestation/InfestationPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedRangePowerWarframe","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Nemesis/AvatarSentientArmourMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/HealthRegenOnDamage","rank":5}],"slotPolarities":["madurai","madurai","naramon","naramon","vazarin",null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 88, 2980, '38.5', ARRAY['mutation','larva','tank','survival']
);

-- 15. Harrow Prime — Covenant Support
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000015', '00000000-0000-0000-0000-000000000003',
  'Covenant Crit Support', 'Duration and strength Harrow for massive Covenant crit buffs. Thurible keeps the team energized.',
  '/Lotus/Powersuits/Priest/HarrowPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerStrengthPowerDurationWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/FairyQuest/FairyQuestCritToAbilityAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/CritChanceOnDamage","rank":5}],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":"madurai","exilusPolarity":null,"formaCount":4,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 64, 2070, '38.5', ARRAY['support','crit','covenant','team']
);

-- 16. Baruuk Prime — Desert Wind
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000016', '00000000-0000-0000-0000-000000000001',
  'Desert Wind Blitz', 'Max strength Baruuk for devastating Desert Wind waves. Restraint drains fast with Desolate Hands.',
  '/Lotus/Powersuits/Pacifist/BaruukPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerStrengthPowerDurationWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Nemesis/AvatarSentientArmourMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/PlayerMeleeAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Offensive/MeleeSpeedOnHit","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Offensive/GolemArcaneMeleeDamageOnCrit","rank":5}],"slotPolarities":["madurai","madurai","naramon","naramon","vazarin",null,null,null],"auraPolarity":"madurai","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 103, 3450, '38.5', ARRAY['exalted','desert-wind','melee','dps']
);

-- 17. Gara Prime — Splinter Storm
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000017', '00000000-0000-0000-0000-000000000002',
  'Splinter Storm Nuke', 'Infinite scaling Splinter Storm. Shatter your wall to stack damage, rinse and repeat.',
  '/Lotus/Powersuits/Glass/GaraPrime', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Nemesis/AvatarSentientArmourMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/PlayerMeleeAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5}],"slotPolarities":["madurai","madurai","naramon","naramon","vazarin",null,null,null],"auraPolarity":"madurai","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 91, 3010, '38.5', ARRAY['infinite-scaling','splinter-storm','defense','solo']
);

-- 18. Protea — Turret Engineer
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000018', '00000000-0000-0000-0000-000000000003',
  'Turret Engineer', 'Duration and strength Protea for devastating Blaze Artillery. Dispensary keeps the team supplied.',
  '/Lotus/Powersuits/Odalisk/Odalisk', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarHealthMaxMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedPowerEfficiencyWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5}],"slotPolarities":["madurai","naramon","naramon","vazarin",null,null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":3,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 72, 2350, '38.5', ARRAY['turret','dispensary','defense','support']
);

-- 19. Lavos — Elemental Alchemist
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000019', '00000000-0000-0000-0000-000000000001',
  'Elemental Alchemist', 'Duration and strength Lavos. No energy costs — just cooldowns. Mix elements on the fly.',
  '/Lotus/Powersuits/Alchemist/Alchemist', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModB","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModC","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Nemesis/AvatarSentientArmourMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/PlayerMeleeAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/HealthRegenOnDamage","rank":5}],"slotPolarities":["madurai","madurai","madurai","naramon","naramon",null,null,null],"auraPolarity":"madurai","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 58, 1890, '38.5', ARRAY['elements','tank','no-energy','unique']
);

-- 20. Xaku — Void Damage
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed10000020', '00000000-0000-0000-0000-000000000002',
  'The Lost Void', 'Max duration Xaku for permanent Vast Untime. Stolen weapons shred everything.',
  '/Lotus/Powersuits/BrokenFrame/BrokenFrame', 'Warframe',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarHealthMaxMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedDurationRangeWarframe","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityRangeModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/DualStat/CorruptedRangePowerWarframe","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarAbilityEfficiencyMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Warframe/AvatarInvulnOnRollMod","rank":10}],"aura":{"uniqueName":"/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod","rank":5},"exilus":null,"arcanes":[{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Utility/GolemArcaneRadialEnergyOnEnergyPickup","rank":5},{"uniqueName":"/Lotus/Upgrades/CosmeticEnhancers/Defensive/ArmourOnDamage","rank":5}],"slotPolarities":["naramon","naramon","naramon","madurai","vazarin",null,null,null],"auraPolarity":"naramon","exilusPolarity":null,"formaCount":5,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 83, 2740, '38.5', ARRAY['void','duration','vast-untime','steel-path']
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PRIMARY BUILDS (20)
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Ignis Wraith — Corrosive Status
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000001', '00000000-0000-0000-0000-000000000001',
  'Corrosive Status Primer', 'AoE status primer. Strips armor with corrosive procs, pairs well with Condition Overload melee.',
  '/Lotus/Weapons/ClanTech/Chemical/FlameThrowerWraith', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/PoisonEventRifleMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/ElectEventRifleMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 128, 4250, '38.5', ARRAY['status','aoe','steel-path']
);

-- 2. Soma Prime — Crit Hunter
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000002', '00000000-0000-0000-0000-000000000001',
  'Crit Hunter', 'Classic crit build. High sustained DPS with great ammo economy and Hunter Munitions for slash procs.',
  '/Lotus/Weapons/Tenno/LongGuns/PrimeSoma/PrimeSomaRifle', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","madurai","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 89, 2920, '38.5', ARRAY['crit','dps','beginner-friendly']
);

-- 3. Acceltra Prime — Rocket Barrage
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000003', '00000000-0000-0000-0000-000000000002',
  'Rocket Barrage', 'Explosive crit build for Acceltra Prime. Incredible AoE clear with Hunter Munitions slash procs.',
  '/Lotus/Weapons/Tenno/LongGuns/PrimeAcceltra/PrimeAcceltraWeapon', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Vigilante/PrimaryVigilanteArmamentsMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 156, 5120, '38.5', ARRAY['aoe','crit','explosive','endgame']
);

-- 4. Tigris Prime — Slash Shotgun
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000004', '00000000-0000-0000-0000-000000000003',
  'One-Shot Slash', 'Pure slash Tigris Prime. One shot kills on most enemies with viral+slash procs.',
  '/Lotus/Weapons/Tenno/LongGuns/PrimeTigris/PrimeTigris', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFreezeDamageMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10},null],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 45, 1480, '38.5', ARRAY['slash','one-shot','shotgun']
);

-- 5. Rubico Prime — Eidolon Sniper
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000005', '00000000-0000-0000-0000-000000000003',
  'Eidolon One-Tap', 'Max crit Rubico Prime for one-tapping Eidolon limbs. The gold standard for hunts.',
  '/Lotus/Weapons/Tenno/LongGuns/RubicoPrime/RubicoPrimeWeapon', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Event/CritDamageWhileAimingRifleMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Event/CritChanceWhileAimingRifleMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","madurai","naramon","naramon",null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 210, 7890, '38.5', ARRAY['eidolon','sniper','crit','one-tap']
);

-- 6. Kuva Bramma — Nuke Bow
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000006', '00000000-0000-0000-0000-000000000001',
  'Cluster Bomb Nuke', 'Massive AoE Kuva Bramma. Hunter Munitions for slash procs on the cluster explosions.',
  '/Lotus/Weapons/Grineer/Bows/GrnBow/GrnBowWeapon', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFreezeDamageMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Vigilante/PrimaryVigilanteArmamentsMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon","madurai",null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 187, 6230, '38.5', ARRAY['aoe','nuke','bow','kuva']
);

-- 7. Tenet Arca Plasmor — Radiation Nuke
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000007', '00000000-0000-0000-0000-000000000002',
  'Radiation Wall', 'Tenet Arca Plasmor with galvanized mods. Each kill makes the next shot stronger.',
  '/Lotus/Weapons/Corpus/BoardExec/Primary/CrpBEArcaPlasmor/CrpBEArcaPlasmor', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFireIterationsSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon","madurai",null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 98, 3240, '38.5', ARRAY['galvanized','shotgun','tenet','radiation']
);

-- 8. Nataruk — Void Bow
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000008', '00000000-0000-0000-0000-000000000002',
  'Perfect Shot', 'Max crit Nataruk with perfect shot bonus. The best free weapon in the game.',
  '/Lotus/Weapons/Tenno/Bows/Omicrus/OmicrusPlayerWep', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFreezeDamageMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 234, 8760, '38.5', ARRAY['bow','crit','free','new-war']
);

-- 9. Cedo — Glaive Shotgun
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000009', '00000000-0000-0000-0000-000000000003',
  'Glaive Primer', 'Alt-fire glaive applies all 4 status types. Primary fire benefits from Galvanized Aptitude stacking.',
  '/Lotus/Weapons/Tenno/LongGuns/TnAlchemistShotgun/TnAlchemistShotgun', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFireIterationsSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/PoisonEventRifleMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/ElectEventRifleMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 76, 2510, '38.5', ARRAY['shotgun','status','galvanized','primer']
);

-- 10. Kuva Zarr — Bombardment
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000010', '00000000-0000-0000-0000-000000000001',
  'Carpet Bomber', 'Kuva Zarr cannon mode for maximum devastation. Barrage mode for single targets.',
  '/Lotus/Weapons/Grineer/KuvaLich/LongGuns/Zarr/KuvaZarr', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFireIterationsSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFreezeDamageMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","madurai","naramon","naramon",null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 173, 5780, '38.5', ARRAY['aoe','kuva','explosive','nuke']
);

-- 11. Corinth Prime — Airburst
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000011', '00000000-0000-0000-0000-000000000002',
  'Airburst Crit', 'Satisfying slug primary fire with airburst alt-fire for groups. Classic shotgun feel.',
  '/Lotus/Weapons/Tenno/LongGuns/PrimeCorinth/PrimeCorinth', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 62, 2050, '38.5', ARRAY['shotgun','crit','airburst']
);

-- 12. Fulmin — Silent Lightning
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000012', '00000000-0000-0000-0000-000000000003',
  'Silent Lightning', 'Silent auto mode for stealth, shotgun mode for burst. Infinite ammo with regenerating battery.',
  '/Lotus/Weapons/Tenno/LongGuns/TnWispRifle/TnWispRifle', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFreezeDamageMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 54, 1780, '38.5', ARRAY['silent','stealth','hybrid','wisp']
);

-- 13. Phantasma — Beam Shotgun
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000013', '00000000-0000-0000-0000-000000000001',
  'Radiation Beam', 'Continuous beam shotgun with radiation damage. Alt-fire homing projectiles for CC.',
  '/Lotus/Weapons/Tenno/LongGuns/RevenantShotgun/RevenantShotgun', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/PoisonEventRifleMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/ElectEventRifleMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/FireEventRifleMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/IceEventRifleMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 41, 1340, '38.5', ARRAY['beam','status','radiation','shotgun']
);

-- 14. Stahlta — Charged Shot
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000014', '00000000-0000-0000-0000-000000000002',
  'Charged Devastation', 'Alt-fire charged shot for massive single-target damage. Primary fire for general use.',
  '/Lotus/Weapons/Corpus/LongGuns/CrpRubanRifle/CrpRubanRifle', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 37, 1210, '38.5', ARRAY['charged','hybrid','corpus']
);

-- 15. Phenmor — Incarnon Rifle
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000015', '00000000-0000-0000-0000-000000000003',
  'Incarnon Evolved', 'Get headshots to evolve into a devastating incarnon form. Galvanized mods for stacking damage.',
  '/Lotus/Weapons/Tenno/Zariman/LongGuns/SemiAutoRifle/ZarimanSemiAutoRifle', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFireIterationsSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFreezeDamageMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon","madurai",null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 145, 4870, '38.5', ARRAY['incarnon','zariman','evolving','endgame']
);

-- 16. Bubonico — Infested Arm Cannon
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000016', '00000000-0000-0000-0000-000000000001',
  'Toxic Burst', 'Infinite ammo arm cannon. Alt-fire grenade burst for AoE status spreading.',
  '/Lotus/Weapons/Infested/LongGuns/InfArmCannon/InfArmCannon', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/PoisonEventRifleMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/ElectEventRifleMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 69, 2280, '38.5', ARRAY['infested','infinite-ammo','status','aoe']
);

-- 17. Trumna — Entrati Rifle
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000017', '00000000-0000-0000-0000-000000000002',
  'Necramech Killer', 'Heavy hitting Trumna with devastating alt-fire. Charges from kills for a homing grenade.',
  '/Lotus/Weapons/Thanotech/ThanoRifle/ThanotechRifle', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon","madurai",null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 48, 1590, '38.5', ARRAY['entrati','deimos','heavy','alt-fire']
);

-- 18. Felarx — Incarnon Shotgun
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000018', '00000000-0000-0000-0000-000000000003',
  'Incarnon Slug', 'Headshots transform into incarnon mode. Devastating slug damage per shot.',
  '/Lotus/Weapons/Tenno/Zariman/LongGuns/PumpShotgun/ZarimanPumpShotgun', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFireIterationsSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 82, 2710, '38.5', ARRAY['incarnon','zariman','shotgun','slug']
);

-- 19. Stradavar Prime — Dual-Mode
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000019', '00000000-0000-0000-0000-000000000001',
  'Auto-Semi Hybrid', 'Switch between full-auto for crowds and semi-auto for heavy targets. Versatile all-rounder.',
  '/Lotus/Weapons/Tenno/LongGuns/PrimeStradavar/PrimeStradavarGun', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponFreezeDamageMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Sets/Hunter/PrimaryHunterMunitionsMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 31, 1020, '38.5', ARRAY['hybrid','versatile','dual-mode']
);

-- 20. Kuva Chakkhurr — Lich Musket
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed20000020', '00000000-0000-0000-0000-000000000002',
  'Grineer Musket', 'Massive single-shot damage with guaranteed impact proc. Headshots delete anything.',
  '/Lotus/Weapons/Grineer/LongGuns/GrnKuvaLichRifle/GrnKuvaLichRifleWeapon', 'Primary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Expert/WeaponFireDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/Event/CritDamageWhileAimingRifleMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Rifle/DualStat/CorruptedDamageRecoilRifle","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","madurai","naramon","naramon",null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 56, 1850, '38.5', ARRAY['kuva','sniper','single-shot','headshot']
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SECONDARY BUILDS (20)
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Pyrana Prime
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000001', '00000000-0000-0000-0000-000000000001',
  'Phantom Shredder', 'Kill 3 to summon the phantom for double firepower. High crit shotgun pistol.',
  '/Lotus/Weapons/Tenno/Pistols/PrimePyrana/PrimePyranaPistol', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponCritChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 115, 3820, '38.5', ARRAY['crit','phantom','shotgun-pistol']
);

-- 2. Kuva Nukor — Beam Primer
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000002', '00000000-0000-0000-0000-000000000001',
  'Status Primer', 'The ultimate CO primer. Chains to nearby enemies applying viral, heat, and radiation.',
  '/Lotus/Weapons/Grineer/KuvaLich/Secondaries/Nukor/KuvaNukor', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponFireIterationsSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/PoisonEventPistolMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/ElectEventPistolMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/FireEventPistolMod","rank":3}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 245, 9120, '38.5', ARRAY['primer','status','beam','kuva','meta']
);

-- 3. Epitaph — Charged Primer
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000003', '00000000-0000-0000-0000-000000000002',
  'Cold Snap', 'Charged shot for guaranteed cold procs. Uncharged for rapid fire. Great status primer.',
  '/Lotus/Weapons/Tenno/Pistols/TnWraitheSidearm/TnWraitheSidearmWeapon', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponCritChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 73, 2410, '38.5', ARRAY['primer','cold','sevagoth','charged']
);

-- 4. Laetum — Incarnon Pistol
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000004', '00000000-0000-0000-0000-000000000003',
  'Incarnon Destroyer', 'Headshots to evolve. Incarnon form has insane crit and fire rate. Top tier secondary.',
  '/Lotus/Weapons/Tenno/Zariman/Pistols/HeavyPistol/ZarimanHeavyPistol', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponFireIterationsSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponCritChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon","madurai",null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 198, 6650, '38.5', ARRAY['incarnon','zariman','meta','crit']
);

-- 5. Tenet Cycron — Beam
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000005', '00000000-0000-0000-0000-000000000003',
  'Infinite Beam', 'Regenerating ammo beam pistol. Stack status effects infinitely on targets.',
  '/Lotus/Weapons/Corpus/BoardExec/Secondary/CrpBECycron/CrpBECycron', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/PoisonEventPistolMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/ElectEventPistolMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 67, 2210, '38.5', ARRAY['beam','tenet','infinite-ammo','status']
);

-- 6. Atomos — Budget Beam
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000006', '00000000-0000-0000-0000-000000000002',
  'Chain Lightning', 'Chains to nearby enemies. Great budget beam secondary for star chart clear.',
  '/Lotus/Weapons/Grineer/Pistols/HeatGun/GrnHeatGun', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10},null],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai",null,null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":2,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 42, 1380, '38.5', ARRAY['beam','chain','budget','beginner-friendly']
);

-- 7. Akstiletto Prime
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000007', '00000000-0000-0000-0000-000000000001',
  'Bullet Hose', 'Fast-firing dual pistols. Viral and heat for armor stripping.',
  '/Lotus/Weapons/Tenno/Pistols/PrimeAkstiletto/PrimeAkstiletto', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponCritChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 38, 1250, '38.5', ARRAY['dual','fast','viral']
);

-- 8. Knell Prime
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000008', '00000000-0000-0000-0000-000000000003',
  'Headshot Machine', 'One bullet mag — headshot to reload and gain infinite ammo mode. Pure skill pistol.',
  '/Lotus/Weapons/Tenno/Pistols/PrimeKnell/PrimeKnellWeapon', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritChanceModBeginnerExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/PrimedWeaponCritDamageMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Event/CritChanceWhileAimingPistolMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 56, 1850, '38.5', ARRAY['headshot','skill','crit','single-shot']
);

-- 9. Aksomati Prime
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000009', '00000000-0000-0000-0000-000000000002',
  'Crit Storm', 'Extremely high crit dual pistols. Spray and watch the orange crits fly.',
  '/Lotus/Weapons/Tenno/Pistols/PrimeAksomati/PrimeAksomati', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritChanceModBeginnerExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/PrimedWeaponCritDamageMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 44, 1450, '38.5', ARRAY['crit','dual','spray']
);

-- 10. Euphona Prime
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000010', '00000000-0000-0000-0000-000000000001',
  'Slug Cannon', 'Alt-fire slug mode for massive single-target damage. Primary buckshot for groups.',
  '/Lotus/Weapons/Tenno/Pistols/AllNew1hSG/AllNew1hSG', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritChanceModBeginnerExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/PrimedWeaponCritDamageMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","madurai","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 51, 1680, '38.5', ARRAY['slug','shotgun-pistol','crit']
);

-- 11. Catabolyst
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000011', '00000000-0000-0000-0000-000000000002',
  'Acid Beam', 'Reload to throw the gun as a grenade. Corrosive beam strips armor while you hold it.',
  '/Lotus/Weapons/Infested/Pistols/InfBeamPistol/InfBeamPistol', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/PoisonEventPistolMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/ElectEventPistolMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10},null],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai",null,null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 29, 950, '38.5', ARRAY['beam','infested','grenade','unique']
);

-- 12. Tenet Diplos
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000012', '00000000-0000-0000-0000-000000000003',
  'Homing Burst', 'ADS for homing bullets that track enemies. Hip-fire full auto for close range.',
  '/Lotus/Weapons/Corpus/Pistols/CrpBriefcaseAkimbo/CrpBriefcaseAkimboPistol', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponCritChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 47, 1550, '38.5', ARRAY['homing','tenet','dual','corpus']
);

-- 13. Akjagara Prime
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000013', '00000000-0000-0000-0000-000000000001',
  'Slash Spammer', 'High slash weighting dual pistols. Viral + slash procs melt high-level enemies.',
  '/Lotus/Weapons/Tenno/Pistols/PrimeAkjagara/AkJagaraPrime', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponCritChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 53, 1740, '38.5', ARRAY['slash','viral','dual','status']
);

-- 14. Staticor
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000014', '00000000-0000-0000-0000-000000000002',
  'Charged Explosion', 'Charge up for massive AoE energy blasts. Great for hallway clearing.',
  '/Lotus/Weapons/Corpus/Pistols/CrpElectroMag/CrpElectroMag', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10},null],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 35, 1150, '38.5', ARRAY['aoe','charged','energy','corpus']
);

-- 15. Kuva Twin Stubbas
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000015', '00000000-0000-0000-0000-000000000003',
  'Bullet Storm', 'Extremely high fire rate dual SMGs. Viral slash with raw DPS.',
  '/Lotus/Weapons/Grineer/KuvaLich/Secondaries/Stubba/KuvaStubba', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponCritChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon","madurai",null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":5,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 61, 2010, '38.5', ARRAY['kuva','smg','fire-rate','dual']
);

-- 16. Hystrix Prime
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000016', '00000000-0000-0000-0000-000000000001',
  'Element Switcher', 'Cycle between all 4 elements on the fly. Adapt to any faction mid-mission.',
  '/Lotus/Weapons/Tenno/Pistols/PrimeHystrix/PrimeHystrixWeapon', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponCritChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponElectricityDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 33, 1090, '38.5', ARRAY['element','versatile','adaptive']
);

-- 17. Sepulcrum
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000017', '00000000-0000-0000-0000-000000000002',
  'Entrati Pistol', 'Alt-fire homing rockets after enough kills. Primary burst fire with high status.',
  '/Lotus/Weapons/Thanotech/ThanoPistol/ThanotechPistol', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponCritChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 27, 890, '38.5', ARRAY['entrati','deimos','homing','alt-fire']
);

-- 18. Zymos
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000018', '00000000-0000-0000-0000-000000000003',
  'Spore Spreader', 'Headshot kills create homing spore projectiles. Viral spread machine.',
  '/Lotus/Weapons/Infested/Pistols/InfUzi/InfUziWeapon', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponStatusChanceSPMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/PoisonEventPistolMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/IceEventPistolMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10},null],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai",null,null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 24, 790, '38.5', ARRAY['infested','spore','headshot','viral']
);

-- 19. Athodai
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000019', '00000000-0000-0000-0000-000000000001',
  'Jet Turbine', 'Alt-fire to supercharge fire rate. Crit pistol that rewards aggressive play.',
  '/Lotus/Weapons/Tenno/Pistols/TnJetTurbine/TnJetTurbinePistolWeapon', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritChanceModBeginnerExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/PrimedWeaponCritDamageMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 39, 1280, '38.5', ARRAY['crit','alt-fire','fire-rate']
);

-- 20. Dual Toxocyst
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed30000020', '00000000-0000-0000-0000-000000000002',
  'Frenzy Mode', 'Headshots trigger frenzy — full auto with massive fire rate boost. High risk, high reward.',
  '/Lotus/Weapons/Infested/Pistols/InfVomitGun/InfVomitGunWep', 'Secondary',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponDamageAmountMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireIterationsModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/DualStat/GrinderMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/WeaponCritChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponToxinDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Pistol/Expert/WeaponFireDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 22, 720, '38.5', ARRAY['infested','frenzy','headshot','unique']
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- MELEE BUILDS (20)
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Nikana Prime — Blood Rush
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000001', '00000000-0000-0000-0000-000000000001',
  'Blood Rush Combo', 'Combo-scaling crit build. Ramps up to red crits at 12x combo with Condition Overload.',
  '/Lotus/Weapons/Tenno/Melee/Swords/PrimeKatana/PrimeNikana', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFireRateModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/ElectEventMeleeMod","rank":3}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon","madurai",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 153, 5140, '38.5', ARRAY['combo','crit','steel-path','endgame']
);

-- 2. Gram Prime — Heavy Attack
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000002', '00000000-0000-0000-0000-000000000001',
  'Heavy Slam', 'Heavy attack build for one-shotting with massive slash procs. No combo needed.',
  '/Lotus/Weapons/Tenno/Melee/Swords/PrimeGram/PrimeGram', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Channel/ChannelVampireMod","rank":3}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 87, 2890, '38.5', ARRAY['heavy-attack','slash','one-shot']
);

-- 3. Orthos Prime — Range Clear
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000003', '00000000-0000-0000-0000-000000000002',
  'Room Clearer', 'Extended range polearm for clearing entire rooms. Great for relic farming.',
  '/Lotus/Weapons/Tenno/Melee/Polearms/PrimePolearmWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFireRateModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/IceEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 122, 4080, '38.5', ARRAY['range','polearm','farming','aoe']
);

-- 4. Kronen Prime — Tonfas
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000004', '00000000-0000-0000-0000-000000000003',
  'Sovereign Outcast', 'Fast tonfas with incredible forced slash procs. Meta melee for Steel Path.',
  '/Lotus/Weapons/Tenno/Melee/Tonfa/TonfaContestWinnerPrime/TonfaContestWinnerPrimeWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritFireRateBonusModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon","madurai",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 178, 5960, '38.5', ARRAY['tonfas','slash','meta','steel-path']
);

-- 5. Glaive Prime — Throw Build
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000005', '00000000-0000-0000-0000-000000000003',
  'Detonation Throw', 'Heavy attack throw for massive AoE explosions. Forced slash procs on detonation.',
  '/Lotus/Weapons/Tenno/Melee/Glaives/PrimeGlaive/PrimeGlaiveWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Channel/ChannelVampireMod","rank":3}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 201, 6720, '38.5', ARRAY['glaive','throw','heavy-attack','aoe']
);

-- 6. Stropha — Gunblade
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000006', '00000000-0000-0000-0000-000000000002',
  'Heavy Attack Nuke', 'Heavy attack gunblade for massive AoE damage. Great for Profit-Taker legs.',
  '/Lotus/Weapons/Corpus/Melee/Gunblade/CrpGunBlade/CrpGunbladeWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponElectricityDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponToxinDamageMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Sets/Gladiator/MeleeGladiatorMightMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 94, 3130, '38.5', ARRAY['gunblade','heavy-attack','profit-taker']
);

-- 7. Lesion — Status Polearm
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000007', '00000000-0000-0000-0000-000000000001',
  'Toxic Growth', 'Innate toxin bonus on status proc. Stacks with Condition Overload for massive scaling.',
  '/Lotus/Weapons/Infested/Melee/TipedoStaff/InfTipedoStaff', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFireRateModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/ElectEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/ComboTimeStatusChanceMod","rank":3}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 66, 2180, '38.5', ARRAY['status','polearm','infested','scaling']
);

-- 8. Venka Prime — Claws
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000008', '00000000-0000-0000-0000-000000000002',
  'Crit Claws', 'Highest combo multiplier in the game (13x). Blood Rush reaches insane values.',
  '/Lotus/Weapons/Tenno/Melee/PrimeVenKa/PrimeVenkaClaws', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritFireRateBonusModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/ComboTimeStatusChanceMod","rank":3}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon","madurai",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 71, 2350, '38.5', ARRAY['claws','combo','crit','13x-multiplier']
);

-- 9. Reaper Prime — Scythe
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000009', '00000000-0000-0000-0000-000000000003',
  'Grim Harvest', 'Heavy slash scythe with devastating forced slash procs. Heavy attack for big hits.',
  '/Lotus/Weapons/Tenno/Melee/Scythe/ReaperWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFireRateModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 43, 1420, '38.5', ARRAY['scythe','slash','heavy-attack']
);

-- 10. Nami Skyla Prime — Dual Swords
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000010', '00000000-0000-0000-0000-000000000001',
  'Swashbuckler', 'Fast dual swords with high slash. Viral slash combo for endless scaling.',
  '/Lotus/Weapons/Tenno/Melee/Swords/PrimeNamiSkyla/PrimeNamiSkyla', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritFireRateBonusModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 48, 1590, '38.5', ARRAY['dual-swords','slash','viral']
);

-- 11. Pennant — Great Katana
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000011', '00000000-0000-0000-0000-000000000002',
  'Railjack Slayer', 'Heavy attack kills buff attack speed. Snowballs into a slash machine.',
  '/Lotus/Weapons/Tenno/Melee/Swords/TnRailjackGreatKatana/TnRailJackGreatKatanaWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Channel/ChannelVampireMod","rank":3}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 52, 1720, '38.5', ARRAY['great-katana','heavy-attack','railjack']
);

-- 12. Vitrica — Glass Greatsword
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000012', '00000000-0000-0000-0000-000000000003',
  'Glass Cannon', 'Nightwave glass sword. Heavy attack shatters vitrified enemies for massive AoE.',
  '/Lotus/Weapons/Tenno/Melee/Swords/NWIIIOrokinSword/NWOrokinSword', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFireRateModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/ElectEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Sets/Gladiator/MeleeGladiatorMightMod","rank":5}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 39, 1280, '38.5', ARRAY['greatsword','glass','nightwave','aoe']
);

-- 13. Tenet Livia — Corpus Katana
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000013', '00000000-0000-0000-0000-000000000001',
  'Tenet Edge', 'Tenet bonus element stacks with mods for triple element coverage.',
  '/Lotus/Weapons/Corpus/Melee/CrpBriefcase2HKatana/CrpBriefcase2HKatana', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritFireRateBonusModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/IceEventMeleeMod","rank":3}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon","madurai",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 58, 1920, '38.5', ARRAY['tenet','katana','corpus','status']
);

-- 14. Praedos — Zariman Tonfas
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000014', '00000000-0000-0000-0000-000000000002',
  'Void Strike', 'Zariman tonfas with innate void damage. Devastating against Angels.',
  '/Lotus/Weapons/Tenno/Zariman/Melee/Tonfas/ZarimanTonfaWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritFireRateBonusModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 63, 2080, '38.5', ARRAY['zariman','tonfas','void']
);

-- 15. Innodem — Zariman Dagger
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000015', '00000000-0000-0000-0000-000000000003',
  'Finisher Dagger', 'Void damage dagger with high finisher damage. Heavy attack for guaranteed finishers.',
  '/Lotus/Weapons/Tenno/Zariman/Melee/Dagger/ZarimanDaggerWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFireRateModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/ElectEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 45, 1480, '38.5', ARRAY['dagger','zariman','finisher','void']
);

-- 16. Nepheri — Archon Daggers
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000016', '00000000-0000-0000-0000-000000000001',
  'Archon Blades', 'Dual daggers from the Archon hunts. Fast slashing with innate elemental.',
  '/Lotus/Weapons/Archon/Melee/DualDaggers/ArchonDualDaggersPlayerWep', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritFireRateBonusModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 57, 1880, '38.5', ARRAY['archon','dual-daggers','fast']
);

-- 17. Quassus — Warfan
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000017', '00000000-0000-0000-0000-000000000002',
  'Glass Shards', 'Heavy attack launches glass projectiles. Ranged melee from safety.',
  '/Lotus/Weapons/Tenno/Melee/Warfan/TnBrokenFrameWarfan/TnBrokenFrameWarfanWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Channel/ChannelVampireMod","rank":3}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 41, 1350, '38.5', ARRAY['warfan','projectile','xaku','heavy-attack']
);

-- 18. Dual Keres Prime
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000018', '00000000-0000-0000-0000-000000000003',
  'Slash Storm', 'Fast dual swords with extremely high crit and slash. Melts Steel Path enemies.',
  '/Lotus/Weapons/Tenno/Melee/Swords/PrimeDualKeres/PrimeDualKeresWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritFireRateBonusModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon","madurai",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 74, 2450, '38.5', ARRAY['dual-swords','crit','slash','steel-path']
);

-- 19. Korumm — Archon Trident
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000019', '00000000-0000-0000-0000-000000000001',
  'Archon Impaler', 'Trident with innate magnetic damage. Heavy attack pulls enemies in.',
  '/Lotus/Weapons/Archon/Melee/Trident/ArchonTridentPlayerWep', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritChanceModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFireRateModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/ElectEventMeleeMod","rank":3}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","madurai","naramon","naramon",null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":4,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 36, 1190, '38.5', ARRAY['archon','trident','magnetic','pull']
);

-- 20. Slaytra — Grineer Machete
INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES (
  '00000000-0000-0000-0000-5eed40000020', '00000000-0000-0000-0000-000000000002',
  'Butcher Build', 'Grineer machete with incredible slash procs. Fast attacks with status stacking.',
  '/Lotus/Weapons/Grineer/Melee/GrnSharbola/GrnSharbolaWeapon', 'Melee',
  '{"mods":[{"uniqueName":"/Lotus/Upgrades/Mods/Melee/WeaponDamageIfVictimProcActive","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboCritChanceMod","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Event/ComboStatusChanceMod","rank":5},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFireRateModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponMeleeRangeIncModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponCritDamageModExpert","rank":10},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/DualStat/PoisonEventMeleeMod","rank":3},{"uniqueName":"/Lotus/Upgrades/Mods/Melee/Expert/WeaponFreezeDamageModExpert","rank":10}],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":["madurai","naramon","naramon",null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":3,"hasReactor":false,"hasCatalyst":true,"helminthAbility":null}'::jsonb,
  true, 29, 960, '38.5', ARRAY['machete','grineer','slash','fast']
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- COMPANION BUILDS (5 — for loadout variety)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO builds (id, user_id, name, description, item_unique_name, item_category, config, is_public, vote_score, view_count, game_version, tags) VALUES
(
  '00000000-0000-0000-0000-5eed50000001', '00000000-0000-0000-0000-000000000001',
  'Panzer Tank', 'Panzer Vulpaphyla with viral quills. Cannot die — regenerates automatically.',
  '/Lotus/Types/Friendly/Pets/CreaturePets/ArmoredInfestedCatbrowPetPowerSuit', 'Companion',
  '{"mods":[null,null,null,null,null,null,null,null],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":[null,null,null,null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":0,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 89, 2960, '38.5', ARRAY['vulpaphyla','immortal','viral']
),
(
  '00000000-0000-0000-0000-5eed50000002', '00000000-0000-0000-0000-000000000002',
  'Adarza Crit Buffer', 'Cat Eye gives flat crit chance to the whole team. Essential for eidolon hunts.',
  '/Lotus/Types/Game/CatbrowPet/MirrorCatbrowPetPowerSuit', 'Companion',
  '{"mods":[null,null,null,null,null,null,null,null],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":[null,null,null,null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":0,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 67, 2220, '38.5', ARRAY['kavat','crit','eidolon','team']
),
(
  '00000000-0000-0000-0000-5eed50000003', '00000000-0000-0000-0000-000000000003',
  'Carrier Ammo Bot', 'Ammo Case keeps your weapons fed. The classic sentinel for ammo-hungry weapons.',
  '/Lotus/Types/Sentinels/SentinelPowersuits/PrimeCarrierPowerSuit', 'Companion',
  '{"mods":[null,null,null,null,null,null,null,null],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":[null,null,null,null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":0,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 54, 1780, '38.5', ARRAY['sentinel','ammo','carrier']
),
(
  '00000000-0000-0000-0000-5eed50000004', '00000000-0000-0000-0000-000000000001',
  'Helios Scanner', 'Auto-scans everything. Codex filled with zero effort.',
  '/Lotus/Types/Sentinels/SentinelPowersuits/PrimeHeliosPowerSuit', 'Companion',
  '{"mods":[null,null,null,null,null,null,null,null],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":[null,null,null,null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":0,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 43, 1420, '38.5', ARRAY['sentinel','scanner','codex']
),
(
  '00000000-0000-0000-0000-5eed50000005', '00000000-0000-0000-0000-000000000002',
  'Sahasa Digger', 'Digs up energy and ammo. Great passive resource generation.',
  '/Lotus/Types/Game/KubrowPet/AdventurerKubrowPetPowerSuit', 'Companion',
  '{"mods":[null,null,null,null,null,null,null,null],"aura":null,"exilus":null,"arcanes":[null,null],"slotPolarities":[null,null,null,null,null,null,null,null],"auraPolarity":null,"exilusPolarity":null,"formaCount":0,"hasReactor":true,"helminthAbility":null}'::jsonb,
  true, 31, 1020, '38.5', ARRAY['kubrow','energy','dig']
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- LOADOUTS (20)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO loadouts (id, user_id, name, description, warframe_build_id, primary_build_id, secondary_build_id, melee_build_id, companion_build_id, focus_school, is_public, vote_score, game_version) VALUES
-- 1. ESO Nuke
('00000000-0000-0000-0000-5eed90000001', '00000000-0000-0000-0000-000000000001',
 'ESO Nuke Squad', 'Saryn + Ignis for maximum AoE damage in Elite Sanctuary Onslaught.',
 '00000000-0000-0000-0000-5eed10000001', '00000000-0000-0000-0000-5eed20000001', '00000000-0000-0000-0000-5eed30000002', '00000000-0000-0000-0000-5eed40000001',
 '00000000-0000-0000-0000-5eed50000001', 'Madurai', true, 87, '38.5'),

-- 2. Steel Path Endurance
('00000000-0000-0000-0000-5eed90000002', '00000000-0000-0000-0000-000000000001',
 'Steel Path Endurance', 'Mesa for killing, Kuva Nukor for priming, Nikana for CO melee.',
 '00000000-0000-0000-0000-5eed10000002', '00000000-0000-0000-0000-5eed20000006', '00000000-0000-0000-0000-5eed30000002', '00000000-0000-0000-0000-5eed40000001',
 '00000000-0000-0000-0000-5eed50000001', 'Zenurik', true, 134, '38.5'),

-- 3. Team Support
('00000000-0000-0000-0000-5eed90000003', '00000000-0000-0000-0000-000000000002',
 'Mote Support', 'Wisp motes + Fulmin for silent kills. Glaive for safe ranged damage.',
 '00000000-0000-0000-0000-5eed10000003', '00000000-0000-0000-0000-5eed20000012', '00000000-0000-0000-0000-5eed30000003', '00000000-0000-0000-0000-5eed40000005',
 '00000000-0000-0000-0000-5eed50000002', 'Zenurik', true, 95, '38.5'),

-- 4. Tank Everything
('00000000-0000-0000-0000-5eed90000004', '00000000-0000-0000-0000-000000000002',
 'Unkillable Tank', 'Iron Skin Rhino with Bramma for AoE. Stropha heavy attacks for bosses.',
 '00000000-0000-0000-0000-5eed10000004', '00000000-0000-0000-0000-5eed20000006', '00000000-0000-0000-0000-5eed30000001', '00000000-0000-0000-0000-5eed40000006',
 '00000000-0000-0000-0000-5eed50000003', 'Unairu', true, 112, '38.5'),

-- 5. Eidolon Hunter
('00000000-0000-0000-0000-5eed90000005', '00000000-0000-0000-0000-000000000003',
 'Eidolon Hunter', 'Volt shields + Rubico for one-tapping limbs. Epitaph for emergency CC.',
 '00000000-0000-0000-0000-5eed10000005', '00000000-0000-0000-0000-5eed20000005', '00000000-0000-0000-0000-5eed30000003', '00000000-0000-0000-0000-5eed40000009',
 '00000000-0000-0000-0000-5eed50000002', 'Madurai', true, 156, '38.5'),

-- 6. Resource Farmer
('00000000-0000-0000-0000-5eed90000006', '00000000-0000-0000-0000-000000000003',
 'Farm Everything', 'Nekros Desecrate + Ignis for fast kills + Orthos Prime for range clearing.',
 '00000000-0000-0000-0000-5eed10000006', '00000000-0000-0000-0000-5eed20000001', '00000000-0000-0000-0000-5eed30000006', '00000000-0000-0000-0000-5eed40000003',
 '00000000-0000-0000-0000-5eed50000005', 'Zenurik', true, 143, '38.5'),

-- 7. Defense Lockdown
('00000000-0000-0000-0000-5eed90000007', '00000000-0000-0000-0000-000000000001',
 'Defense Lockdown', 'Slow Nova + Tenet Arca Plasmor for hallway clearing. Kronen for close range.',
 '00000000-0000-0000-0000-5eed10000007', '00000000-0000-0000-0000-5eed20000007', '00000000-0000-0000-0000-5eed30000004', '00000000-0000-0000-0000-5eed40000004',
 '00000000-0000-0000-0000-5eed50000001', 'Zenurik', true, 78, '38.5'),

-- 8. AFK Survival
('00000000-0000-0000-0000-5eed90000008', '00000000-0000-0000-0000-000000000002',
 'AFK Survival', 'Octavia Mallet does the killing. Just crouch for invis and watch.',
 '00000000-0000-0000-0000-5eed10000008', '00000000-0000-0000-0000-5eed20000008', '00000000-0000-0000-0000-5eed30000005', '00000000-0000-0000-0000-5eed40000003',
 '00000000-0000-0000-0000-5eed50000001', 'Zenurik', true, 167, '38.5'),

-- 9. Spy Master
('00000000-0000-0000-0000-5eed90000009', '00000000-0000-0000-0000-000000000003',
 'Spy Master', 'Permanent invis Ivara. Fulmin silent mode for kills. Nikana for finishers.',
 '00000000-0000-0000-0000-5eed10000009', '00000000-0000-0000-0000-5eed20000012', '00000000-0000-0000-0000-5eed30000008', '00000000-0000-0000-0000-5eed40000001',
 null, 'Naramon', true, 64, '38.5'),

-- 10. Clone Army
('00000000-0000-0000-0000-5eed90000010', '00000000-0000-0000-0000-000000000001',
 'Clone Army', 'Wukong twin with Kuva Zarr. You use melee, twin nukes with the primary.',
 '00000000-0000-0000-0000-5eed10000010', '00000000-0000-0000-0000-5eed20000010', '00000000-0000-0000-0000-5eed30000007', '00000000-0000-0000-0000-5eed40000010',
 '00000000-0000-0000-0000-5eed50000003', 'Naramon', true, 91, '38.5'),

-- 11. Khora Farm
('00000000-0000-0000-0000-5eed90000011', '00000000-0000-0000-0000-000000000002',
 'Pilfering Strangledome', 'Khora dome farming with Cedo for status priming. Max loot generation.',
 '00000000-0000-0000-0000-5eed10000011', '00000000-0000-0000-0000-5eed20000009', '00000000-0000-0000-0000-5eed30000009', '00000000-0000-0000-0000-5eed40000007',
 '00000000-0000-0000-0000-5eed50000001', 'Zenurik', true, 108, '38.5'),

-- 12. Blood Queen
('00000000-0000-0000-0000-5eed90000012', '00000000-0000-0000-0000-000000000003',
 'Blood Carnage', 'Garuda slash build with Acceltra for AoE and Venka Prime for 13x combo.',
 '00000000-0000-0000-0000-5eed10000012', '00000000-0000-0000-0000-5eed20000003', '00000000-0000-0000-0000-5eed30000013', '00000000-0000-0000-0000-5eed40000008',
 null, 'Madurai', true, 56, '38.5'),

-- 13. Mesmer Tank
('00000000-0000-0000-0000-5eed90000013', '00000000-0000-0000-0000-000000000001',
 'Mesmer Immortal Tank', 'Revenant cant die. Phantasma synergy for Eidolon-themed loadout.',
 '00000000-0000-0000-0000-5eed10000013', '00000000-0000-0000-0000-5eed20000013', '00000000-0000-0000-0000-5eed30000010', '00000000-0000-0000-0000-5eed40000013',
 '00000000-0000-0000-0000-5eed50000004', 'Vazarin', true, 82, '38.5'),

-- 14. Mutation Stack
('00000000-0000-0000-0000-5eed90000014', '00000000-0000-0000-0000-000000000002',
 'Nidus Infestation', 'Full infested themed loadout. Nidus + Bubonico + Lesion. Embrace the plague.',
 '00000000-0000-0000-0000-5eed10000014', '00000000-0000-0000-0000-5eed20000016', '00000000-0000-0000-0000-5eed30000011', '00000000-0000-0000-0000-5eed40000007',
 '00000000-0000-0000-0000-5eed50000001', 'Unairu', true, 73, '38.5'),

-- 15. Covenant Crits
('00000000-0000-0000-0000-5eed90000015', '00000000-0000-0000-0000-000000000003',
 'Covenant Crit Squad', 'Harrow crit buff + Chakkhurr headshots + Knell headshot loops.',
 '00000000-0000-0000-0000-5eed10000015', '00000000-0000-0000-0000-5eed20000020', '00000000-0000-0000-0000-5eed30000008', '00000000-0000-0000-0000-5eed40000009',
 null, 'Madurai', true, 61, '38.5'),

-- 16. Desert Wind
('00000000-0000-0000-0000-5eed90000016', '00000000-0000-0000-0000-000000000001',
 'Pacifist Rage', 'Baruuk Desert Wind build. Drain restraint fast, then unleash devastating waves.',
 '00000000-0000-0000-0000-5eed10000016', '00000000-0000-0000-0000-5eed20000002', '00000000-0000-0000-0000-5eed30000015', '00000000-0000-0000-0000-5eed40000004',
 '00000000-0000-0000-0000-5eed50000002', 'Naramon', true, 69, '38.5'),

-- 17. Glass Defense
('00000000-0000-0000-0000-5eed90000017', '00000000-0000-0000-0000-000000000002',
 'Glass Fortress', 'Gara Splinter Storm stacking with Corinth airburst. Vitrica for glass theme.',
 '00000000-0000-0000-0000-5eed10000017', '00000000-0000-0000-0000-5eed20000011', '00000000-0000-0000-0000-5eed30000014', '00000000-0000-0000-0000-5eed40000012',
 '00000000-0000-0000-0000-5eed50000003', 'Unairu', true, 54, '38.5'),

-- 18. Turret Defense
('00000000-0000-0000-0000-5eed90000018', '00000000-0000-0000-0000-000000000003',
 'Engineering Bay', 'Protea turrets + Stahlta charged shots. Nepheri daggers for close encounters.',
 '00000000-0000-0000-0000-5eed10000018', '00000000-0000-0000-0000-5eed20000014', '00000000-0000-0000-0000-5eed30000012', '00000000-0000-0000-0000-5eed40000016',
 '00000000-0000-0000-0000-5eed50000004', 'Zenurik', true, 47, '38.5'),

-- 19. Elemental Master
('00000000-0000-0000-0000-5eed90000019', '00000000-0000-0000-0000-000000000001',
 'Elemental Master', 'Lavos element mixing + Hystrix element switching. Maximum elemental coverage.',
 '00000000-0000-0000-0000-5eed10000019', '00000000-0000-0000-0000-5eed20000017', '00000000-0000-0000-0000-5eed30000016', '00000000-0000-0000-0000-5eed40000019',
 '00000000-0000-0000-0000-5eed50000005', 'Unairu', true, 42, '38.5'),

-- 20. Void Warrior
('00000000-0000-0000-0000-5eed90000020', '00000000-0000-0000-0000-000000000002',
 'Void Warrior', 'Xaku Vast Untime + Phenmor incarnon + Laetum incarnon + Praedos void melee. Full Zariman kit.',
 '00000000-0000-0000-0000-5eed10000020', '00000000-0000-0000-0000-5eed20000015', '00000000-0000-0000-0000-5eed30000004', '00000000-0000-0000-0000-5eed40000014',
 null, 'Madurai', true, 96, '38.5');

-- ═══════════════════════════════════════════════════════════════════════════════
-- CLEANUP INSTRUCTIONS
-- ═══════════════════════════════════════════════════════════════════════════════
-- To remove ALL seed data, run:
--   DELETE FROM profiles WHERE id IN (
--     '00000000-0000-0000-0000-000000000001',
--     '00000000-0000-0000-0000-000000000002',
--     '00000000-0000-0000-0000-000000000003'
--   );
-- This cascades to all builds, loadouts, and related data via FK.
-- ═══════════════════════════════════════════════════════════════════════════════
