import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { LEVELS } from '../lib/skillLevels';

const MAX_SHOWN = 150;
const NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 .+#/&(),-]{1,39}$/;

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'technical', label: 'Technical' },
  { value: 'soft', label: 'Soft skills' },
];

const rowBorder = '1px solid rgba(128,128,128,0.15)';

function LevelSelect({ value, onChange, label }) {
  return (
    <select
      className="form-select"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: '6px 10px', minHeight: 36 }}
    >
      {LEVELS.map((l) => (
        <option key={l} value={l}>{l}</option>
      ))}
    </select>
  );
}

export default function SkillPickerModal({
  skills = [],
  mySkillRows = [],
  customSkills = [],
  onToggle,
  onSetLevel,
  onAddCustom,
  onRemoveCustom,
  onSetCustomLevel,
  onClose,
  error = '',
  busy = false,
}) {
  const [tab, setTab] = useState('all');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [localError, setLocalError] = useState('');

  const selected = useMemo(
    () => new Set(mySkillRows.map((row) => row.skill_id)),
    [mySkillRows]
  );

  const mine = useMemo(() => {
    const byId = new Map(skills.map((s) => [s.id, s]));
    return mySkillRows
      .map((row) => ({ ...row, skill: byId.get(row.skill_id) }))
      .filter((row) => row.skill);
  }, [skills, mySkillRows]);

  const categories = useMemo(() => {
    const names = skills
      .filter((s) => tab === 'all' || s.kind === tab)
      .map((s) => s.category);
    return ['All', ...Array.from(new Set(names))];
  }, [skills, tab]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills
      .filter((s) => tab === 'all' || s.kind === tab)
      .filter((s) => category === 'All' || s.category === category)
      .filter((s) => !q || s.name.toLowerCase().includes(q));
  }, [skills, tab, category, query]);

  const shown = filtered.slice(0, MAX_SHOWN);

  const typed = query.trim().replace(/\s+/g, ' ');
  const exists =
    skills.some((s) => s.name.toLowerCase() === typed.toLowerCase()) ||
    customSkills.some((s) => s.name.toLowerCase() === typed.toLowerCase());
  const canOfferCustom = typed.length > 0 && !exists;

  const handleAddCustom = async () => {
    setLocalError('');
    if (!NAME_PATTERN.test(typed)) {
      setLocalError('Use 2 to 40 letters or numbers (you can also use . + # / & ( ) , -).');
      return;
    }
    try {
      await onAddCustom(typed);
      setQuery('');
    } catch {
      // error parent se dikhega
    }
  };

  const total = mine.length + customSkills.length;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-box"
        style={{
          width: 'min(560px, 94vw)',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'var(--space-3)',
            flexShrink: 0,
          }}
        >
          <div>
            <h2 className="font-display" style={{ fontSize: 'var(--text-xl)' }}>
              Select your skills
            </h2>
            <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginTop: 4 }}>
              Tap a skill to add it, then set your level. Can't find yours? Type it and add it.
            </p>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>

        {total > 0 && (
          <div style={{ flexShrink: 0 }}>
            <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 6 }}>
              Your skills ({total})
            </p>
            <div
              style={{
                maxHeight: 110,
                overflowY: 'auto',
                border: '1px solid rgba(128,128,128,0.25)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {mine.map((row) => (
                <div
                  key={row.skill_id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) 140px 36px',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)',
                    borderBottom: rowBorder,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{row.skill.name}</span>
                  <LevelSelect
                    value={row.level}
                    label={`Level for ${row.skill.name}`}
                    onChange={(level) => onSetLevel(row.skill_id, level)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label={`Remove ${row.skill.name}`}
                    onClick={() => onToggle(row.skill_id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {customSkills.map((row) => (
                <div
                  key={row.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) 140px 36px',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)',
                    borderBottom: rowBorder,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {row.name}{' '}
                    <span className="text-muted" style={{ fontSize: 'var(--text-xs)', fontWeight: 400 }}>
                      (yours)
                    </span>
                  </span>
                  <LevelSelect
                    value={row.level}
                    label={`Level for ${row.name}`}
                    onChange={(level) => onSetCustomLevel(row.id, level)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label={`Remove ${row.name}`}
                    onClick={() => onRemoveCustom(row.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', flexShrink: 0 }}>
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`btn btn-sm ${tab === t.value ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                setTab(t.value);
                setCategory('All');
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-2)', flexShrink: 0 }}>
          <input
            className="form-input"
            placeholder="Search skills… e.g. python, public speaking"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLocalError('');
            }}
          />
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All categories' : c}
              </option>
            ))}
          </select>
        </div>

        {canOfferCustom && (
          <button
            type="button"
            className="btn btn-secondary"
            disabled={busy}
            onClick={handleAddCustom}
            style={{ textAlign: 'left', flexShrink: 0 }}
          >
            + Add "{typed}" as your own skill
          </button>
        )}

        {(localError || error) && (
          <p role="alert" style={{ color: '#f87171', fontSize: 'var(--text-sm)', flexShrink: 0 }}>
            {localError || error}
          </p>
        )}

        {/* List: 264px (6 rows) tak, chhoti screen pe khud sikud jaati hai */}
        <div
          style={{
            flex: '1 1 264px',
            minHeight: 132,
            maxHeight: 264,
            overflowY: 'auto',
            border: '1px solid rgba(128,128,128,0.25)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {shown.length === 0 ? (
            <p className="text-muted" style={{ padding: 'var(--space-4)' }}>
              No matching skills. You can add it as your own above.
            </p>
          ) : (
            shown.map((s) => {
              const on = selected.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onToggle(s.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '22px minmax(0, 1fr) auto',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    width: '100%',
                    minHeight: 44,
                    padding: 'var(--space-2) var(--space-3)',
                    textAlign: 'left',
                    color: 'inherit',
                    cursor: 'pointer',
                    border: 'none',
                    borderBottom: rowBorder,
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
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                  <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                    {s.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <p className="text-muted" style={{ fontSize: 'var(--text-xs)', flexShrink: 0 }}>
          {filtered.length > MAX_SHOWN
            ? `Showing first ${MAX_SHOWN} of ${filtered.length}. Search or pick a category to narrow down.`
            : `${filtered.length} skills`}
        </p>
      </div>
    </div>,
    document.body
  );
}