import { workload, WORKLOAD_BADGE } from '../lib/courseInfo';

function Row({ label, children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '150px minmax(0, 1fr)',
        gap: 'var(--space-3)',
        padding: 'var(--space-2) 0',
        borderBottom: '1px solid rgba(128,128,128,0.15)',
      }}
    >
      <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>{label}</span>
      <span>{children}</span>
    </div>
  );
}

const NA = <span className="text-muted">Not available yet</span>;

export default function CourseInfoCard({ course }) {
  const w = workload(course);

  return (
    <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.1s' }}>
      <h2 className="font-display section-title">Course info</h2>

      <Row label="Credits">{course.credits != null ? course.credits : NA}</Row>

      <Row label="Weekly hours (L-T-P)">
        {w ? (
          <>
            {course.l}-{course.t}-{course.p} · {w.hours} hrs/week{' '}
            <span className={`badge ${WORKLOAD_BADGE[w.label]}`}>{w.label} workload</span>
          </>
        ) : (
          NA
        )}
      </Row>

      <Row label="Assessment">{course.assessment || NA}</Row>
      <Row label="Prerequisites">{course.prerequisites || NA}</Row>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>
          Offered in
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {course.groups.map((g) => (
            <span key={g} className="tag">{g}</span>
          ))}
        </div>
      </div>

      {w && (
        <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>
          Workload is based on weekly class hours (lectures, tutorials, practicals), not on how
          difficult the course is. Student experience will show up below once students share it.
        </p>
      )}
    </div>
  );
}