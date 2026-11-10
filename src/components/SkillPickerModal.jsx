
import { useMemo, useState } from 'react';
import { LEVELS } from '../lib/skillLevels';
import ModalShell from './ModalShell';

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
      style={{
        padding: '6px 10px',
        minHeight: 36,
      }}
    >
      {LEVELS.map((level) => (
        <option key={level} value={level}>
          {level}
        </option>
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
    const byId = new Map(skills.map((skill) => [skill.id, skill]));

    return mySkillRows
      .map((row) => ({
        ...row,
        skill: byId.get(row.skill_id),
      }))
      .filter((row) => row.skill);
  }, [skills, mySkillRows]);

  const categories = useMemo(() => {
    const names = skills
      .filter((skill) => tab === 'all' || skill.kind === tab)
      .map((skill) => skill.category);

    return ['All', ...Array.from(new Set(names))];
  }, [skills, tab]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return skills
      .filter((skill) => tab === 'all' || skill.kind === tab)
      .filter(
        (skill) =>
          category === 'All' || skill.category === category
      )
      .filter(
        (skill) =>
          !q || skill.name.toLowerCase().includes(q)
      );
  }, [skills, tab, category, query]);

  const shown = filtered.slice(0, MAX_SHOWN);

  const typed = query.trim().replace(/\s+/g, ' ');

  const exists =
    skills.some(
      (skill) => skill.name.toLowerCase() === typed.toLowerCase()
    ) ||
    customSkills.some(
      (skill) => skill.name.toLowerCase() === typed.toLowerCase()
    );

  const canOfferCustom = typed.length > 0 && !exists;

  const total = mine.length + customSkills.length;

  const handleAddCustom = async () => {
    setLocalError('');

    if (!NAME_PATTERN.test(typed)) {
      setLocalError(
        'Use 2 to 40 letters or numbers (you can also use . + # / & ( ) , -).'
      );
      return;
    }

    try {
      await onAddCustom(typed);
      setQuery('');
    } catch {
      // Parent component handles the error.
    }
  };

  return (
    <ModalShell
      title="Select your skills"
      subtitle="Tap a skill to add it, then set how well you know it. Can't find yours? Type it and add it."
      onClose={onClose}
      footer={
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onClose}
        >
          Done
        </button>
      }
    >
      {/* Selected skills */}
      {total > 0 && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <p
            className="text-muted"
            style={{
              fontSize: 'var(--text-xs)',
              marginBottom: 6,
            }}
          >
            Your skills ({total})
          </p>

          <div
            style={{
              maxHeight: 190,
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
                <span style={{ fontWeight: 600 }}>
                  {row.skill.name}
                </span>

                <LevelSelect
                  value={row.level}
                  label={`Level for ${row.skill.name}`}
                  onChange={(level) =>
                    onSetLevel(row.skill_id, level)
                  }
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
                  <span
                    className="text-muted"
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                    }}
                  >
                    (yours)
                  </span>
                </span>

                <LevelSelect
                  value={row.level}
                  label={`Level for ${row.name}`}
                  onChange={(level) =>
                    onSetCustomLevel(row.id, level)
                  }
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

      {/* Skill category tabs */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-3)',
        }}
      >
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`btn btn-sm ${
              tab === item.value ? 'btn-primary' : 'btn-ghost'
            }`}
            onClick={() => {
              setTab(item.value);
              setCategory('All');
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Search and category filter */}
      <div
        style={{
          display: 'grid',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-3)',
        }}
      >
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
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === 'All' ? 'All categories' : item}
            </option>
          ))}
        </select>
      </div>

      {/* Add custom skill */}
      {canOfferCustom && (
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy}
          onClick={handleAddCustom}
          style={{
            textAlign: 'left',
            marginBottom: 'var(--space-3)',
          }}
        >
          + Add "{typed}" as your own skill
        </button>
      )}

      {/* Error message */}
      {(localError || error) && (
        <p
          role="alert"
          style={{
            color: '#f87171',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-2)',
          }}
        >
          {localError || error}
        </p>
      )}

      {/* Available skills */}
      <div
        style={{
          height: 'min(260px, 32vh)',
          minHeight: 160,
          overflowY: 'auto',
          border: '1px solid rgba(128,128,128,0.25)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        {shown.length === 0 ? (
          <p
            className="text-muted"
            style={{ padding: 'var(--space-4)' }}
          >
            No matching skills. You can add it as your own above.
          </p>
        ) : (
          shown.map((skill) => {
            const isSelected = selected.has(skill.id);

            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => onToggle(skill.id)}
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
                  background: isSelected
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
                    opacity: isSelected ? 1 : 0.4,
                  }}
                >
                  {isSelected ? '✓' : ''}
                </span>

                <span style={{ fontWeight: 600 }}>
                  {skill.name}
                </span>

                <span
                  className="text-muted"
                  style={{ fontSize: 'var(--text-xs)' }}
                >
                  {skill.category}
                </span>
              </button>
            );
          })
        )}
      </div>

      <p
        className="text-muted"
        style={{
          fontSize: 'var(--text-xs)',
          marginTop: 'var(--space-2)',
        }}
      >
        {filtered.length > MAX_SHOWN
          ? `Showing first ${MAX_SHOWN} of ${filtered.length}. Search or pick a category to narrow down.`
          : `${filtered.length} skills`}
      </p>
    </ModalShell>
  );
}
