import { useState, useMemo } from 'react';
import { SENIORS } from '../data/mockSeniors';
import SeniorCard from '../components/SeniorCard';
import RequestModal from '../components/RequestModal';

const BRANCHES = ['All', 'Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'];
const SORT_OPTIONS = [
  { value: 'reliability', label: 'Reliability Score' },
  { value: 'rating', label: 'Rating' },
  { value: 'interactions', label: 'Most Interactions' },
  { value: 'responseRate', label: 'Response Rate' },
];

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('All');
  const [alumniOnly, setAlumniOnly] = useState(false);
  const [sort, setSort] = useState('reliability');
  const [requestTarget, setRequestTarget] = useState(null);

  const filtered = useMemo(() => {
    let list = [...SENIORS];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.branch.toLowerCase().includes(q) ||
          s.skills.some((sk) => sk.name.toLowerCase().includes(q)) ||
          s.bio.toLowerCase().includes(q)
      );
    }

    if (branch !== 'All') {
      list = list.filter((s) => s.branch === branch);
    }

    if (alumniOnly) {
      list = list.filter((s) => s.isAlumni);
    }

    list.sort((a, b) => {
      if (sort === 'reliability') return b.reliabilityScore - a.reliabilityScore;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'interactions') return b.totalInteractions - a.totalInteractions;
      if (sort === 'responseRate') return b.responseRate - a.responseRate;
      return 0;
    });

    return list;
  }, [query, branch, alumniOnly, sort]);

  return (
    <div className="page-content">
      <div className="container">
        {/* Header */}
        <div className="page-header anim-fade-up">
          <span className="section-label">Browse</span>
          <h1 className="font-display" style={{ fontSize: 'var(--text-4xl)', marginTop: 'var(--space-2)' }}>
            Find Your Senior
          </h1>
          <p className="text-secondary" style={{ marginTop: 'var(--space-3)', maxWidth: 540 }}>
            Explore verified seniors sorted by reliability. Filter by branch, status, or skill.
          </p>
        </div>

        {/* Search + filters */}
        <div className="explore-controls glass-card anim-fade-up" style={{ animationDelay: '0.1s' }}>
          <input
            type="text"
            className="form-input explore-search"
            placeholder="Search by name, skill, or keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="explore-filters">
            <select className="form-select" value={branch} onChange={(e) => setBranch(e.target.value)} style={{ width: 'auto', minWidth: 180 }}>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>
              ))}
            </select>
            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <label className="explore-toggle">
              <input type="checkbox" checked={alumniOnly} onChange={(e) => setAlumniOnly(e.target.checked)} />
              <span>Alumni only</span>
            </label>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between anim-fade-up" style={{ animationDelay: '0.15s', marginBottom: 'var(--space-4)' }}>
          <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
            {filtered.length} senior{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-title">No seniors found</p>
            <p className="empty-state-desc">Try a different search term or filter.</p>
          </div>
        ) : (
          <div className="explore-grid">
            {filtered.map((s, i) => (
              <div key={s.id} className="anim-fade-up" style={{ animationDelay: `${0.05 * i}s` }}>
                <SeniorCard senior={s} onRequest={setRequestTarget} />
              </div>
            ))}
          </div>
        )}
      </div>

      {requestTarget && (
        <RequestModal senior={requestTarget} onClose={() => setRequestTarget(null)} />
      )}
    </div>
  );
}
