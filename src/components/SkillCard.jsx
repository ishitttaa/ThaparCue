import { Link } from 'react-router-dom';

const demandColors = {
  'Very High': 'badge-danger',
  High: 'badge-warning',
  'Medium-High': 'badge-accent',
  Medium: 'badge-accent',
  'Low-Medium': 'badge-muted',
  Low: 'badge-muted',
};

export default function SkillCard({ skill, onClick }) {
  const { id, name, category, icon, description, seniorIds, demandLevel, useCases } = skill;

  return (
    <div
      className="skill-card glass-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="skill-card-header">
        <span className="skill-icon">{icon}</span>
        <div>
          <h3 className="skill-name font-display">{name}</h3>
          <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{category}</span>
        </div>
        <span className={`badge ${demandColors[demandLevel] || 'badge-muted'} skill-demand`}>
          {demandLevel}
        </span>
      </div>

      <p className="skill-desc text-secondary">{description}</p>

      <div className="skill-use-cases">
        {useCases.slice(0, 3).map((u) => (
          <span key={u} className="tag">{u}</span>
        ))}
      </div>

      <div className="skill-footer">
        <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
          {seniorIds.length > 0
            ? `${seniorIds.length} senior${seniorIds.length > 1 ? 's' : ''} available`
            : 'No seniors yet'}
        </span>
        {seniorIds.length > 0 && (
          <Link
            to={`/skills#${id}`}
            className="text-accent"
            style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}
            onClick={(e) => e.stopPropagation()}
          >
            Find seniors →
          </Link>
        )}
      </div>
    </div>
  );
}
