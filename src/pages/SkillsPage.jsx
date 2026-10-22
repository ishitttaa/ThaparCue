import { useState, useMemo } from 'react';
import { SKILL_CATEGORIES, searchSkills } from '../data/mockSkills';
import { getSeniorsByIds } from '../data/mockSeniors';
import SkillCard from '../components/SkillCard';
import SeniorCard from '../components/SeniorCard';
import RequestModal from '../components/RequestModal';

export default function SkillsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [requestTarget, setRequestTarget] = useState(null);

  const filtered = useMemo(() => searchSkills(query, category), [query, category]);
  const selectedSeniors = selected ? getSeniorsByIds(selected.seniorIds) : [];

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header anim-fade-up">
          <span className="section-label">Skill Hub</span>
          <h1 className="font-display" style={{ fontSize: 'var(--text-4xl)', marginTop: 'var(--space-2)' }}>
            Browse Skills
          </h1>
          <p className="text-secondary" style={{ marginTop: 'var(--space-3)', maxWidth: 540 }}>
            Find seniors who can mentor you on any skill — from DSA to UI Design to Cloud.
          </p>
        </div>

        {/* Search */}
        <div className="explore-controls glass-card anim-fade-up" style={{ animationDelay: '0.1s' }}>
          <input
            type="text"
            className="form-input explore-search"
            placeholder="Search skill, category, or use case…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        <div className="skills-category-tabs anim-fade-up" style={{ animationDelay: '0.15s' }}>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tag ${category === cat ? 'active' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px' }}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-muted anim-fade-up" style={{ animationDelay: '0.2s', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
          {filtered.length} skill{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Layout: grid + detail panel */}
        <div className={selected ? 'skills-layout-split' : 'skills-layout-full'}>
          {/* Grid */}
          <div className="skills-grid">
            {filtered.length === 0 ? (
              <div className="empty-state glass-card" style={{ gridColumn: '1 / -1' }}>
                <div className="empty-state-icon">⚡</div>
                <p className="empty-state-title">No skills found</p>
                <p className="empty-state-desc">Try a different search or category.</p>
              </div>
            ) : (
              filtered.map((sk, i) => (
                <div key={sk.id} className="anim-fade-up" style={{ animationDelay: `${0.04 * i}s` }}>
                  <SkillCard
                    skill={sk}
                    onClick={() => setSelected(selected?.id === sk.id ? null : sk)}
                  />
                </div>
              ))
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="skills-detail-panel glass-card anim-scale-in">
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
                <div>
                  <span className="skill-icon" style={{ fontSize: '1.8rem' }}>{selected.icon}</span>
                  <h2 className="font-display" style={{ fontSize: 'var(--text-xl)', marginTop: 'var(--space-2)' }}>
                    {selected.name}
                  </h2>
                  <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{selected.category}</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
              </div>

              <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
                {selected.description}
              </p>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>Use Cases</p>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {selected.useCases.map((u) => <span key={u} className="tag">{u}</span>)}
                </div>
              </div>

              <div className="divider" />

              <h3 className="font-display" style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>
                Seniors who can help ({selectedSeniors.length})
              </h3>

              {selectedSeniors.length === 0 ? (
                <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                  <div className="empty-state-icon">😕</div>
                  <p className="empty-state-desc">No seniors registered for this skill yet.</p>
                </div>
              ) : (
                <div className="flex-col gap-4" style={{ display: 'flex' }}>
                  {selectedSeniors.map((s) => (
                    <SeniorCard key={s.id} senior={s} onRequest={setRequestTarget} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {requestTarget && (
        <RequestModal senior={requestTarget} onClose={() => setRequestTarget(null)} />
      )}
    </div>
  );
}
