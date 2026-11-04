import { useMemo, useState } from 'react';
import { useMyProfile } from '../../hooks/useMyProfile';
import { useCourses } from '../../hooks/useCourses';
import { BRANCHES } from '../../lib/branches';
import CourseListCard from '../../components/CourseListCard';

const PAGE_SIZE = 60;

// ── Skeleton (shimmer) ──
function Sk({ w = '100%', h = 14, r = 10 }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r }} />;
}

function SkCourseCard() {
  return (
    <div className="glass-card skeleton-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, display: 'grid', gap: 8 }}>
          <Sk w="35%" h={11} />
          <Sk w="80%" h={18} />
        </div>
        <Sk w={64} h={24} r={999} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Sk w={70} h={24} r={999} />
        <Sk w={90} h={24} r={999} />
      </div>
      <Sk h={12} />
      <Sk w="60%" h={12} />
    </div>
  );
}

export default function CoursesPage() {
  const { data: profile } = useMyProfile();
  const { data: courses = [], isPending, error } = useCourses();

  const [query, setQuery] = useState('');
  const [branchChoice, setBranchChoice] = useState(null);
  const [year, setYear] = useState('All');
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Jab tak user ne khud na chuna ho, apni branch dikhao
  const branch =
    branchChoice ?? (BRANCHES.includes(profile?.branch) ? profile.branch : 'All');

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

  const resetPaging = () => setVisible(PAGE_SIZE);

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header anim-fade-up">
          <span className="section-label">Courses</span>
          <h1
            className="font-display"
            style={{ fontSize: 'var(--text-4xl)', marginTop: 'var(--space-2)' }}
          >
            Browse Courses
          </h1>
          <p className="text-secondary" style={{ marginTop: 'var(--space-3)', maxWidth: 540 }}>
            Find your courses by branch and year, and see which students have taken them.
          </p>
        </div>

        <div className="explore-controls glass-card anim-fade-up" style={{ animationDelay: '0.1s' }}>
          <input
            type="text"
            className="form-input explore-search"
            placeholder="Search by course name or code…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPaging();
            }}
          />
          <div className="explore-filters">
            <select
              className="form-select"
              value={branch}
              onChange={(e) => {
                setBranchChoice(e.target.value);
                resetPaging();
              }}
              style={{ width: 'auto', minWidth: 200, maxWidth: '100%' }}
            >
              <option value="All">All Branches</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              className="form-select"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                resetPaging();
              }}
              style={{ width: 'auto', minWidth: 110 }}
            >
              <option value="All">All Years</option>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>
        </div>

        {isPending && (
          <div className="courses-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkCourseCard key={i} />
            ))}
          </div>
        )}
        {error && <p role="alert">Could not load courses. Please refresh and try again.</p>}

        {!isPending && !error && (
          <>
            <div
              className="flex items-center justify-between anim-fade-up"
              style={{ marginBottom: 'var(--space-4)' }}
            >
              <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
                {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state glass-card">
                <div className="empty-state-icon">📚</div>
                <p className="empty-state-title">No courses found</p>
                <p className="empty-state-desc">
                  Try "All Branches" or a different search.
                </p>
              </div>
            ) : (
              <>
                <div className="courses-grid">
                  {filtered.slice(0, visible).map((c) => (
                    <CourseListCard key={c.id} course={c} />
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
          </>
        )}
      </div>
    </div>
  );
}