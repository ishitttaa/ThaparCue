import { useState } from 'react';
import { useReportConversation } from '../hooks/useReports';
import {
  MAX_REPORT_DETAILS,
  REPORT_REASONS,
  reportErrorMessage,
} from '../services/reports';

export default function ReportModal({ requestId, otherName, onClose }) {
  const report = useReportConversation();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || report.isPending) return;
    report.mutate(
      { requestId, reason, details },
      { onSuccess: () => setDone(true) }
    );
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && !report.isPending && onClose()}
    >
      <div className="modal-box">
        {done ? (
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '3rem' }}>✅</div>
            <h3 className="font-display" style={{ fontSize: 'var(--text-xl)' }}>
              Report sent
            </h3>
            <p className="text-secondary">
              A moderator will review this conversation. Thank you for helping keep
              SkillLink safe.
            </p>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-header" style={{ marginBottom: 'var(--space-4)' }}>
              <h2 className="font-display" style={{ fontSize: 'var(--text-lg)', marginBottom: 2 }}>
                Report this conversation
              </h2>
              <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
                With {otherName || 'this student'}
              </p>
            </div>

            <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              A moderator will be able to read this chat to review your report. Please
              report only behaviour that is spam, harassment or inappropriate.
            </p>

            {report.error && (
              <div
                role="alert"
                style={{
                  background: 'var(--danger-dim)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3) var(--space-4)',
                  color: '#f87171',
                  fontSize: 'var(--text-sm)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                {reportErrorMessage(report.error)}
              </div>
            )}

            <div className="flex-col gap-4" style={{ display: 'flex' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="report-reason">
                  What is the problem?
                </label>
                <select
                  id="report-reason"
                  className="form-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select a reason…</option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="report-details">
                  Details (optional)
                </label>
                <textarea
                  id="report-details"
                  className="form-input"
                  rows={4}
                  maxLength={MAX_REPORT_DETAILS}
                  placeholder="Tell the moderator what happened…"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  style={{ resize: 'vertical', minHeight: 90 }}
                />
                <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                  {details.length}/{MAX_REPORT_DETAILS}
                </span>
              </div>
            </div>

            <div className="flex gap-3" style={{ marginTop: 'var(--space-6)', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
                disabled={report.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={!reason || report.isPending}
              >
                {report.isPending ? 'Sending...' : 'Send report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}