import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { saveMyProfile } from '../services/profiles';
import AuthShell from '../components/auth/AuthShell';

const BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

export default function OnboardingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!branch) {
      setError('Please select your branch.');
      return;
    }
    if (!year) {
      setError('Please select your year.');
      return;
    }

    setLoading(true);

    try {
      const saved = await saveMyProfile(user.id, { name, branch, year });
      // Cache update: guards ko turant pata chal jaata hai ki profile ban gayi
      queryClient.setQueryData(['profile', user.id], saved);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not save your profile.');
      setLoading(false);
    }
  };

  const handleUseAnotherAccount = async () => {
    try {
      await logout(); // guards khud /login par bhej denge
    } catch (err) {
      setError(err.message || 'Could not sign out. Please try again.');
    }
  };

  return (
    <AuthShell stepIndex={2} error={error}>
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="font-display login-form-title">Complete your profile</h2>
        <p className="text-secondary login-form-subtitle">Help seniors match with you better</p>
        <div className="form-group">
          <label className="form-label" htmlFor="name-input">Full Name</label>
          <input
            id="name-input"
            type="text"
            className="form-input"
            placeholder="Ishita Rajput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="branch-select">Branch</label>
          <select
            id="branch-select"
            className="form-select"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            required
          >
            <option value="">Select branch…</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="year-select">Current Year</label>
          <select
            id="year-select"
            className="form-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          >
            <option value="">Select year…</option>
            {[1, 2, 3, 4].map((y) => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Create Profile & Enter'}
        </button>
        <button
          type="button"
          className="btn btn-ghost w-full"
          style={{ marginTop: 'var(--space-2)' }}
          onClick={handleUseAnotherAccount}
        >
          Use a different account
        </button>
      </form>
    </AuthShell>
  );
}
