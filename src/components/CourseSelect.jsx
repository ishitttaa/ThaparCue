import { useMemo, useState } from 'react';

const MAX_SHOWN = 6;

export default function CourseSelect({
  courses = [],
  suggestedIds = [],
  suggestedLabel = 'Taken by them',
  value,
  onChange,
}) {
  const [query, setQuery] = useState('');
  const suggested = useMemo(() => new Set(suggestedIds), [suggestedIds]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = courses.filter(
      (c) =>
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    );
    // Jo course unhone kiye hain wo sabse pehle
    matches.sort(
      (a, b) =>
        Number(suggested.has(b.id)) - Number(suggested.has(a.id)) ||
        a.code.localeCompare(b.code)
    );
    // Search khali ho aur unke courses hon, to sirf wahi dikhao
    const base =
      !q && suggested.size > 0 ? matches.filter((c) => suggested.has(c.id)) : matches;
    return base.slice(0, MAX_SHOWN);
  }, [courses, query, suggested]);

  if (value) {
    return (
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-2) var(--space-3)',
        }}
      >
        <span>
          <strong>{value.code}</strong> · {value.name}
        </span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => onChange(null)}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        className="form-input"
        placeholder="Search a course by code or name… (optional)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {(query.trim() || suggested.size > 0) && (
        <div
          style={{
            marginTop: 'var(--space-2)',
            maxHeight: 220,
            overflowY: 'auto',
            border: '1px solid rgba(128,128,128,0.25)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {results.length === 0 ? (
            <p className="text-muted" style={{ padding: 'var(--space-3)' }}>
              No matching courses.
            </p>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onChange(c);
                  setQuery('');
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '84px minmax(0, 1fr) auto',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  width: '100%',
                  minHeight: 44,
                  padding: 'var(--space-2) var(--space-3)',
                  textAlign: 'left',
                  color: 'inherit',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(128,128,128,0.15)',
                }}
              >
                <span style={{ fontWeight: 600 }}>{c.code}</span>
                <span>{c.name}</span>
                {suggested.has(c.id) && (
                  <span className="badge badge-success">{suggestedLabel}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
      {!query.trim() && suggested.size === 0 && (
        <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>
          Type to search all courses.
        </p>
      )}
    </div>
  );
}