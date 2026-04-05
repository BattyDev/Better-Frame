import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { getUserVote, castVote } from '../../lib/social';

interface VoteButtonsProps {
  targetId: string;
  targetType: 'build' | 'loadout';
  initialScore: number;
  onScoreChange?: (newScore: number) => void;
}

export function VoteButtons({
  targetId,
  targetType,
  initialScore,
  onScoreChange,
}: VoteButtonsProps) {
  const { user } = useAuthStore();
  const [currentVote, setCurrentVote] = useState<1 | -1 | 0>(0);
  const [score, setScore] = useState(initialScore);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserVote(targetId, targetType).then(setCurrentVote);
  }, [targetId, targetType, user]);

  async function handleVote(value: 1 | -1) {
    if (!user || loading) return;
    const newValue: 1 | -1 | 0 = currentVote === value ? 0 : value;
    const scoreDelta = newValue - currentVote;

    // Optimistic update
    setCurrentVote(newValue);
    const newScore = score + scoreDelta;
    setScore(newScore);
    onScoreChange?.(newScore);

    setLoading(true);
    try {
      await castVote(targetId, targetType, newValue);
    } catch {
      // Revert on failure
      setCurrentVote(currentVote);
      setScore(score);
      onScoreChange?.(score);
    } finally {
      setLoading(false);
    }
  }

  const upActive = currentVote === 1;
  const downActive = currentVote === -1;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        disabled={!user || loading}
        title={user ? 'Upvote' : 'Sign in to vote'}
        className={`p-1.5 rounded transition-colors disabled:opacity-40 ${
          upActive
            ? 'text-wf-success bg-wf-success/10'
            : 'text-wf-text-dim hover:text-wf-success hover:bg-wf-success/10'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2L13 10H1L7 2Z" fill="currentColor" />
        </svg>
      </button>
      <span
        className={`text-sm font-mono w-6 text-center ${
          upActive ? 'text-wf-success' : downActive ? 'text-wf-danger' : 'text-wf-text'
        }`}
      >
        {score}
      </span>
      <button
        onClick={() => handleVote(-1)}
        disabled={!user || loading}
        title={user ? 'Downvote' : 'Sign in to vote'}
        className={`p-1.5 rounded transition-colors disabled:opacity-40 ${
          downActive
            ? 'text-wf-danger bg-wf-danger/10'
            : 'text-wf-text-dim hover:text-wf-danger hover:bg-wf-danger/10'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 12L1 4H13L7 12Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
