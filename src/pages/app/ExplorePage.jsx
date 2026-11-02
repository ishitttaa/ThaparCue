import { useMemo, useState } from 'react';
import SeniorCard from '../../components/SeniorCard';
import RequestModal from '../../components/RequestModal';
import { useStudents } from '../../hooks/useProfiles';
import { useMatchContext } from '../../hooks/useMatchContext';
import { rankStudents } from '../../lib/matchScore';
import { BRANCHES } from '../../lib/branches';

const SORT_OPTIONS = [
  { value: 'match', label: 'Best match' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'year', label: 'Year (senior first)' },
];

export default function ExplorePage() {
  const { data: students = [], isPending, error } = useStudents();
  const { viewer, targetCourseIds } = useMatchContext();
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('All');
  const [sort, setSort] = useState('match');
  const [requestTarget, setRequestTarget] = useState(null);

  const ranked = useMemo(
    () => rankStudents(students, viewer, targetCourseIds),
    [students, viewer, targetCourseIds]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ranked
      .filter(
        (s) =>
          !q ||
          [s.name, s.branch, s.bio, ...s.skills.map((k) => k.name)].some((text) =>
            text.toLowerCase().includes(q)
          )
      )
      .filter((s) => branch === 'All' || s.branch === branch);
    if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'year') return [...list].sort((a, b) => (b.currentYear ?? 0) - (a.currentYear ?? 0));
    return list;
  }, [ranked, query, branch, sort]);

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1>Explore Students</h1>
        <p>Connect with students and learn from their experience.</p>
      </div>

      <div className="explore-filters">
        <input
          type="text"
          placeholder="Search by name, branch, bio or skill..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          {['All', ...BRANCHES].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      {isPending && <p>Loading students...</p>}
      {!isPending && error && (
        <p role="alert">Could not load students. Please refresh and try again.</p>
      )}

      {!isPending && !error && (
        <>
          <p>{filtered.length} students found</p>
          {filtered.length === 0 ? (
            <p>No students found. More students may appear after they register.</p>
          ) : (
            <div className="senior-grid">
              {filtered.map((student) => (
                <SeniorCard key={student.id} senior={student} onRequest={setRequestTarget} />
              ))}
            </div>
          )}
        </>
      )}

      {requestTarget && (
        <RequestModal senior={requestTarget} onClose={() => setRequestTarget(null)} />
      )}
    </div>
  );
}