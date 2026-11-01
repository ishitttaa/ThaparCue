import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  useCourse,
  useCourseStudents,
  useMyCourseIds,
  useToggleMyCourse,
} from '../../hooks/useCourses';
import { toStudent } from '../../lib/students';
import SeniorCard from '../../components/SeniorCard';
import RequestModal from '../../components/RequestModal';

export default function CourseDetailPage() {
  const { id } = useParams(); // URL mein course ka code hai
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: course, isPending } = useCourse(id);
  const { data: people = [], isPending: peopleLoading } = useCourseStudents(course?.id);
  const { data: myCourseIds = [] } = useMyCourseIds();
  const toggle = useToggleMyCourse();
  const [requestTarget, setRequestTarget] = useState(null);

  // Apne aap ko list se hata do, senior year wale pehle
  const students = useMemo(
    () =>
      people
        .filter((p) => p.id !== user?.id)
        .map(toStudent)
        .sort((a, b) => (b.currentYear ?? 0) - (a.currentYear ?? 0)),
    [people, user?.id]
  );

  if (isPending) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <div className="empty-state-icon">📚</div>
          <p className="empty-state-title">Course not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/courses')}>
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const taken = myCourseIds.includes(course.id);

  return (
    <div className="page-content">
      <div className="container">
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 'var(--space-4)' }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* Header */}
        <div className="course-detail-header glass-card anim-fade-up">
          <div>
            <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
              {course.code}
            </span>
            <h1 className="font-display" style={{ fontSize: 'var(--text-3xl)', marginTop: 4 }}>
              {course.name}
            </h1>
            <div className="flex gap-2" style={{ marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
              <span className="badge badge-accent">Year {course.year}</span>
              <span className="badge badge-muted">
                {course.groups.length} branch{course.groups.length !== 1 ? 'es' : ''}
              </span>
            </div>
            <button
              type="button"
              className={`btn btn-sm ${taken ? 'btn-secondary' : 'btn-primary'}`}
              style={{ marginTop: 'var(--space-4)' }}
              disabled={toggle.isPending}
              onClick={() => toggle.mutate({ courseId: course.id, add: !taken })}
            >
              {taken ? "✓ I've taken this course" : "I've taken this course"}
            </button>
            {toggle.error && (
              <p role="alert" style={{ color: '#f87171', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                Could not update. Please try again.
              </p>
            )}
          </div>
          <div className="course-detail-header-stats">
            <div className="stat-block">
              <span className="stat-value">{people.length}</span>
              <span className="stat-label">Students took this</span>
            </div>
          </div>
        </div>

        <div className="course-detail-grid">
          {/* Left: about */}
          <div className="course-detail-main">
            <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-display section-title">Offered in</h2>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {course.groups.map((g) => (
                  <span key={g} className="tag">{g}</span>
                ))}
              </div>
              <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-4)' }}>
                Ratings, grade cutoffs and senior tips will show up here once students
                start sharing their experience.
              </p>
            </div>
          </div>

          {/* Right: students who took it */}
          <div className="anim-fade-up" style={{ animationDelay: '0.25s' }}>
            <h2 className="font-display" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
              Students who took this
            </h2>
            {peopleLoading ? (
              <p>Loading students...</p>
            ) : students.length === 0 ? (
              <div className="glass-card empty-state" style={{ padding: 'var(--space-6)' }}>
                <p className="empty-state-title">No one has added this course yet</p>
                <p className="empty-state-desc">
                  Add it to your profile and others can find you.
                </p>
              </div>
            ) : (
              <div className="flex-col gap-4" style={{ display: 'flex' }}>
                {students.map((s) => (
                  <SeniorCard key={s.id} senior={s} onRequest={setRequestTarget} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {requestTarget && (
        <RequestModal senior={requestTarget} onClose={() => setRequestTarget(null)} />
      )}
    </div>
  );
}