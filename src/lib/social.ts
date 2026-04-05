// Social feature queries — Phase 3
import { supabase } from './supabase';
import type {
  PublicBuildSummary,
  PublicBuild,
  Comment,
  ReportReason,
  ItemCategory,
} from '../types';

// ─── Browse ────────────────────────────────────────────────────────────────

export type SortOption = 'newest' | 'top' | 'views';

export interface BrowseOptions {
  category?: ItemCategory | 'all';
  search?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

function toPublicBuildSummary(row: Record<string, unknown>): PublicBuildSummary {
  const profiles = row.profiles as { id: string; username: string; display_name: string | null } | null;
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
      displayName: profiles?.display_name ?? null,
    },
  };
}

export async function fetchPublicBuilds(options: BrowseOptions = {}): Promise<{
  builds: PublicBuildSummary[];
  total: number;
}> {
  const { category = 'all', search = '', sort = 'newest', page = 0, pageSize = 20 } = options;

  let query = supabase
    .from('builds')
    .select('*, profiles!user_id(id, username, display_name)', { count: 'exact' })
    .eq('is_public', true);

  if (category !== 'all') {
    query = query.eq('item_category', category);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
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
    .select('*, profiles!user_id(id, username, display_name)')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  const summary = toPublicBuildSummary(data as Record<string, unknown>);
  return { ...summary, config: (data as Record<string, unknown>).config as PublicBuild['config'] };
}

export async function fetchUserPublicBuilds(userId: string): Promise<PublicBuildSummary[]> {
  const { data, error } = await supabase
    .from('builds')
    .select('*, profiles!user_id(id, username, display_name)')
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toPublicBuildSummary);
}

export async function fetchMyBuilds(userId: string): Promise<PublicBuildSummary[]> {
  const { data, error } = await supabase
    .from('builds')
    .select('*, profiles!user_id(id, username, display_name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toPublicBuildSummary);
}

export async function fetchProfileByUsername(
  username: string,
): Promise<{ id: string; username: string; displayName: string | null; createdAt: string } | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, created_at')
    .eq('username', username)
    .single();

  if (error || !data) return null;
  return {
    id: data.id as string,
    username: data.username as string,
    displayName: data.display_name as string | null,
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

// ─── Comments ──────────────────────────────────────────────────────────────

function toComment(row: Record<string, unknown>): Comment {
  const profiles = row.profiles as { id: string; username: string; display_name: string | null } | null;
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
      displayName: profiles?.display_name ?? null,
    },
  };
}

export async function fetchComments(
  targetId: string,
  targetType: 'build' | 'loadout',
): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles!user_id(id, username, display_name)')
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
    .select('*, profiles!user_id(id, username, display_name)')
    .single();

  if (error) throw error;
  return toComment(data as Record<string, unknown>);
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) throw error;
}

// ─── Reports ───────────────────────────────────────────────────────────────

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
