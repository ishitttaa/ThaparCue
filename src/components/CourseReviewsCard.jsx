import { useState } from 'react';
import {
  useDeleteReview,
  useMyReview,
  useReviewStats,
  useSaveReview,
} from '../hooks/useCourseInsights';
import {
  MAX_REVIEW_TAGS,
  REVIEW_TAGS,
  SEMESTERS,
  defaultSemester,
  insightErrorMessage,
  semesterLabel,
  tagLabel,
  yearChoices,
} from '../lib/courseInsights';

const DIFFICULTY = ['Very easy', 'Easy', 'Medium', 'Hard', 'Very hard'];
const WORKLOAD = ['Very light', 'Light', 'Moderate', 'Heavy', 'Very heavy'];
const fmt = (v) => (v == null ? '–' : Number(v).toFixed(1));

function ScalePicker({ label, value, onChange, names }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {names.map((name, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              type="button"
              className={`btn btn-sm ${value === n ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => onChange(n)}
            >
              {n} · {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReviewModal({ course, initial, onClose }) {
  const years = yearChoices();
  const save = useSaveReview(course.id);
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? 0);
  const [workload, setWorkload] = useState(initial?.workload ?? 0);
  const [tags, setTags] = useState(initial?.tags ?? []);
  const [year, setYear] = useState(initial?.taken_year ?? years[0]);
  const [semester, setSemester] = useState(initial?.taken_semester ?? defaultSemester());
  const [localError, setLocalError] = useState('');

  const toggleTag = (slug) =>
    setTags((current) =>
      current.includes(slug)
        ? current.filter((t) => t !== slug)
        : current.length >= MAX_REVIEW_TAGS
        ? current
        : [...current, slug]
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    if (!difficulty || !workload) {
      setLocalError('Please choose both difficulty and workload.');
      return;
    }
    save.mutate(
      {
        courseId: course.id,
        difficulty,
        workload,
        tags,
        takenYear: Number(year),
        takenSemester: semester,
      },
      { onSuccess: onClose }
    );
  };

  const error = localError || (save.error ? insightErrorMessage(save.error) : '');

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && !save.isPending && onClose()}
    >
      <div className="modal-box" style={{ maxHeight: '92vh', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header" style={{ marginBottom: 'var(--space-4)' }}>
            <h2 className="font-display" style={{ fontSize: 'var(--text-lg)', marginBottom: 2 }}>
              {initial ? 'Edit your review' : 'Review this course'}
            </h2>
            <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
              {course.code} · {course.name}
            </p>
          </div>

          <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            Reviews are anonymous and only show up as averages once enough students have
            reviewed the course.
          </p>

          {error && (
            <div
              role="alert"
              style={{
                background: 'var(--danger-dim)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3) var(--space-4)',
                color: '#f87171',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-4)',
              }}
            >
              {error}
            </div>
          )}

          <div className="flex-col gap-4" style={{ display: 'flex' }}>
            <ScalePicker label="How difficult was it?" value={difficulty} onChange={setDifficulty} names={DIFFICULTY} />
            <ScalePicker label="How heavy was the workload?" value={workload} onChange={setWorkload} names={WORKLOAD} />

            <div className="form-group">
              <label className="form-label">
                Tags (up to {MAX_REVIEW_TAGS}) · {tags.length} selected
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {REVIEW_TAGS.map((t) => {
                  const on = tags.includes(t.value);
                  const locked = !on && tags.length >= MAX_REVIEW_TAGS;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      className={`tag ${on ? 'active' : ''}`}
                      disabled={locked}
                      style={{ cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? 0.5 : 1 }}
                      onClick={() => toggleTag(t.value)}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="review-year">When did you take it?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '110px minmax(0, 1fr)', gap: 'var(--space-2)' }}>
                <select id="review-year" className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <select className="form-select" value={semester} onChange={(e) => setSemester(e.target.value)} aria-label="Semester">
                  {SEMESTERS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3" style={{ marginTop: 'var(--space-6)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={save.isPending}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={save.isPending}>
              {save.isPending ? 'Saving...' : initial ? 'Save changes' : 'Submit review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SplitColumn({ title, part, min }) {
  const count = part?.count ?? 0;
  return (
    <div style={{ flex: '1 1 160px' }}>
      <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{title}</p>
      {count < min ? (
        <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
          Not enough yet ({count} of {min})
        </p>
      ) : (
        <p style={{ fontWeight: 600 }}>
          Difficulty {fmt(part.avg_difficulty)} · Workload {fmt(part.avg_workload)}
          <span className="text-muted" style={{ fontWeight: 400 }}> · {count} reviews</span>
        </p>
      )}
    </div>
  );
}

export default function CourseReviewsCard({ course, taken }) {
  const { data: stats, isPending, error } = useReviewStats(course.id);
  const { data: mine } = useMyReview(course.id);
  const remove = useDeleteReview(course.id);
  const [open, setOpen] = useState(false);

  const total = stats?.total_count ?? 0;
  const min = stats?.min_reviews ?? 3;

  const handleDelete = () => {
    if (window.confirm('Delete your review of this course?')) remove.mutate(mine.id);
  };

  return (
    <div className="glass-card profile-section anim-fade-up" style={{ marginTop: 'var(--space-6)' }}>
      <div className="section-header-row">
        <h2 className="font-display section-title">Student experience</h2>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={!taken}
          title={taken ? '' : 'Mark this course as taken first'}
          onClick={() => setOpen(true)}
        >
          {mine ? 'Edit your review' : 'Add your review'}
        </button>
      </div>

      {!taken && (
        <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
          Mark this course as taken (button at the top) to add your own experience.
        </p>
      )}

      {isPending ? (
        <p className="text-muted">Loading reviews...</p>
      ) : error ? (
        <p role="alert" style={{ color: '#f87171', fontSize: 'var(--text-sm)' }}>
          Could not load reviews: {error.message}
        </p>
      ) : total < min ? (
        <p className="text-muted">
          Not enough reviews yet ({total} of {min}). Averages appear once {min} students have
          reviewed this course, so nobody can be identified.
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
            <div>
              <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Difficulty</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{fmt(stats.avg_difficulty)}<span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}> / 5</span></p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Workload</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{fmt(stats.avg_workload)}<span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}> / 5</span></p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Reviews</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{total}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
            <SplitColumn title="Recent (last 2 years)" part={stats.recent} min={min} />
            <SplitColumn title="Earlier batches" part={stats.older} min={min} />
          </div>

          {(stats.tags ?? []).length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {stats.tags.map((t) => (
                <span key={t.tag} className="tag">
                  {tagLabel(t.tag)} · {t.count}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {mine && (
        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid rgba(128,128,128,0.2)' }}>
          <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
            Your review: difficulty {mine.difficulty}/5, workload {mine.workload}/5 · taken{' '}
            {mine.taken_year} ({semesterLabel(mine.taken_semester)})
          </p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleDelete} disabled={remove.isPending}>
            {remove.isPending ? 'Deleting...' : 'Delete my review'}
          </button>
          {remove.error && (
            <p role="alert" style={{ color: '#f87171', fontSize: 'var(--text-sm)' }}>
              {insightErrorMessage(remove.error)}
            </p>
          )}
        </div>
      )}

      {open && <ReviewModal course={course} initial={mine} onClose={() => setOpen(false)} />}
    </div>
  );
}
