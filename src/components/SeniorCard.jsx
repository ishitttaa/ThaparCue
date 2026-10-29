import { Link } from 'react-router-dom';

export default function SeniorCard({ senior, onRequest }) {
  const {
    id,
    name,
    branch,
    isAlumni,
    currentYear,
    reliabilityScore,
    responseRate,
    avgResponseTime,
    skills = [],
    rating,
    totalInteractions,
    initials,
    colorHue,
    bio,
  } = senior;

  const hasStats = rating != null;
  const isRealProfile =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  return (
    <div className="senior-card glass-card">
      <div className="senior-card-header">
        <div className="senior-card-avatar">
          <div
            className="avatar-placeholder avatar-lg"
            style={{
              background: `linear-gradient(135deg, hsl(${colorHue},70%,55%), hsl(${colorHue + 40},70%,45%))`,
              fontSize: '1.1rem',
            }}
          >
            {initials}
          </div>
          {reliabilityScore >= 90 && (
            <span className="senior-verified-badge" title="Top Contributor">✦</span>
          )}
        </div>
        <div className="senior-card-info">
          <div className="flex items-center gap-2">
            <h3 className="senior-card-name font-display">{name}</h3>
            {isAlumni && <span className="badge badge-success">Alumni</span>}
            {!isAlumni && currentYear && (
              <span className="badge badge-accent">Y{currentYear}</span>
            )}
          </div>
          <p className="senior-card-branch text-secondary">{branch}</p>
          {hasStats && (
            <div className="senior-card-stats">
              <span className="senior-stat">
                <span className="senior-stat-val">⭐ {rating.toFixed(1)}</span>
              </span>
              <span className="senior-stat-sep">·</span>
              <span className="senior-stat">
                <span className="senior-stat-val">{responseRate}%</span>
                <span className="senior-stat-lbl"> response</span>
              </span>
              <span className="senior-stat-sep">·</span>
              <span className="senior-stat">
                <span className="senior-stat-val">{avgResponseTime}</span>
              </span>
              <span className="senior-stat-sep">·</span>
              <span className="senior-stat">
                <span className="senior-stat-lbl">{totalInteractions} guided</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="senior-card-bio text-secondary">{bio}</p>

      {skills.length > 0 && (
        <div className="senior-card-skills">
          {skills.slice(0, 3).map((sk) => (
            <span key={sk.name} className="tag">
              {sk.name}
              {sk.proficiency === 'Expert' && (
                <span style={{ color: 'var(--accent-light)' }}> ★</span>
              )}
            </span>
          ))}
          {skills.length > 3 && <span className="tag">+{skills.length - 3} more</span>}
        </div>
      )}

      <div className="senior-card-footer">
        {reliabilityScore != null && (
          <div className="senior-card-reliability">
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Reliability</span>
            <div className="flex items-center gap-2">
              <div className="progress-bar-track" style={{ width: '80px' }}>
                <div className="progress-bar-fill" style={{ width: `${reliabilityScore}%` }} />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-accent)', fontWeight: 600 }}>
                {reliabilityScore}
              </span>
            </div>
          </div>
        )}
        <div className="senior-card-actions">
         {isRealProfile ? (
          <>
            <Link to={`/senior/${id}`} className="btn btn-ghost btn-sm">
              View Profile
            </Link>
            {onRequest && (
              <button className="btn btn-primary btn-sm" onClick={() => onRequest(senior)}>
                Request
              </button>
            )}
          </>
        ) : (
          <span className="badge badge-muted">Sample profile</span>
        )}
      </div>
      </div>
    </div>
  );
}