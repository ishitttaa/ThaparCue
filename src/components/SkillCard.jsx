export default function SkillCard({ skill, count = 0, active = false, mine = false, onClick }) {
  const { name, category, kind } = skill;

  return (
    <div
      className="skill-card glass-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={{
        cursor: 'pointer',
        height: '100%',
        outline: active ? '2px solid var(--accent-light, currentColor)' : 'none',
      }}
    >
      <div className="skill-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="skill-name font-display">{name}</h3>
          <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
            {category}
          </span>
        </div>
        {mine && <span className="badge badge-success">You</span>}
      </div>

      <div className="skill-footer">
        <span className="badge badge-muted">
          {kind === 'soft' ? 'Soft skill' : 'Technical'}
        </span>
        <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
          {count > 0 ? `${count} student${count > 1 ? 's' : ''}` : 'No students yet'}
        </span>
      </div>
    </div>
  );
}