import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { fetchComments, addComment } from '../../lib/social';
import { ReportButton } from './ReportButton';
import { Markdown } from '../ui/Markdown';
import type { Comment } from '../../types';

interface CommentItemProps {
  comment: Comment;
  targetId: string;
  targetType: 'build' | 'loadout';
  depth?: number;
}

function CommentItem({ comment, targetId, targetType, depth = 0 }: CommentItemProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [replyOpen, setReplyOpen] = useState(false);

  const replyMutation = useMutation({
    mutationFn: (body: string) => addComment(targetId, targetType, body, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', targetId, targetType] });
      setReplyOpen(false);
    },
  });

  const date = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={depth > 0 ? 'ml-6 border-l border-wf-border pl-4' : ''}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-medium text-wf-text">
            {comment.author.displayName ?? comment.author.username}
          </span>
          <span className="text-xs text-wf-text-muted">{date}</span>
          <ReportButton targetType="comment" targetId={comment.id} />
        </div>
        <Markdown text={comment.body} className="text-sm text-wf-text-dim" />
        {user && depth === 0 && (
          <button
            onClick={() => setReplyOpen((v) => !v)}
            className="mt-1.5 text-xs text-wf-text-muted hover:text-wf-text-dim transition-colors"
          >
            {replyOpen ? 'Cancel' : 'Reply'}
          </button>
        )}
      </div>

      {replyOpen && (
        <CommentForm
          onSubmit={(body) => replyMutation.mutate(body)}
          loading={replyMutation.isPending}
          placeholder="Write a reply…"
          submitLabel="Post Reply"
          onCancel={() => setReplyOpen(false)}
        />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              targetId={targetId}
              targetType={targetType}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentFormProps {
  onSubmit: (body: string) => void;
  loading: boolean;
  placeholder?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

function CommentForm({
  onSubmit,
  loading,
  placeholder = 'Write a comment…',
  submitLabel = 'Post Comment',
  onCancel,
}: CommentFormProps) {
  const [text, setText] = useState('');

  function handleSubmit() {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  }

  return (
    <div className="mb-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={2000}
        className="w-full bg-wf-bg border border-wf-border rounded px-3 py-2 text-sm text-wf-text resize-none focus:outline-none focus:border-wf-border-light"
      />
      <div className="flex items-center gap-2 mt-1.5">
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="px-3 py-1.5 bg-wf-gold text-wf-bg-dark text-sm font-medium rounded hover:bg-wf-gold-light transition-colors disabled:opacity-40"
        >
          {loading ? 'Posting…' : submitLabel}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-wf-text-dim hover:text-wf-text transition-colors"
          >
            Cancel
          </button>
        )}
        <span className="text-xs text-wf-text-muted ml-auto">{text.length}/2000</span>
      </div>
    </div>
  );
}

interface CommentsSectionProps {
  targetId: string;
  targetType: 'build' | 'loadout';
}

export function CommentsSection({ targetId, targetType }: CommentsSectionProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', targetId, targetType],
    queryFn: () => fetchComments(targetId, targetType),
  });

  const addMutation = useMutation({
    mutationFn: (body: string) => addComment(targetId, targetType, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', targetId, targetType] });
    },
  });

  return (
    <section>
      <h2 className="text-lg font-semibold text-wf-text mb-4">
        Comments {comments.length > 0 && <span className="text-wf-text-muted text-sm">({comments.length})</span>}
      </h2>

      {user ? (
        <CommentForm onSubmit={(body) => addMutation.mutate(body)} loading={addMutation.isPending} />
      ) : (
        <p className="text-sm text-wf-text-muted mb-4">
          <a href="/login" className="text-wf-gold hover:underline">Sign in</a> to leave a comment.
        </p>
      )}

      {isLoading ? (
        <div className="text-wf-text-muted text-sm py-4">Loading comments…</div>
      ) : comments.length === 0 ? (
        <div className="text-wf-text-muted text-sm py-4">No comments yet. Be the first!</div>
      ) : (
        <div className="divide-y divide-wf-border">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              targetId={targetId}
              targetType={targetType}
            />
          ))}
        </div>
      )}
    </section>
  );
}
