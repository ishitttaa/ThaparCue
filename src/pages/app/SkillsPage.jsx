import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useMySkillIds,
  useSkillCounts,
  useSkills,
  useToggleMySkill,
} from '../../hooks/useSkills';
import { useStudentsWithSkill } from '../../hooks/useProfiles';
import SkillCard from '../../components/SkillCard';
import SeniorCard from '../../components/SeniorCard';
import RequestModal from '../../components/RequestModal';

const PAGE_SIZE = 60;
const KINDS = [
  { value: 'all', label: 'All' },
  { value: 'technical', label: 'Technical' },
  { value: 'soft', label: 'Soft skills' },
];

export default function SkillsPage() {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('skill');

  const { data: skills = [], isPending, error } = useSkills();
  const { data: counts = {} } = useSkillCounts();
  const { data: mySkillIds = [] } = useMySkillIds();
  const toggle = useToggleMySkill();

  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [category, setCategory] = useState('All');
  const [onlyWithStudents, setOnlyWithStudents] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [requestTarget, setRequestTarget] = useState(null);

  const selected = skills.find((s) => s.id === selectedId) ?? null;
  const { data: students = [], isPending: studentsLoading } = useStudentsWithSkill(selected?.id);

  const categories = useMemo(() => {
    const names = skills
      .filter((s) => kind === 'all' || s.kind === kind)
      .map((s) => s.category);
    return ['All', ...Array.from(new Set(names))];
  }, [skills, kind]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills
      .filter((s) => kind === 'all' || s.kind === kind)
      .filter((s) => category === 'All' || s.category === category)
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
      .filter((s) => !onlyWithStudents || (counts[s.id] ?? 0) > 0)
      .sort(
        (a, b) =>
          (counts[b.id] ?? 0) - (counts[a.id] ?? 0) || a.name.localeCompare(b.name)
      );
  }, [skills, kind, category, query, onlyWithStudents, counts]);

  const select = (skill) => {
    if (!skill || skill.id === selectedId) setParams({});
    else setParams({ skill: skill.id });
  };

  const resetPaging = () => setVisible(PAGE_SIZE);
  const iHaveIt = !!selected && mySkillIds.includes(selected.id);

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header anim-fade-up">
          <span className="section-label">Skill Hub</span>
          <h1
            className="font-display"
            style={{ fontSize: 'var(--text-4xl)', marginTop: 'var(--space-2)' }}
          >
            Browse Skills
          </h1>
          <p className="text-secondary" style={{ marginTop: 'var(--space-3)', maxWidth: 540 }}>
            Find students who can help you with any skill, from DSA to design to public speaking.
          </p>
        </div>

        <div className="explore-controls glass-card anim-fade-up" style={{ animationDelay: '0.1s' }}>
          <input
            type="text"
            className="form-input explore-search"
            placeholder="Search a skill or category…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPaging();
            }}
          />
          <div className="explore-filters">
            <select
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                resetPaging();
              }}
              style={{ width: 'auto', minWidth: 200, maxWidth: '100%' }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All categories' : c}</option>
              ))}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={onlyWithStudents}
                onChange={(e) => {
                  setOnlyWithStudents(e.target.checked);
                  resetPaging();
                }}
              />
              Only skills with students
            </label>
          </div>
        </div>

        <div className="skills-category-tabs anim-fade-up" style={{ animationDelay: '0.15s' }}>
          {KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              className={`tag ${kind === k.value ? 'active' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px' }}
              onClick={() => {
                setKind(k.value);
                setCategory('All');
                resetPaging();
              }}
            >
              {k.label}
            </button>
          ))}
        </div>

        {isPending && <p>Loading skills...</p>}
        {error && <p role="alert">Could not load skills. Please refresh and try again.</p>}

        {!isPending && !error && (
          <>
            <p
              className="text-muted anim-fade-up"
              style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}
            >
              {filtered.length} skill{filtered.length !== 1 ? 's' : ''} found
            </p>

            <div className={selected ? 'skills-layout-split' : 'skills-layout-full'}>
              <div>
                {filtered.length === 0 ? (
                  <div className="empty-state glass-card">
                    <div className="empty-state-icon">⚡</div>
                    <p className="empty-state-title">No skills found</p>
                    <p className="empty-state-desc">Try a different search or category.</p>
                  </div>
                ) : (
                  <>
                    <div className="skills-grid">
                      {filtered.slice(0, visible).map((sk) => (
                        <SkillCard
                          key={sk.id}
                          skill={sk}
                          count={counts[sk.id] ?? 0}
                          mine={mySkillIds.includes(sk.id)}
                          active={sk.id === selectedId}
                          onClick={() => select(sk)}
                        />
                      ))}
                    </div>
                    {filtered.length > visible && (
                      <div style={{ textAlign: 'center', margin: 'var(--space-6) 0' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setVisible((n) => n + PAGE_SIZE)}
                        >
                          Show more ({filtered.length - visible} left)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {selected && (
                <div className="skills-detail-panel glass-card anim-scale-in">
                  <div
                    className="flex justify-between items-center"
                    style={{ marginBottom: 'var(--space-4)' }}
                  >
                    <div>
                      <h2 className="font-display" style={{ fontSize: 'var(--text-xl)' }}>
                        {selected.name}
                      </h2>
                      <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                        {selected.category}
                      </span>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => select(null)}>
                      ✕
                    </button>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-sm ${iHaveIt ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={toggle.isPending}
                    onClick={() => toggle.mutate({ skillId: selected.id, add: !iHaveIt })}
                  >
                    {iHaveIt ? '✓ I have this skill' : 'I have this skill'}
                  </button>
                  {toggle.error && (
                    <p
                      role="alert"
                      style={{ color: '#f87171', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}
                    >
                      {toggle.error.message || 'Could not update. Please try again.'}
                    </p>
                  )}

                  <div className="divider" />

                  <h3
                    className="font-display"
                    style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}
                  >
                    Students who can help ({students.length})
                  </h3>

                  {studentsLoading ? (
                    <p>Loading students...</p>
                  ) : students.length === 0 ? (
                    <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                      <div className="empty-state-icon">😕</div>
                      <p className="empty-state-desc">
                        {iHaveIt
                          ? 'Only you so far. Others will show up as they add this skill.'
                          : 'No students have added this skill yet.'}
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
              )}
            </div>
          </>
        )}
      </div>

      {requestTarget && (
        <RequestModal senior={requestTarget} onClose={() => setRequestTarget(null)} />
      )}
    </div>
  );
}