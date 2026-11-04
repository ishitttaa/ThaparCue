import { useState } from 'react';
import {
  useModerateReport,
  useReportedChat,
  useReports,
  useUnsuspendUser,
} from '../../hooks/useReports';
import { REPORT_REASONS, REPORT_STATUSES } from '../../services/reports';

const REASON_LABEL = Object.fromEntries(REPORT_REASONS.map((r) => [r.value, r.label]));
const TAB_LABEL = { pending: 'Pending', actioned: 'Suspended', dismissed: 'Dismissed' };
const STATUS_BADGE = {
  pending: 'badge-warning',
  actioned: 'badge-danger',
  dismissed: 'badge-muted',
};
const MAX_SUSPEND_REASON = 200;

function formatWhen(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function actionErrorMessage(error) {
  if (!error) return '';
  if (error.code === '42501') {
    return "You can't do that (for example, another moderator can't be suspended).";
  }
  if (error.code === '55000') {
    return 'This report was already handled. Refresh the list.';
  }
  return error.message || 'Something went wrong. Please try again.';
}

function Person({ label, person }) {
  return (
    <div>
      <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{label}</span>
      <p style={{ fontWeight: 600 }}>{person?.name || 'Unknown student'}</p>
      {person && (
        <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
          {person.branch || 'Branch not added'}
          {person.year ? ` · Year ${person.year}` : ''}
        </p>
      )}
    </div>
  );
}

function ReportedChat({ report }) {
  const { data: messages = [], isPending, error } = useReportedChat(report.request_id);

  if (isPending) return <p className="text-muted">Loading chat...</p>;
  if (error) {
    return (
      <p role="alert" style={{ color: '#f87171', fontSize: 'var(--text-sm)' }}>
        Could not load this chat: {error.message}
      </p>
    );
  }
  if (messages.length === 0) {
    return <p className="text-muted">No messages in this chat.</p>;
  }

  return (
    <div
      style={{
        maxHeight: 280,
        overflowY: 'auto',
        border: '1px solid rgba(128,128,128,0.25)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}
    >
      {messages.map((m) => {
        const byReporter = m.sender_id === report.reporter_id;
        const who = byReporter
          ? `Reporter${report.reporter?.name ? ` (${report.reporter.name})` : ''}`
          : `Reported${report.reported?.name ? ` (${report.reported.name})` : ''}`;
        return (
          <div key={m.id}>
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
              {who} · {formatWhen(m.created_at)}
            </span>
            <p style={{ fontSize: 'var(--text-sm)', whiteSpace: 'pre-wrap' }}>{m.content}</p>
          </div>
        );
      })}
    </div>
  );
}

function ReportCard({ report }) {
  const [showChat, setShowChat] = useState(false);
  const [mode, setMode] = useState(null); // null | 'dismiss' | 'suspend' | 'unsuspend'
  const [reason, setReason] = useState('');
  const moderate = useModerateReport();
  const unsuspend = useUnsuspendUser();

  const reportedName = report.reported?.name || 'this user';
  const busy = moderate.isPending || unsuspend.isPending;
  const error = moderate.error || unsuspend.error;

  const reset = () => {
    setMode(null);
    setReason('');
  };

  const confirmModeration = (action) => {
    moderate.mutate(
      { reportId: report.id, action, reason: action === 'suspend' ? reason : '' },
      { onSuccess: reset }
    );
  };

  const confirmUnsuspend = () => {
    unsuspend.mutate(report.reported_user_id, { onSuccess: reset });
  };

  return (
    <article className="glass-card" style={{ padding: 'var(--space-4)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <Person label="Reported by" person={report.reporter} />
          <Person label="Reported user" person={report.reported} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className={`badge ${STATUS_BADGE[report.status]}`}>
            {TAB_LABEL[report.status]}
          </span>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>
            {formatWhen(report.created_at)}
          </p>
        </div>
      </div>

      <p style={{ marginBottom: 'var(--space-2)' }}>
        <strong>Reason:</strong> {REASON_LABEL[report.reason] || report.reason}
      </p>
      {report.details && (
        <p
          className="text-secondary"
          style={{ whiteSpace: 'pre-wrap', marginBottom: 'var(--space-3)' }}
        >
          {report.details}
        </p>
      )}

      {report.moderated_at && (
        <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
          Handled {formatWhen(report.moderated_at)}
        </p>
      )}

      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => setShowChat((v) => !v)}
      >
        {showChat ? 'Hide chat' : 'View reported chat'}
      </button>
      {showChat && (
        <div style={{ marginTop: 'var(--space-3)' }}>
          <ReportedChat report={report} />
        </div>
      )}

      {error && (
        <p
          role="alert"
          style={{ color: '#f87171', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}
        >
          {actionErrorMessage(error)}
        </p>
      )}

      {/* Actions: pending */}
      {report.status === 'pending' && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          {mode === null && (
            <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setMode('dismiss')}>
                Dismiss
              </button>
              <button type="button" className="btn btn-danger" onClick={() => setMode('suspend')}>
                Suspend user
              </button>
            </div>
          )}

          {mode === 'dismiss' && (
            <div>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-3)' }}>
                Dismiss this report? {reportedName} stays active.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={busy}
                  onClick={() => confirmModeration('dismiss')}
                >
                  {busy ? 'Working...' : 'Confirm dismiss'}
                </button>
                <button type="button" className="btn btn-ghost" disabled={busy} onClick={reset}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {mode === 'suspend' && (
            <div>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-3)' }}>
                Suspend {reportedName}? They will not be able to send requests or messages
                or respond to requests until a moderator lifts it.
              </p>
              <textarea
                className="form-input"
                rows={2}
                maxLength={MAX_SUSPEND_REASON}
                placeholder="Reason (optional, saved with the suspension)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ marginBottom: 'var(--space-3)' }}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={busy}
                  onClick={() => confirmModeration('suspend')}
                >
                  {busy ? 'Working...' : 'Confirm suspend'}
                </button>
                <button type="button" className="btn btn-ghost" disabled={busy} onClick={reset}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions: suspended */}
      {report.status === 'actioned' && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          {mode === 'unsuspend' ? (
            <div>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-3)' }}>
                Lift the suspension for {reportedName}? It is safe to do this even if the
                suspension was already lifted.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={busy}
                  onClick={confirmUnsuspend}
                >
                  {busy ? 'Working...' : 'Confirm unsuspend'}
                </button>
                <button type="button" className="btn btn-ghost" disabled={busy} onClick={reset}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={() => setMode('unsuspend')}>
              Unsuspend {reportedName}
            </button>
          )}
          {unsuspend.isSuccess && mode === null && (
            <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
              Done. If {reportedName} was suspended, they can use SkillLink again.
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export default function ModerationPage() {
  const [status, setStatus] = useState('pending');
  const { data: reports = [], isPending, error, refetch } = useReports(status);

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header anim-fade-up">
          <span className="section-label">Moderation</span>
          <h1
            className="font-display"
            style={{ fontSize: 'var(--text-4xl)', marginTop: 'var(--space-2)' }}
          >
            Reports
          </h1>
          <p className="text-secondary" style={{ marginTop: 'var(--space-3)', maxWidth: 560 }}>
            You can only read chats that were reported. Please treat them as private, and
            act only on what the conversation shows.
          </p>
        </div>

        <div className="inbox-tabs">
          {REPORT_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={`inbox-tab ${status === s ? 'active' : ''}`}
              onClick={() => setStatus(s)}
            >
              {TAB_LABEL[s]}
              {status === s && reports.length > 0 && (
                <span className="tab-count">{reports.length}</span>
              )}
            </button>
          ))}
        </div>

        {isPending && <p>Loading reports...</p>}

        {error && (
          <div className="error-message" role="alert">
            Could not load reports: {error.message}
            <button type="button" onClick={() => refetch()}>Retry</button>
          </div>
        )}

        {!isPending && !error && reports.length === 0 && (
          <div className="empty-state glass-card">
            <div className="empty-state-icon">🛡️</div>
            <p className="empty-state-title">No {TAB_LABEL[status].toLowerCase()} reports</p>
          </div>
        )}

        {!isPending && !error && reports.length > 0 && (
          <div className="flex-col gap-4" style={{ display: 'flex' }}>
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}