// Social feature queries — Phase 3
import { supabase } from './supabase';
import type {
  PublicBuildSummary,
  PublicBuild,
  Comment,
  ReportReason,
  ItemCategory,
  Loadout,
} from '../types';

// ─── Browse ────────────────────────────────────────────────────────────────

export type SortOption = 'newest' | 'top' | 'views';

export interface BrowseOptions {
  category?: ItemCategory | 'all';
  search?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
  maxForma?: number;
  hasReactor?: boolean;
}

function toPublicBuildSummary(row: Record<string, unknown>): PublicBuildSummary {
  const profiles = row.profiles as { id: string; username: string } | null;
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string | null,
    itemUniqueName: row.item_unique_name as string,
    itemCategory: row.item_category as ItemCategory,
    isPublic: row.is_public as boolean,
    voteScore: (row.vote_score as number) ?? 0,
    viewCount: (row.view_count as number) ?? 0,
    gameVersion: row.game_version as string | null,
    tags: (row.tags as string[]) ?? [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    author: {
      id: profiles?.id ?? (row.user_id as string),
      username: profiles?.username ?? 'Unknown',
    },
  };
}

export async function fetchPublicBuilds(options: BrowseOptions = {}): Promise<{
  builds: PublicBuildSummary[];
  total: number;
}> {
  const { category = 'all', search = '', sort = 'newest', page = 0, pageSize = 20, maxForma, hasReactor } = options;

  let query = supabase
    .from('builds')
    .select('*, profiles!user_id(id, username)', { count: 'exact' })
    .eq('is_public', true);

  if (category !== 'all') {
    query = query.eq('item_category', category);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  if (maxForma !== undefined) {
    query = query.lte('config->formaCount', maxForma);
  }
  if (hasReactor !== undefined) {
    query = query.eq('config->hasReactor', hasReactor);
  }

  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'top') {
    query = query.order('vote_score', { ascending: false });
  } else if (sort === 'views') {
    query = query.order('view_count', { ascending: false });
  }

  query = query.range(page * pageSize, (page + 1) * pageSize - 1);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    builds: (data ?? []).map(toPublicBuildSummary),
    total: count ?? 0,
  };
}

export async function fetchBuildById(id: string): Promise<PublicBuild | null> {
  const { data, error } = await supabase
    .from('builds')
    .select('*, profiles!user_id(id, username)')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  const summary = toPublicBuildSummary(data as Record<string, unknown>);
  return { ...summary, config: (data as Record<string, unknown>).config as PublicBuild['config'] };
}

export async function fetchUserPublicBuilds(userId: string): Promise<PublicBuildSummary[]> {
  const { data, error } = await supabase
    .from('builds')
    .select('*, profiles!user_id(id, username)')
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toPublicBuildSummary);
}

export async function fetchMyBuilds(userId: string): Promise<PublicBuildSummary[]> {
  const { data, error } = await supabase
    .from('builds')
    .select('*, profiles!user_id(id, username)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toPublicBuildSummary);
}

export async function fetchProfileByUsername(
  username: string,
): Promise<{ id: string; username: string; createdAt: string } | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, created_at')
    .eq('username', username)
    .single();

  if (error || !data) return null;
  return {
    id: data.id as string,
    username: data.username as string,
    createdAt: data.created_at as string,
  };
}

// ─── View Count ────────────────────────────────────────────────────────────

export async function incrementViewCount(buildId: string): Promise<void> {
  await supabase.rpc('increment_view_count', {
    p_target_id: buildId,
    p_target_type: 'build',
  });
}

// ─── Voting ────────────────────────────────────────────────────────────────

export async function getUserVote(
  targetId: string,
  targetType: 'build' | 'loadout',
): Promise<1 | -1 | 0> {
  const { data } = await supabase
    .from('votes')
    .select('value')
    .eq('target_id', targetId)
    .eq('target_type', targetType)
    .maybeSingle();

  return (data?.value as 1 | -1 | 0) ?? 0;
}

export async function castVote(
  targetId: string,
  targetType: 'build' | 'loadout',
  value: 1 | -1 | 0,
): Promise<void> {
  await supabase.rpc('vote_on_target', {
    p_target_id: targetId,
    p_target_type: targetType,
    p_value: value,
  });
}

export async function toggleBuildPublic(buildId: string, isPublic: boolean): Promise<void> {
  const { error } = await supabase
    .from('builds')
    .update({ is_public: isPublic })
    .eq('id', buildId);
  if (error) throw error;
}

export async function cloneBuild(buildId: string, userId: string): Promise<string | null> {
  const original = await fetchBuildById(buildId);
  if (!original) return null;

  const { data, error } = await supabase
    .from('builds')
    .insert({
      user_id: userId,
      name: `${original.name} (copy)`,
      description: original.description,
      item_unique_name: original.itemUniqueName,
      item_category: original.itemCategory,
      config: original.config,
      is_public: false,
      game_version: original.gameVersion,
      tags: original.tags,
    })
    .select('id')
    .single();

  if (error) throw error;
  return (data as { id: string }).id;
}

// ─── Loadout (public view) ─────────────────────────────────────────────────

export async function fetchLoadoutById(id: string): Promise<(Loadout & { author: { id: string; username: string } }) | null> {
  const { data, error } = await supabase
    .from('loadouts')
    .select('*, profiles!user_id(id, username)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  const profiles = (data as Record<string, unknown>).profiles as { id: string; username: string } | null;

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    description: data.description ?? null,
    warframeBuildId: data.warframe_build_id,
    primaryBuildId: data.primary_build_id,
    secondaryBuildId: data.secondary_build_id,
    meleeBuildId: data.melee_build_id,
    exaltedBuildId: data.exalted_build_id,
    archwingBuildId: data.archwing_build_id ?? null,
    archgunBuildId: data.archgun_build_id ?? null,
    archmeleeBuildId: data.archmelee_build_id ?? null,
    companionBuildId: data.companion_build_id ?? null,
    companionWeaponBuildId: data.companion_weapon_build_id ?? null,
    necramechBuildId: data.necramech_build_id ?? null,
    parazonBuildId: data.parazon_build_id ?? null,
    kdriveBuildId: data.kdrive_build_id ?? null,
    focusSchool: data.focus_school ?? null,
    isPublic: data.is_public,
    voteScore: data.vote_score ?? 0,
    gameVersion: data.game_version ?? null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    author: {
      id: profiles?.id ?? data.user_id,
      username: profiles?.username ?? 'Unknown',
    },
  };
}

export async function fetchBuildSummariesByIds(ids: string[]): Promise<Record<string, { id: string; name: string; itemCategory: string; itemUniqueName: string }>> {
  const validIds = ids.filter(Boolean);
  if (validIds.length === 0) return {};

  const { data, error } = await supabase
    .from('builds')
    .select('id, name, item_category, item_unique_name')
    .in('id', validIds);

  if (error || !data) return {};

  const map: Record<string, { id: string; name: string; itemCategory: string; itemUniqueName: string }> = {};
  for (const b of data) {
    map[b.id] = { id: b.id, name: b.name, itemCategory: b.item_category, itemUniqueName: b.item_unique_name };
  }
  return map;
}

// ─── Comments ──────────────────────────────────────────────────────────────

function toComment(row: Record<string, unknown>): Comment {
  const profiles = row.profiles as { id: string; username: string } | null;
  return {
    id: row.id as string,
    userId: row.user_id as string,
    targetId: row.target_id as string,
    targetType: row.target_type as 'build' | 'loadout',
    parentCommentId: row.parent_comment_id as string | null,
    body: row.body as string,
    isHidden: row.is_hidden as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    author: {
      id: profiles?.id ?? (row.user_id as string),
      username: profiles?.username ?? 'Unknown',
    },
  };
}

export async function fetchComments(
  targetId: string,
  targetType: 'build' | 'loadout',
): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles!user_id(id, username)')
    .eq('target_id', targetId)
    .eq('target_type', targetType)
    .eq('is_hidden', false)
    .order('created_at', { ascending: true });

  if (error) throw error;

  const rows = (data ?? []).map((r) => toComment(r as Record<string, unknown>));
  const topLevel = rows.filter((c) => !c.parentCommentId);
  const replies = rows.filter((c) => c.parentCommentId);

  // Nest replies under their parent
  return topLevel.map((c) => ({
    ...c,
    replies: replies.filter((r) => r.parentCommentId === c.id),
  }));
}

export async function addComment(
  targetId: string,
  targetType: 'build' | 'loadout',
  body: string,
  parentCommentId: string | null = null,
): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      target_id: targetId,
      target_type: targetType,
      body: body.trim(),
      parent_comment_id: parentCommentId,
    })
    .select('*, profiles!user_id(id, username)')
    .single();

  if (error) throw error;
  return toComment(data as Record<string, unknown>);
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) throw error;
}

// ─── Reports ───────────────────────────────────────────────────────────────

// ─── Admin / Moderation ───────────────────────────────────────────────────

export interface AdminReport {
  id: string;
  reporterId: string | null;
  targetType: 'build' | 'loadout' | 'comment';
  targetId: string;
  reason: ReportReason;
  notes: string | null;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}

export async function fetchPendingReports(): Promise<AdminReport[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    reporterId: r.reporter_id as string | null,
    targetType: r.target_type as AdminReport['targetType'],
    targetId: r.target_id as string,
    reason: r.reason as ReportReason,
    notes: r.notes as string | null,
    status: r.status as AdminReport['status'],
    createdAt: r.created_at as string,
  }));
}

export async function updateReportStatus(reportId: string, status: 'reviewed' | 'dismissed'): Promise<void> {
  const { error } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', reportId);
  if (error) throw error;
}

export async function softDeleteBuild(buildId: string): Promise<void> {
  const { error } = await supabase
    .from('builds')
    .update({ is_public: false, is_deleted: true })
    .eq('id', buildId);
  if (error) throw error;
}

export async function hideComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .update({ is_hidden: true })
    .eq('id', commentId);
  if (error) throw error;
}

export async function reportTarget(
  targetType: 'build' | 'loadout' | 'comment',
  targetId: string,
  reason: ReportReason,
  notes: string,
): Promise<void> {
  const { error } = await supabase.from('reports').insert({
    target_type: targetType,
    target_id: targetId,
    reason,
    notes: notes.trim() || null,
  });
  if (error) throw error;
}
