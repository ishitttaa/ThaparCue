import { Link } from 'react-router-dom';

export default function CourseListCard({ course }) {
  const { code, name, year, groups } = course;
  const where =
    groups.length === 1 ? groups[0] : `${groups.length} branches`;

  return (
    <Link
      to={`/course/${code}`}
      className="glass-card"
      style={{
        display: 'block',
        padding: 'var(--space-4)',
        height: '100%',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
        {code}
      </span>
      <h3 className="font-display" style={{ fontSize: 'var(--text-lg)', margin: '4px 0 var(--space-3)' }}>
        {name}
      </h3>
      <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
        <span className="badge badge-accent">Year {year}</span>
        <span className="badge badge-muted">{where}</span>
      </div>
    </Link>
  );
}