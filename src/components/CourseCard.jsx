import { Link } from 'react-router-dom';

const workloadColor = {
  Low: 'badge-success',
  Medium: 'badge-accent',
  'Medium-High': 'badge-warning',
  High: 'badge-danger',
};

export default function CourseCard({ course }) {
  const { id, code, name, workload, credits, aggregatedExperience, tags, year } = course;

  return (
    <Link to={`/course/${id}`} className="course-card glass-card">
      <div className="course-card-header">
        <div>
          <span className="course-code text-muted">{code}</span>
          <h3 className="course-name font-display">{name}</h3>
        </div>
        <span className={`badge ${workloadColor[workload] || 'badge-muted'}`}>{workload}</span>
      </div>

      <div className="course-card-meta">
        <span className="badge badge-muted">Year {year}</span>
        <span className="badge badge-muted">{credits} credits</span>
        <span className="badge badge-accent">⭐ {aggregatedExperience.avgRating.toFixed(1)}</span>
      </div>

      <div className="course-card-tags">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="course-card-footer">
        <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
          {aggregatedExperience.totalResponses} senior insights
        </span>
        <span className="text-accent" style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
          View details →
        </span>
      </div>
    </Link>
  );
}
