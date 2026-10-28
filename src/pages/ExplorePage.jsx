
import { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import SeniorCard from '../components/SeniorCard';
import RequestModal from '../components/RequestModal';

const BRANCHES = [
  'All',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
];

const SORT_OPTIONS = [
  { value: 'reliability', label: 'Reliability Score' },
  { value: 'rating', label: 'Rating' },
  { value: 'interactions', label: 'Most Interactions' },
  { value: 'responseRate', label: 'Response Rate' },
];

function mapProfile(profile) {
  const name = profile.name || 'Student';

  return {
    id: profile.id,
    name,
    branch: profile.branch || 'Branch not added',
    isAlumni: false,
    currentYear: profile.year,
    reliabilityScore: 70,
    responseRate: 0,
    avgResponseTime: '—',
    skills: [],
    rating: 0,
    totalInteractions: 0,
    initials: name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    colorHue: 230,
    bio: profile.bio || 'No bio added yet.',
  };
}

export default function ExplorePage() {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('All');
  const [alumniOnly, setAlumniOnly] = useState(false);
  const [sort, setSort] = useState('reliability');
  const [requestTarget, setRequestTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchProfiles() {
      setLoading(true);
      setError('');

      if (!user?.id) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, name, branch, year, bio')
        .neq('id', user.id);

      if (!active) return;

      if (fetchError) {
        console.error('Could not fetch profiles:', fetchError);
        setError('Profiles load nahi ho paaye. Please refresh and try again.');
        setProfiles([]);
      } else {
        setProfiles((data || []).map(mapProfile));
      }

      setLoading(false);
    }

    fetchProfiles();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const filtered = useMemo(() => {
    let list = [...profiles];

    if (query.trim()) {
      const q = query.toLowerCase();

      list = list.filter(
        (student) =>
          student.name.toLowerCase().includes(q) ||
          student.branch.toLowerCase().includes(q) ||
          student.bio.toLowerCase().includes(q)
      );
    }

    if (branch !== 'All') {
      list = list.filter((student) => student.branch === branch);
    }

    if (alumniOnly) {
      list = list.filter((student) => student.isAlumni);
    }

    list.sort((a, b) => {
      if (sort === 'reliability') {
        return b.reliabilityScore - a.reliabilityScore;
      }
      if (sort === 'rating') {
        return b.rating - a.rating;
      }
      if (sort === 'interactions') {
        return b.totalInteractions - a.totalInteractions;
      }
      if (sort === 'responseRate') {
        return b.responseRate - a.responseRate;
      }
      return 0;
    });

    return list;
  }, [profiles, query, branch, alumniOnly, sort]);

  return (
    <div className="explore-page">
      {/* Existing page layout yahan rakhein if your original UI
          has additional wrappers or headings. */}

      <div className="explore-header">
        <h1>Explore Students</h1>
        <p>Connect with students and learn from their experience.</p>
      </div>

      <div className="explore-filters">
        <input
          type="text"
          placeholder="Search by name, branch or bio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          {BRANCHES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={alumniOnly}
            onChange={(e) => setAlumniOnly(e.target.checked)}
          />
          Alumni only
        </label>
      </div>

      {loading && <p>Loading students...</p>}

      {!loading && error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <p>{filtered.length} students found</p>

          {filtered.length === 0 ? (
            <p>No students found. More students may appear after they register.</p>
          ) : (
            <div className="senior-grid">
              {filtered.map((student) => (
                <SeniorCard
                  key={student.id}
                  senior={student}
                  onRequest={setRequestTarget}
                />
              ))}
            </div>
          )}
        </>
      )}

      {requestTarget && (
        <RequestModal
          senior={requestTarget}
          onClose={() => setRequestTarget(null)}
        />
      )}
    </div>
  );
}
