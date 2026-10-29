import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMyProfile } from '../../hooks/useMyProfile';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { useRequests } from '../../hooks/useRequests';
import { BRANCHES } from '../../lib/branches';

const BIO_MAX = 300;

function initialsOf(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { data: profile, isPending } = useMyProfile();
  const { data: requests = [] } = useRequests();
  const update = useUpdateProfile();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', branch: '', year: '', bio: '' });
  const [formError, setFormError] = useState('');

  if (isPending || !profile) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const sent = requests.filter((r) => r.from_user === user.id).length;
  const received = requests.length - sent;
  const pending = requests.filter((r) => r.status === 'pending').length;
  const accepted = requests.filter((r) => r.status === 'accepted').length;

  // Purane profile ki branch agar list mein na ho, tab bhi dropdown mein dikhe
  const branchOptions =
    !form.branch || BRANCHES.includes(form.branch)
      ? BRANCHES
      : [form.branch, ...BRANCHES];

  const startEdit = () => {
    setForm({
      name: profile.name || '',
      branch: profile.branch || '',
      year: String(profile.year || ''),
      bio: profile.bio || '',
    });
    setFormError('');
    setEditing(true);
  };

  const setField = (key) => (e) =>
    setForm((current) => ({ ...current, [key]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) return setFormError('Please enter your name.');
    if (!form.branch) return setFormError('Please select your branch.');
    if (!form.year) return setFormError('Please select your year.');
    if (form.bio.length > BIO_MAX) {
      return setFormError(`Bio can be at most ${BIO_MAX} characters.`);
    }

    update.mutate(form, {
      onSuccess: () => setEditing(false),
      onError: (err) => setFormError(err.message || 'Could not save changes.'),
    });
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header anim-fade-up">
          <span className="section-label">Account</span>
          <h1
            className="font-display"
            style={{ fontSize: 'var(--text-4xl)', marginTop: 'var(--space-2)' }}
          >
            My Profile
          </h1>
        </div>

        <div className="profile-layout">
          {/* Left: Identity card */}
          <div className="profile-sidebar">
            <div className="glass-card profile-card anim-fade-up">
              <div className="profile-avatar-wrap">
                <div
                  className="avatar-placeholder"
                  style={{
                    width: 88,
                    height: 88,
                    fontSize: '1.6rem',
                    background: 'linear-gradient(135deg, hsl(230,70%,55%), hsl(270,70%,45%))',
                  }}
                >
                  {initialsOf(profile.name)}
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="login-form" noValidate>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-name">Full Name</label>
                    <input
                      id="edit-name"
                      className="form-input"
                      value={form.name}
                      onChange={setField('name')}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-branch">Branch</label>
                    <select
                      id="edit-branch"
                      className="form-select"
                      value={form.branch}
                      onChange={setField('branch')}
                      required
                    >
                      <option value="">Select branch…</option>
                      {branchOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-year">Current Year</label>
                    <select
                      id="edit-year"
                      className="form-select"
                      value={form.year}
                      onChange={setField('year')}
                      required
                    >
                      <option value="">Select year…</option>
                      {[1, 2, 3, 4].map((y) => (
                        <option key={y} value={y}>Year {y}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-bio">Bio</label>
                    <textarea
                      id="edit-bio"
                      className="form-input"
                      rows={4}
                      maxLength={BIO_MAX}
                      placeholder="Tell others what you can help with…"
                      value={form.bio}
                      onChange={setField('bio')}
                      style={{ resize: 'vertical' }}
                    />
                    <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                      {form.bio.length}/{BIO_MAX}
                    </span>
                  </div>
                  {formError && (
                    <p
                      role="alert"
                      style={{
                        color: '#f87171',
                        fontSize: 'var(--text-sm)',
                        marginBottom: 'var(--space-3)',
                      }}
                    >
                      {formError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={update.isPending}
                  >
                    {update.isPending ? 'Saving...' : 'Save changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost w-full"
                    style={{ marginTop: 'var(--space-2)' }}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h2
                    className="font-display"
                    style={{ fontSize: 'var(--text-2xl)', textAlign: 'center' }}
                  >
                    {profile.name}
                  </h2>
                  <p
                    className="text-secondary"
                    style={{ textAlign: 'center', fontSize: 'var(--text-sm)', marginTop: 4 }}
                  >
                    {user.email}
                  </p>

                  <div
                    className="flex gap-2"
                    style={{
                      justifyContent: 'center',
                      marginTop: 'var(--space-3)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span className="badge badge-accent">{profile.branch}</span>
                    <span className="badge badge-muted">Year {profile.year}</span>
                  </div>

                  <p className="profile-bio text-secondary">
                    {profile.bio || 'No bio added yet.'}
                  </p>

                  <button
                    className="btn btn-secondary w-full"
                    style={{ marginTop: 'var(--space-4)' }}
                    onClick={startEdit}
                  >
                    Edit profile
                  </button>
                </>
              )}

              <div className="divider" />
              <button className="btn btn-danger w-full" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          {/* Right: Details */}
          <div className="profile-main">
            <div
              className="glass-card profile-section anim-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              <h2 className="font-display section-title">Request Stats</h2>
              <div className="profile-stats-grid">
                <div className="profile-stat">
                  <span className="profile-stat-val">{sent}</span>
                  <span className="profile-stat-lbl">Sent</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val">{received}</span>
                  <span className="profile-stat-lbl">Received</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val" style={{ color: 'var(--warning)' }}>
                    {pending}
                  </span>
                  <span className="profile-stat-lbl">Pending</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val" style={{ color: 'var(--success)' }}>
                    {accepted}
                  </span>
                  <span className="profile-stat-lbl">Accepted</span>
                </div>
              </div>
              <Link
                to="/inbox"
                className="btn btn-secondary w-full"
                style={{ marginTop: 'var(--space-4)' }}
              >
                View Inbox
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}