# Conan Wiki

Companion site for Conan Exiles — item lookup, wishlist with base-resource
rollups, and a pannable map with pins.

## Importing the game dataset

The reference tables (`conan_items`, `conan_recipes`, etc.) ship empty.
The data is loaded once from the CSV dataset using `scripts/import-conan-data.mjs`.

```powershell
# 1. From the Supabase dashboard: Settings -> API
#    Copy the Project URL and the service_role key.
#    NEVER commit the service_role key — it bypasses RLS.

# 2. Create apps/conan-wiki/.env with:
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# 3. Run the import (from the repo root):
npm run import-conan-data -w conan-wiki -- --source "C:/Users/Codya/Claude/Projects/Conan Exiles Wiki/data"
```

Expected output is a summary like:

```
  items                          7272 rows  (5310ms)
  recipes                        2117 rows  (1820ms)
  ...
Done in 28.4s.
```

The script is idempotent — reference tables upsert by primary key,
relation tables truncate-and-insert. Safe to rerun whenever the
dataset is refreshed.
