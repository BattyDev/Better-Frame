-- Phase 5: Browse Loadouts — adds view_count to loadouts and updates increment RPC
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE loadouts ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

CREATE INDEX IF NOT EXISTS loadouts_public_browse_idx
  ON loadouts(is_public, created_at DESC) WHERE is_public = true;

-- Update RPC to handle loadout view counts
CREATE OR REPLACE FUNCTION increment_view_count(
  p_target_id   uuid,
  p_target_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_target_type = 'build' THEN
    UPDATE builds SET view_count = view_count + 1 WHERE id = p_target_id;
  ELSIF p_target_type = 'loadout' THEN
    UPDATE loadouts SET view_count = view_count + 1 WHERE id = p_target_id;
  END IF;
END;
$$;
