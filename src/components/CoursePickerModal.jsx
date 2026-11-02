import { useMemo, useState } from 'react';
import { BRANCHES } from '../lib/branches';

const MAX_SHOWN = 120;

export default function CoursePickerModal({
  courses = [],
  selectedIds = [],
  onToggle,
  onClose,
  defaultBranch = '',
}) {
  const [branch, setBranch] = useState(
    BRANCHES.includes(defaultBranch) ? defaultBranch : 'All'
  );
  const [year, setYear] = useState('All');
  const [query, setQuery] = useState('');

  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedCourses = useMemo(
    () => courses.filter((c) => selected.has(c.id)),
    [courses, selected]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter((c) => branch === 'All' || c.groups.includes(branch))
      .filter((c) => year === 'All' || c.year === Number(year))
      .filter(
        (c) =>
          !q ||
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q)
      )
      .sort((a, b) => a.year - b.year || a.code.localeCompare(b.code));
  }, [courses, branch, year, query]);

  const shown = filtered.slice(0, MAX_SHOWN);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-box"
        style={{
          width: 'min(680px, 94vw)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'var(--space-3)',
          }}
        >
          <div>
            <h2 className="font-display" style={{ fontSize: 'var(--text-xl)' }}>
              Select your courses
            </h2>
            <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginTop: 4 }}>
              Tap a course to select it. Tap again to remove it.
            </p>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>

        {/* Selected chips */}
        {selectedCourses.length > 0 && (
          <div>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 6 }}>
              Selected ({selectedCourses.length})
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                maxHeight: 84,
                overflowY: 'auto',
              }}
            >
              {selectedCourses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="tag"
                  title={`Remove ${c.name}`}
                  onClick={() => onToggle(c.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {c.code} ✕
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <input
            className="form-input"
            placeholder="Search by code or name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 130px',
              gap: 'var(--space-2)',
            }}
          >
            <select
              className="form-select"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="All">All branches</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="All">All years</option>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course list */}
        <div
          style={{
            height: 'min(340px, 40vh)',
            overflowY: 'auto',
            border: '1px solid rgba(128,128,128,0.25)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {shown.length === 0 ? (
            <p className="text-muted" style={{ padding: 'var(--space-4)' }}>
              No courses found. Try "All branches" or a different search.
            </p>
          ) : (
            shown.map((c) => {
              const on = selected.has(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onToggle(c.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '22px 84px minmax(0, 1fr) auto',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    width: '100%',
                    minHeight: 46,
                    padding: 'var(--space-2) var(--space-3)',
                    textAlign: 'left',
                    color: 'inherit',
                    cursor: 'pointer',
                    border: 'none',
                    borderBottom: '1px solid rgba(128,128,128,0.15)',
                    background: on
                      ? 'var(--accent-dim, rgba(128,32,48,0.12))'
                      : 'transparent',
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      display: 'grid',
                      placeItems: 'center',
                      border: '1.5px solid currentColor',
                      borderRadius: 5,
                      fontSize: 13,
                      fontWeight: 700,
                      opacity: on ? 1 : 0.4,
                    }}
                  >
                    {on ? '✓' : ''}
                  </span>
                  <span style={{ fontWeight: 600 }}>{c.code}</span>
                  <span>{c.name}</span>
                  <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                    Year{c.year}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
          {filtered.length > MAX_SHOWN
            ? `Showing first ${MAX_SHOWN} of ${filtered.length}. Search or filter to narrow down.`
            : `${filtered.length} courses`}
        </p>
      </div>
    </div>
  );
}