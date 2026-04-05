import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { reportTarget } from '../../lib/social';
import type { ReportReason } from '../../types';

interface ReportButtonProps {
  targetType: 'build' | 'loadout' | 'comment';
  targetId: string;
}

const REASONS: { value: ReportReason; label: string }[] = [
  { value: 'incorrect_stats', label: 'Incorrect stats / math error' },
  { value: 'outdated', label: 'Outdated (old patch)' },
  { value: 'spam', label: 'Spam or self-promotion' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'other', label: 'Other' },
];

export function ReportButton({ targetType, targetId }: ReportButtonProps) {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>('incorrect_stats');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  async function handleSubmit() {
    setLoading(true);
    try {
      await reportTarget(targetType, targetId, reason, notes);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-wf-text-muted hover:text-wf-warning transition-colors"
      >
        Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-wf-bg-card border border-wf-border rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-wf-gold font-semibold mb-4">Report {targetType}</h3>

            {submitted ? (
              <div className="text-center py-4">
                <p className="text-wf-success mb-4">Report submitted. Thanks for helping keep the community clean.</p>
                <button
                  onClick={() => { setOpen(false); setSubmitted(false); setNotes(''); }}
                  className="px-4 py-2 bg-wf-bg-hover border border-wf-border rounded text-wf-text text-sm hover:border-wf-border-light transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-wf-text-muted text-sm mb-2">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as ReportReason)}
                    className="w-full bg-wf-bg border border-wf-border rounded px-3 py-2 text-wf-text text-sm focus:outline-none focus:border-wf-border-light"
                  >
                    {REASONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block text-wf-text-muted text-sm mb-2">Additional notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Describe the issue..."
                    className="w-full bg-wf-bg border border-wf-border rounded px-3 py-2 text-wf-text text-sm resize-none focus:outline-none focus:border-wf-border-light"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-wf-danger/20 text-wf-danger border border-wf-danger/40 rounded text-sm hover:bg-wf-danger/30 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Submitting…' : 'Submit Report'}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-wf-bg-hover border border-wf-border rounded text-wf-text-dim text-sm hover:text-wf-text transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
