import { Link } from 'react-router-dom';

function parseRequestMessage(raw = '') {
  const topic = raw.match(/^Topic:\s*(.+)$/m)?.[1].trim() ?? '';
  const courseId = raw.match(/^Course ID:\s*(.+)$/m)?.[1].trim() ?? '';
  const message = raw
    .replace(/^Topic:\s*.+\n?/m, '')
    .replace(/^Course ID:\s*.+\n?/m, '')
    .trim();
  return { topic, courseId, message };
}

export default function RequestCard({ request, userId, busy, onRespond }) {
  const sentByMe = request.from_user === userId;
  const other = sentByMe ? request.receiver : request.sender;
  const { topic, courseId, message } = parseRequestMessage(request.message || '');
  const date = new Date(request.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });

  return (
    <article className="request-card">
      <div className="request-card-header">
        <div className="request-avatar">
          {(other?.name || '?').charAt(0).toUpperCase()}
        </div>

        <div className="request-person">
          <h3>{other?.name || 'Student'}</h3>
          <p>{sentByMe ? 'Sent by you' : 'Received by you'} · {date}</p>
          {other?.branch && <p>{other.branch}</p>}
        </div>

        <span className={`status-badge ${request.status}`}>{request.status}</span>
      </div>

      <div className="request-details">
        {topic && <p><strong>Topic:</strong> {topic}</p>}
        {courseId && <p><strong>Course ID:</strong> {courseId}</p>}
        {message && <p className="request-message">{message}</p>}
      </div>

      {!sentByMe && request.status === 'pending' && (
        <div className="request-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy}
            onClick={() => onRespond(request.id, 'accepted')}
          >
            {busy ? 'Updating...' : 'Accept'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={busy}
            onClick={() => onRespond(request.id, 'rejected')}
          >
            Reject
          </button>
        </div>
      )}

      {request.status === 'accepted' && (
        <div className="request-actions">
          <Link to={`/inbox/${request.id}`} className="btn btn-primary">
            Open Chat →
          </Link>
        </div>
      )}
    </article>
  );
}