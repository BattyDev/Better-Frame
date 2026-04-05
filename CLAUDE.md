# Better-Frame

Warframe build planner and loadout manager. Users create, save, share, and compare builds for warframes, weapons, and equipment.

## Tech Stack

- **Frontend**: React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4
- **State**: Zustand 5 (client), React Query 5 (server/cache)
- **Routing**: React Router v7 (client-side SPA with BrowserRouter)
- **Backend**: Supabase (auth, PostgreSQL, RLS)
- **Testing**: Vitest, Testing Library
- **Deploy**: Vercel (SPA rewrite to index.html)

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | TypeScript check + Vite production build |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (src/**/*.{ts,tsx}) |
| `npm run update-game-data` | Slim warframe-items data into src/data/ |

## Project Structure

```
src/
  components/    React components (builder/, ui/, layout/, social/)
  pages/         Page-level components (Builder, Dashboard, Browse, etc.)
  stores/        Zustand stores (auth, builder, weaponBuilder, equipmentBuilder, loadout)
  hooks/         Custom React hooks (currently minimal)
  lib/           Utilities — supabase client, social API, math/ calculations
  lib/math/      Core calc engine (capacity, stats, elements, arcanes) — heavily tested
  types/         Domain types (index.ts) and game data types (gameData.ts)
  data/          Slimmed JSON from warframe-items + TS accessor modules with Map indexes
  assets/        Images and icons
supabase/        SQL migrations (phase0-foundation, phase3-social, phase4-moderation)
scripts/         slim-game-data.mjs — compresses warframe-items ~13MB → ~1-2MB
```

## Code Conventions

- **Named exports** everywhere (no default exports)
- **Zustand stores**: flat state + actions in one `create()` call, no slices/middleware/persist
- **Supabase**: called directly in stores and lib/social.ts, no wrapper layer
- **Game data access**: pre-built `Map<string, T>` indexes at module load for O(1) lookups via getter functions (e.g., `getWarframeByUniqueName()`)
- **Styling**: Tailwind v4 utility classes only, no CSS modules, no component library (shadcn, etc.)
- **Prettier**: single quotes, semicolons, 2-space indent, trailing commas (es5), 100 char width
- **Tests**: focused on math/calculation layer (`src/lib/math/*.test.ts`), use mock factory functions

## Database Conventions

- **Naming**: snake_case tables and columns, UUIDs for all PKs
- **Timestamps**: `timestamptz` with `default now()`
- **Boolean flags**: `is_*` prefix (is_public, is_deleted, is_premium, is_hidden)
- **Build config**: stored as JSONB — keeps builds self-contained and avoids complex relational joins for mod/arcane slots
- **Soft deletes**: `is_deleted` boolean, RLS policies filter deleted items automatically
- **RLS patterns**:
  - Profiles: anyone reads, owner writes
  - Builds/Loadouts: public+not-deleted OR owner reads, owner writes
  - Votes/Comments: owner manages own records
  - Reports: anyone creates, admins/mods read
- **Denormalized scores**: vote_score and view_count on builds/loadouts, updated via RPC functions (`vote_on_target`, `increment_view_count`)
- **Seed data**: uses `seed_*` usernames and UUIDs containing `5eed`

## Game Data Pipeline

1. `warframe-items` npm package provides raw game data (~13MB)
2. `npm run update-game-data` runs `scripts/slim-game-data.mjs`
3. Script extracts only needed fields per item type → writes JSON to `src/data/`
4. TS accessor modules (`warframeData.ts`, `weaponData.ts`, etc.) build Map indexes on import for fast lookups by uniqueName

## Routing

Routes defined in `App.tsx` with nested `<Layout />` + `<Outlet />`:
- `/` Home, `/builder` Warframe, `/builder/:category` Weapon/Equipment (dynamic switch)
- `/loadout`, `/build/:id`, `/browse`, `/compare`, `/dashboard`
- `/profile`, `/login`, `/signup`, `/admin`

Equipment categories (archwing, companion, necramech, etc.) route to `EquipmentBuilder`; all others route to `WeaponBuilder`.

## Environment Variables

All prefixed with `VITE_` for Vite client exposure:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- `VITE_SITE_URL` — Production URL (tennotrove.com)
