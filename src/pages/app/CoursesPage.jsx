import { useState, useMemo } from 'react';
import { COURSES } from '../../data/mockCourses';
import CourseCard from '../../components/CourseCard';

const ALL_BRANCHES = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'COE'];
const YEARS = ['All', '1', '2', '3', '4'];
const WORKLOADS = ['All', 'Low', 'Medium', 'Medium-High', 'High'];

export default function CoursesPage() {
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('All');
  const [year, setYear] = useState('All');
  const [workload, setWorkload] = useState('All');

  const filtered = useMemo(() => {
    let list = [...COURSES];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (branch !== 'All') list = list.filter((c) => c.branch.includes(branch));
    if (year !== 'All') list = list.filter((c) => c.year === Number(year));
    if (workload !== 'All') list = list.filter((c) => c.workload === workload);
    return list;
  }, [query, branch, year, workload]);

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header anim-fade-up">
          <span className="section-label">Course Intel</span>
          <h1 className="font-display" style={{ fontSize: 'var(--text-4xl)', marginTop: 'var(--space-2)' }}>
            Browse Courses
          </h1>
          <p className="text-secondary" style={{ marginTop: 'var(--space-3)', maxWidth: 540 }}>
            Senior insights, grade cutoffs, and exam strategies for every major course.
          </p>
        </div>

        {/* Search + filters */}
        <div className="explore-controls glass-card anim-fade-up" style={{ animationDelay: '0.1s' }}>
          <input
            type="text"
            className="form-input explore-search"
            placeholder="Search by course name, code, or topic…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="explore-filters">
            <select className="form-select" value={branch} onChange={(e) => setBranch(e.target.value)} style={{ width: 'auto', minWidth: 120 }}>
              {ALL_BRANCHES.map((b) => <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>)}
            </select>
            <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: 'auto', minWidth: 110 }}>
              {YEARS.map((y) => <option key={y} value={y}>{y === 'All' ? 'All Years' : `Year ${y}`}</option>)}
            </select>
            <select className="form-select" value={workload} onChange={(e) => setWorkload(e.target.value)} style={{ width: 'auto', minWidth: 130 }}>
              {WORKLOADS.map((w) => <option key={w} value={w}>{w === 'All' ? 'All Workloads' : w}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between anim-fade-up" style={{ animationDelay: '0.15s', marginBottom: 'var(--space-4)' }}>
          <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
            {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-state-icon">📚</div>
            <p className="empty-state-title">No courses found</p>
            <p className="empty-state-desc">Try a different search or clear filters.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filtered.map((c, i) => (
              <div key={c.id} className="anim-fade-up" style={{ animationDelay: `${0.05 * i}s` }}>
                <CourseCard course={c} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
