import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGroups, useCreateGroup, useJoinGroup } from '../../hooks/useGroups';
import GroupInvitesCard from '../../components/GroupInvitesCard';

const CATEGORIES = ['all', 'hackathon', 'competition', 'event', 'general'];
const CATEGORY_ICONS = { hackathon: '🚀', competition: '🏆', event: '📅', general: '💬', all: '🌐' };
const CATEGORY_COLORS = {
  hackathon: 'badge-accent',
  competition: 'badge-warning',
  event: 'badge-success',
  general: 'badge-muted',
};

export default function GroupsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'hackathon', maxMembers: 10 });

  const { data: groups = [], isPending, error } = useGroups(activeCategory);
  const createGroup = useCreateGroup();
  const joinGroup = useJoinGroup();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    createGroup.mutate(
      { name: form.name.trim(), description: form.description.trim(), category: form.category, maxMembers: Number(form.maxMembers) },
      {
        onSuccess: (group) => {
          setShowCreate(false);
          setForm({ name: '', description: '', category: 'hackathon', maxMembers: 10 });
          navigate(`/groups/${group.id}`);
        },
      }
    );
  };

  const isMember = (group) =>
    group.my_membership?.some((m) => m.user_id === user?.id) ||
    group.created_by === user?.id;
  const memberCount = (group) => group.members?.[0]?.count ?? 0;

  return (
    <div className="page-content">
      <div className="container">
        {/* Header */}
        <div className="groups-page-header anim-fade-up">
          <div>
            <span className="section-label">Community</span>
            <h1 className="font-display" style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginTop: 8 }}>
              Student <span className="text-gradient">Groups</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
              Find teammates for hackathons, competitions &amp; events
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + Create Group
          </button>
        </div>

        <GroupInvitesCard />

        {/* Category filters */}
        <div className="groups-filter-bar anim-fade-up" style={{ animationDelay: '0.1s' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`groups-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <p className="error-message">{error.message}</p>}

        {/* Loading */}
        {isPending && (
          <div className="empty-state">
            <div className="spinner" />
            <p>Loading groups...</p>
          </div>
        )}

        {/* Groups grid */}
        {!isPending && groups.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p className="empty-state-title">No groups yet</p>
            <p className="empty-state-desc">Be the first to create a group for your next hackathon or event!</p>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              Create the first group
            </button>
          </div>
        )}

        <div className="groups-grid">
          {groups.map((group) => {
            const member = isMember(group);
            const count = memberCount(group);
            const full = group.max_members && count >= group.max_members;
            return (
              <div key={group.id} className="group-card glass-card anim-fade-up">
                <div className="group-card-top">
                  <div className="group-card-icon">{CATEGORY_ICONS[group.category] || '💬'}</div>
                  <span className={`badge ${CATEGORY_COLORS[group.category] || 'badge-muted'}`}>
                    {group.category}
                  </span>
                  {member && <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Joined</span>}
                </div>

                <h3 className="group-card-name">{group.name}</h3>
                {group.description && (
                  <p className="group-card-desc">{group.description}</p>
                )}

                <div className="group-card-meta">
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                    👤 {count}{group.max_members ? ` / ${group.max_members}` : ''} members
                  </span>
                  {group.creator && (
                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                      by {group.creator.name || 'Student'}
                    </span>
                  )}
                </div>

                <div className="group-card-actions">
                  {member ? (
                    <button
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      Open Chat →
                    </button>
                  ) : full ? (
                    <button className="btn btn-ghost" style={{ flex: 1 }} disabled>
                      Group Full
                    </button>
                  ) : !group.is_open ? (
                    <button className="btn btn-ghost" style={{ flex: 1 }} disabled>
                      Closed
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      disabled={joinGroup.isPending}
                      onClick={() =>
                        joinGroup.mutate(group.id, {
                          onSuccess: () => navigate(`/groups/${group.id}`),
                        })
                      }
                    >
                      {joinGroup.isPending && joinGroup.variables === group.id ? (
                        <span className="spinner" />
                      ) : (
                        'Join Group'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="modal-box" style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 className="font-display" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                Create a Group
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>✕</button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Group Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Smart India Hackathon Team"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  maxLength={80}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input form-select"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option value="hackathon">🚀 Hackathon</option>
                  <option value="competition">🏆 Competition</option>
                  <option value="event">📅 Event</option>
                  <option value="general">💬 General</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="What is this group about? What are you building?"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Members</label>
                <input
                  className="form-input"
                  type="number"
                  min={2}
                  max={50}
                  value={form.maxMembers}
                  onChange={(e) => setForm((f) => ({ ...f, maxMembers: e.target.value }))}
                />
              </div>

              {createGroup.error && (
                <p className="error-message">{createGroup.error.message}</p>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={createGroup.isPending}>
                  {createGroup.isPending ? <span className="spinner" /> : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
