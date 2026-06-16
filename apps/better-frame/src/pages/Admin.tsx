import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import {
  fetchPendingReports,
  updateReportStatus,
  softDeleteBuild,
  hideComment,
  type AdminReport,
} from '../lib/social';

const REASON_LABELS: Record<string, string> = {
  incorrect_stats: 'Incorrect Stats',
  outdated: 'Outdated',
  spam: 'Spam',
  inappropriate: 'Inappropriate',
  other: 'Other',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-wf-warning/10 text-wf-warning',
  reviewed: 'bg-wf-success/10 text-wf-success',
  dismissed: 'bg-wf-bg-hover text-wf-text-muted',
};

export default function Admin() {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();

  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator';

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: fetchPendingReports,
    enabled: isAdmin,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'reviewed' | 'dismissed' }) =>
      updateReportStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reports'] }),
  });

  const deleteBuildMutation = useMutation({
    mutationFn: (buildId: string) => softDeleteBuild(buildId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reports'] }),
  });

  const hideCommentMutation = useMutation({
    mutationFn: (commentId: string) => hideComment(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reports'] }),
  });

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status !== 'pending');

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-wf-gold mb-6">Admin Dashboard</h1>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-wf-bg-card border border-wf-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-wf-warning">{pendingReports.length}</div>
          <div className="text-xs text-wf-text-muted">Pending Reports</div>
        </div>
        <div className="bg-wf-bg-card border border-wf-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-wf-success">
            {resolvedReports.filter(r => r.status === 'reviewed').length}
          </div>
          <div className="text-xs text-wf-text-muted">Reviewed</div>
        </div>
        <div className="bg-wf-bg-card border border-wf-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-wf-text-dim">
            {resolvedReports.filter(r => r.status === 'dismissed').length}
          </div>
          <div className="text-xs text-wf-text-muted">Dismissed</div>
        </div>
      </div>

      {/* Pending reports */}
      <h2 className="text-lg font-semibold text-wf-text mb-4">
        Pending Reports {pendingReports.length > 0 && `(${pendingReports.length})`}
      </h2>

      {isLoading ? (
        <div className="text-wf-text-muted text-sm py-4">Loading reports...</div>
      ) : pendingReports.length === 0 ? (
        <div className="rounded-lg border border-dashed border-wf-border p-8 text-center text-wf-text-muted mb-8">
          No pending reports. All clear!
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {pendingReports.map((report) => (
            <ReportRow
              key={report.id}
              report={report}
              onReview={() => updateStatusMutation.mutate({ id: report.id, status: 'reviewed' })}
              onDismiss={() => updateStatusMutation.mutate({ id: report.id, status: 'dismissed' })}
              onDeleteBuild={() => {
                if (report.targetType === 'build') deleteBuildMutation.mutate(report.targetId);
              }}
              onHideComment={() => {
                if (report.targetType === 'comment') hideCommentMutation.mutate(report.targetId);
              }}
            />
          ))}
        </div>
      )}

      {/* Resolved reports */}
      {resolvedReports.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-wf-text mb-4">
            Resolved Reports ({resolvedReports.length})
          </h2>
          <div className="space-y-2">
            {resolvedReports.slice(0, 20).map((report) => (
              <ReportRow key={report.id} report={report} compact />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ReportRow({
  report,
  compact,
  onReview,
  onDismiss,
  onDeleteBuild,
  onHideComment,
}: {
  report: AdminReport;
  compact?: boolean;
  onReview?: () => void;
  onDismiss?: () => void;
  onDeleteBuild?: () => void;
  onHideComment?: () => void;
}) {
  const date = new Date(report.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const targetUrl =
    report.targetType === 'build' ? `/build/${report.targetId}` :
    report.targetType === 'loadout' ? `/loadout/${report.targetId}` :
    null;

  return (
    <div className="p-4 bg-wf-bg-card border border-wf-border rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[report.status]}`}>
              {report.status}
            </span>
            <span className="text-xs bg-wf-bg px-2 py-0.5 rounded text-wf-text-muted border border-wf-border">
              {report.targetType}
            </span>
            <span className="text-xs text-wf-warning font-medium">
              {REASON_LABELS[report.reason] ?? report.reason}
            </span>
            <span className="text-xs text-wf-text-muted ml-auto">{date}</span>
          </div>

          {report.notes && (
            <p className="text-sm text-wf-text-dim mt-1">{report.notes}</p>
          )}

          {targetUrl && (
            <Link to={targetUrl} className="text-xs text-wf-blue hover:underline mt-1 inline-block">
              View {report.targetType} →
            </Link>
          )}
        </div>

        {!compact && report.status === 'pending' && (
          <div className="flex gap-2 flex-shrink-0">
            {report.targetType === 'build' && onDeleteBuild && (
              <button
                onClick={onDeleteBuild}
                className="px-2 py-1 text-xs bg-wf-danger/20 text-wf-danger border border-wf-danger/30 rounded hover:bg-wf-danger/30 transition-colors"
              >
                Remove Build
              </button>
            )}
            {report.targetType === 'comment' && onHideComment && (
              <button
                onClick={onHideComment}
                className="px-2 py-1 text-xs bg-wf-danger/20 text-wf-danger border border-wf-danger/30 rounded hover:bg-wf-danger/30 transition-colors"
              >
                Hide Comment
              </button>
            )}
            <button
              onClick={onReview}
              className="px-2 py-1 text-xs bg-wf-success/20 text-wf-success border border-wf-success/30 rounded hover:bg-wf-success/30 transition-colors"
            >
              Mark Reviewed
            </button>
            <button
              onClick={onDismiss}
              className="px-2 py-1 text-xs bg-wf-bg-hover border border-wf-border rounded text-wf-text-dim hover:text-wf-text transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
