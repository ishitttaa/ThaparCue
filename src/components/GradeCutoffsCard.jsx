import { useState } from 'react';
import {
  useDeleteCutoff,
  useGradeCutoffs,
  useMyCutoffs,
  useSaveCutoffs,
} from '../hooks/useCourseInsights';
import {
  GRADES,
  SEMESTERS,
  defaultSemester,
  insightErrorMessage,
  semesterLabel,
  yearChoices,
} from '../lib/courseInsights';

const num = (v) => (v == null ? '–' : Number(v));
const CONFIDENCE_BADGE = { high: 'badge-success', medium: 'badge-accent', low: 'badge-warning' };

function CutoffModal({ course, initial, onClose }) {
  const years = yearChoices();
  const save = useSaveCutoffs(course.id);
  const [year, setYear] = useState(initial?.taken_year ?? years[0]);
  const [semester, setSemester] = useState(initial?.taken_semester ?? defaultSemester());
  const [values, setValues] = useState(() =>
    Object.fromEntries(GRADES.map((g) => [g.key, initial?.[g.key] != null ? String(initial[g.key]) : '']))
  );
  const [localError, setLocalError] = useState('');
  const editing = !!initial;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    const parsed = Object.fromEntries(
      GRADES.map((g) => [g.key, values[g.key].trim() === '' ? null : Number(values[g.key])])
    );
    const filled = GRADES.map((g) => parsed[g.key]).filter((v) => v != null);

    if (filled.length === 0) return setLocalError('Enter at least one cutoff.');
    if (filled.some((v) => Number.isNaN(v) || v < 0 || v > 100)) {
      return setLocalError('Cutoffs must be numbers between 0 and 100.');
    }
    for (let i = 1; i < filled.length; i += 1) {
      if (filled[i] > filled[i - 1]) {
        return setLocalError('Cutoffs must go down from O to C (for example O 85, A+ 75, A 65).');
      }
    }

    save.mutate(
      { courseId: course.id, takenYear: Number(year), takenSemester: semester, values: parsed },
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
              {initial ? 'Edit your cutoffs' : 'Add grade cutoffs'}
            </h2>
            <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
              {course.code} · {course.name}
            </p>
          </div>

          <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            Enter the minimum marks (out of 100) needed for each grade in your batch. You can
            leave a grade empty if you do not know it. Only add numbers you are sure about.
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

          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="form-label" htmlFor="cutoff-year">Batch (when you took it)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '110px minmax(0, 1fr)', gap: 'var(--space-2)' }}>
              <select id="cutoff-year" className="form-select" value={year} onChange={(e) => setYear(e.target.value)} disabled={editing}>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select className="form-select" value={semester} onChange={(e) => setSemester(e.target.value)} aria-label="Semester" disabled={editing}>
                {SEMESTERS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            {editing && (
              <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                To change the batch, delete this entry and add a new one.
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-3)' }}>
            {GRADES.map((g) => (
              <div key={g.key} className="form-group">
                <label className="form-label" htmlFor={`cutoff-${g.key}`}>{g.label}</label>
                <input
                  id={`cutoff-${g.key}`}
                  className="form-input"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.5"
                  placeholder="–"
                  value={values[g.key]}
                  onChange={(e) => setValues((cur) => ({ ...cur, [g.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3" style={{ marginTop: 'var(--space-6)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={save.isPending}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={save.isPending}>
              {save.isPending ? 'Saving...' : 'Save cutoffs'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GradeCutoffsCard({ course, taken }) {
  const { data: rows = [], isPending, error } = useGradeCutoffs(course.id);
  const { data: mine = [] } = useMyCutoffs(course.id);
  const remove = useDeleteCutoff(course.id);
  const [modal, setModal] = useState(null); // null | { initial }

  const handleDelete = (entry) => {
    if (window.confirm(`Delete your cutoffs for ${entry.taken_year} (${semesterLabel(entry.taken_semester)})?`)) {
      remove.mutate(entry.id);
    }
  };

  return (
    <div className="glass-card profile-section anim-fade-up" style={{ marginTop: 'var(--space-6)' }}>
      <div className="section-header-row">
        <h2 className="font-display section-title">Grade cutoffs</h2>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={!taken}
          title={taken ? '' : 'Mark this course as taken first'}
          onClick={() => setModal({ initial: null })}
        >
          Add cutoffs
        </button>
      </div>

      {!taken && (
        <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
          Mark this course as taken (button at the top) to add cutoffs from your batch.
        </p>
      )}

      {isPending ? (
        <p className="text-muted">Loading cutoffs...</p>
      ) : error ? (
        <p role="alert" style={{ color: '#f87171', fontSize: 'var(--text-sm)' }}>
          Could not load cutoffs: {error.message}
        </p>
      ) : rows.length === 0 ? (
        <p className="text-muted">
          No cutoffs shared yet. If you took this course, add the marks needed for each grade in
          your batch.
        </p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="grade-table">
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Entries</th>
                  {GRADES.map((g) => (
                    <th key={g.key}>{g.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.taken_year}-${r.taken_semester}`} className={r.is_past_batch ? '' : 'grade-row-fresh'}>
                    <td>
                      {r.taken_year} · {semesterLabel(r.taken_semester)}
                      <br />
                      {r.is_past_batch && <span className="badge badge-muted">Past batch data</span>}{' '}
                      {r.confidence && (
                        <span className={`badge ${CONFIDENCE_BADGE[r.confidence] || 'badge-muted'}`}>
                          {r.confidence} confidence
                        </span>
                      )}
                    </td>
                    <td>{r.submissions}</td>
                    {GRADES.map((g) => (
                      <td key={g.key} title={`${r.counts?.[g.key] ?? 0} entries`}>
                        {num(r.medians?.[g.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>
            Minimum marks out of 100, as the median of what students reported. These come from
            students, so check the number of entries, and remember cutoffs change from batch to batch.
          </p>
        </>
      )}

      {mine.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid rgba(128,128,128,0.2)' }}>
          <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>
            Your entries
          </p>
          {mine.map((entry) => (
            <div
              key={entry.id}
              style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}
            >
              <span>
                {entry.taken_year} · {semesterLabel(entry.taken_semester)}
              </span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModal({ initial: entry })}>
                Edit
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleDelete(entry)} disabled={remove.isPending}>
                Delete
              </button>
            </div>
          ))}
          {remove.error && (
            <p role="alert" style={{ color: '#f87171', fontSize: 'var(--text-sm)' }}>
              {insightErrorMessage(remove.error)}
            </p>
          )}
        </div>
      )}

      {modal && <CutoffModal course={course} initial={modal.initial} onClose={() => setModal(null)} />}
    </div>
  );
}
