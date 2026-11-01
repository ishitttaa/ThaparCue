import { useState } from 'react';
import CoursePickerModal from './CoursePickerModal';
import {
  useCourses,
  useMyCourseIds,
  useToggleMyCourse,
} from '../hooks/useCourses';

export default function CoursesTakenCard({ branch }) {
  const { data: allCourses = [] } = useCourses();
  const { data: myCourseIds = [] } = useMyCourseIds();
  const toggle = useToggleMyCourse();
  const [open, setOpen] = useState(false);

  const mine = allCourses
    .filter((c) => myCourseIds.includes(c.id))
    .sort((a, b) => a.year - b.year || a.code.localeCompare(b.code));

  return (
    <div className="glass-card profile-section anim-fade-up">
      <div className="section-header-row">
        <h2 className="font-display section-title">Courses Taken</h2>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setOpen(true)}
        >
          {mine.length > 0 ? 'Edit courses' : '+ Add courses'}
        </button>
      </div>

      {mine.length === 0 ? (
        <p className="text-muted">
          No courses added yet. Adding them helps others find you.
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {mine.map((c) => (
            <span key={c.id} className="tag" title={c.name}>
              {c.code} · {c.name}
            </span>
          ))}
        </div>
      )}

      {toggle.error && (
        <p
          role="alert"
          style={{ color: '#f87171', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}
        >
          Could not update courses. Please try again.
        </p>
      )}

      {open && (
        <CoursePickerModal
          courses={allCourses}
          selectedIds={myCourseIds}
          defaultBranch={branch}
          onClose={() => setOpen(false)}
          onToggle={(courseId) =>
            toggle.mutate({ courseId, add: !myCourseIds.includes(courseId) })
          }
        />
      )}
    </div>
  );
}