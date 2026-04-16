import { useEffect, useState } from 'react';
import { submitBugReport } from '../lib/social';
import type { BugSeverity } from '../types';

interface BugReportModalProps {
  open: boolean;
  onClose: () => void;
}

const SEVERITIES: { value: BugSeverity; label: string }[] = [
  { value: 'low', label: 'Low — minor annoyance' },
  { value: 'normal', label: 'Normal — bug, has workaround' },
  { value: 'high', label: 'High — feature broken' },
  { value: 'critical', label: 'Critical — blocks app / data loss' },
];

export function BugReportModal({ open, onClose }: BugReportModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [severity, setSeverity] = useState<BugSeverity>('normal');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state whenever the modal is closed.
  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setSteps('');
      setSeverity('normal');
      setSubmitted(false);
      setLoading(false);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const canSubmit =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    title.length <= 200 &&
    description.length <= 4000 &&
    steps.length <= 4000 &&
    !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await submitBugReport({
        title,
        description,
        steps: steps.trim() || undefined,
        severity,
      });
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit bug report');
    } finally {
      setLoading(false);
    }
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-wf-bg-card border border-wf-border rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-wf-gold font-semibold mb-4">Report a bug</h3>

        {submitted ? (
          <div className="text-center py-4">
            <p className="text-wf-success mb-4">
              Report submitted. Thanks for helping us track this down.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-wf-bg-hover border border-wf-border rounded text-wf-text text-sm hover:border-wf-border-light transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-wf-text-muted text-sm mb-2">
                Title <span className="text-wf-danger">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="Short summary"
                className="w-full bg-wf-bg border border-wf-border rounded px-3 py-2 text-wf-text text-sm focus:outline-none focus:border-wf-border-light"
              />
            </div>

            <div className="mb-4">
              <label className="block text-wf-text-muted text-sm mb-2">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as BugSeverity)}
                className="w-full bg-wf-bg border border-wf-border rounded px-3 py-2 text-wf-text text-sm focus:outline-none focus:border-wf-border-light"
              >
                {SEVERITIES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-wf-text-muted text-sm mb-2">
                What happened? <span className="text-wf-danger">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={4000}
                placeholder="Describe the bug you ran into and what you expected instead."
                className="w-full bg-wf-bg border border-wf-border rounded px-3 py-2 text-wf-text text-sm resize-none focus:outline-none focus:border-wf-border-light"
              />
            </div>

            <div className="mb-4">
              <label className="block text-wf-text-muted text-sm mb-2">
                Steps to reproduce (optional)
              </label>
              <textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                rows={3}
                maxLength={4000}
                placeholder={'1. Go to...\n2. Click...\n3. See error'}
                className="w-full bg-wf-bg border border-wf-border rounded px-3 py-2 text-wf-text text-sm resize-none focus:outline-none focus:border-wf-border-light"
              />
            </div>

            <div className="mb-5 text-xs text-wf-text-muted bg-wf-bg border border-wf-border rounded p-3">
              <div className="font-medium mb-1 text-wf-text-dim">Captured automatically</div>
              <div className="break-all">
                <span className="text-wf-text-muted">URL:</span> {currentUrl}
              </div>
              <div className="break-all mt-1">
                <span className="text-wf-text-muted">Browser:</span> {userAgent}
              </div>
            </div>

            {error && (
              <div className="mb-4 text-sm text-wf-danger bg-wf-danger/10 border border-wf-danger/40 rounded p-2">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-4 py-2 bg-wf-warning/20 text-wf-warning border border-wf-warning/40 rounded text-sm hover:bg-wf-warning/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting…' : 'Submit Bug Report'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-wf-bg-hover border border-wf-border rounded text-wf-text-dim text-sm hover:text-wf-text transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
