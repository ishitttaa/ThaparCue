export default function StudentStats({ student }) {
  const { rating, ratingCount, responseRate, reliabilityScore, isNew } = student;
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
      <span className="badge badge-accent">
        {ratingCount > 0 ? `⭐ ${rating.toFixed(1)} (${ratingCount})` : 'No ratings yet'}
      </span>
      <span className="badge badge-muted">
        {responseRate != null ? `${responseRate}% response rate` : 'No requests yet'}
      </span>
      <span className="badge badge-success">
        {reliabilityScore != null ? `Reliability ${reliabilityScore}/100` : isNew ? 'New' : '—'}
      </span>
    </div>
  );
}