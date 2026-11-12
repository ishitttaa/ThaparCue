import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import {
  useGroup,
  useGroupMessages,
  useSendGroupMessage,
  useJoinGroup,
  useLeaveGroup,
  useDeleteGroup,
  useInviteToGroup,
  useGroupPendingInvites,
  useRemoveMemberFromGroup,
} from '../../hooks/useGroups';
import { useStudents } from '../../hooks/useProfiles';

const CATEGORY_ICONS = { hackathon: '🚀', competition: '🏆', event: '📅', general: '💬' };

function formatTime(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) +
    ' · ' +
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  );
}

function getInitials(name) {
  return (name || 'S')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reply, setReply] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'members'
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const bottomRef = useRef(null);

  const { data: group, isPending, error } = useGroup(id);
  const myMembership = group?.members?.find((m) => m.user?.id === user.id);
  const isMember = Boolean(myMembership || group?.created_by === user?.id);
  const isAdmin = Boolean(myMembership?.role === 'admin' || group?.created_by === user?.id);

  const { data: messages = [] } = useGroupMessages(id, isMember);
  const send = useSendGroupMessage(id);
  const joinGroup = useJoinGroup();
  const leaveGroup = useLeaveGroup();
  const deleteGroup = useDeleteGroup();
  const invite = useInviteToGroup();
  const removeMember = useRemoveMemberFromGroup();

  const { data: allStudents = [] } = useStudents();
  const { data: pendingInvites = [] } = useGroupPendingInvites(id);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    const content = reply.trim();
    if (!content || send.isPending) return;
    send.mutate(content, { onSuccess: () => setReply('') });
  };

  const handleLeave = () => {
    const adminCount = group.members?.filter((m) => m.role === 'admin').length || 0;
    const totalMembers = group.members?.length || 0;

    if (isAdmin && adminCount <= 1) {
      if (totalMembers <= 1) {
        const confirmDelete = window.confirm(
          'You are the only member in this group. Leaving will delete the group. Do you want to delete this group?'
        );
        if (confirmDelete) {
          handleDeleteGroup();
        }
        return;
      }
      alert('You are the only admin. Please promote another member to admin or delete the group before leaving.');
      return;
    }

    if (!window.confirm('Are you sure you want to leave this group?')) return;
    leaveGroup.mutate(id, {
      onSuccess: () => {
        toast.success('You left the group');
        navigate('/groups');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to leave group');
      },
    });
  };

  const handleDeleteGroup = () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${group?.name}"? All messages and members will be removed.`)) {
      return;
    }

    deleteGroup.mutate(id, {
      onSuccess: () => {
        toast.success('Group deleted successfully');
        navigate('/groups');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete group');
      },
    });
  };

  const handleAddStudent = (student) => {
    if (!group) return;
    const currentCount = group.members?.length || 0;
    if (group.max_members && currentCount >= group.max_members) {
      toast.error('Group is at maximum capacity');
      return;
    }

    invite.mutate(
      { groupId: id, userId: student.id },
      {
        onSuccess: () => {
          toast.success(`Invite sent to ${student.name}`);
        },
        onError: (err) => {
          if (err.code === '23505') {
            toast.error('Ye student already invited hai');
          } else {
            toast.error(err.message || 'Invite nahi bheja ja saka');
          }
        },
      }
    );
  };

  const handleRemoveMember = (targetUserId, targetName) => {
    if (!window.confirm(`Remove ${targetName || 'this student'} from the group?`)) return;
    removeMember.mutate(
      { groupId: id, userId: targetUserId },
      {
        onSuccess: () => {
          toast.success(`${targetName} removed from the group`);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to remove member');
        },
      }
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Group link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filter students who are NOT already in the group
  const groupMembers = group?.members;
  const existingMemberIds = useMemo(() => {
    return new Set(groupMembers?.map((m) => m.user?.id || m.user_id) || []);
  }, [groupMembers]);

  // Students jinhe is group ka pending invite already gaya hai
  const invitedIds = useMemo(
    () => new Set(pendingInvites.map((i) => i.invited_user)),
    [pendingInvites]
  );

  const availableStudents = useMemo(() => {
    return allStudents.filter((s) => {
      if (existingMemberIds.has(s.id) || s.id === user?.id) return false;
      if (!searchStudent.trim()) return true;
      const term = searchStudent.toLowerCase();
      return (
        s.name?.toLowerCase().includes(term) ||
        s.branch?.toLowerCase().includes(term) ||
        s.year?.toString().includes(term)
      );
    });
  }, [allStudents, existingMemberIds, user?.id, searchStudent]);

  if (isPending) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <div className="spinner" />
          <p>Loading group...</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <div className="empty-state-icon">🔒</div>
          <p className="empty-state-title">Group not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/groups')}>
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  const memberCount = group.members?.length ?? 0;
  const isFull = Boolean(group.max_members && memberCount >= group.max_members);

  return (
    <div className="page-content" style={{ paddingBottom: 0 }}>
      <div className="container">
        {/* Group Header */}
        <div className="group-detail-header glass-card anim-fade-up">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/groups')}>
            ← Groups
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2rem' }}>{CATEGORY_ICONS[group.category] || '💬'}</span>
            <div>
              <h1 className="font-display" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>
                {group.name}
              </h1>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="badge badge-accent">{group.category}</span>
                <span className="badge badge-muted">
                  👤 {memberCount}
                  {group.max_members ? ` / ${group.max_members}` : ''}
                </span>
                {isAdmin && <span className="badge badge-warning">Admin</span>}
              </div>
            </div>
          </div>

          {/* Action buttons on top right */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {isMember && !isFull && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAddModal(true)}
              >
                + Add Members
              </button>
            )}

            {!isMember && group.is_open && !isFull && (
              <button
                className="btn btn-primary btn-sm"
                disabled={joinGroup.isPending}
                onClick={() => joinGroup.mutate(id)}
              >
                {joinGroup.isPending ? <span className="spinner" /> : 'Join Group'}
              </button>
            )}

            {isMember && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--danger)' }}
                onClick={handleLeave}
                disabled={leaveGroup.isPending || deleteGroup.isPending}
              >
                Leave
              </button>
            )}

            {isAdmin && (
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDeleteGroup}
                disabled={deleteGroup.isPending}
                title="Delete this group permanently"
              >
                {deleteGroup.isPending ? <span className="spinner" /> : 'Delete Group'}
              </button>
            )}
          </div>
        </div>

        {group.description && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 'var(--text-sm)', paddingLeft: 4 }}>
            {group.description}
          </p>
        )}

        {/* Mobile tabs */}
        <div className="group-detail-tabs hide-desktop">
          <button
            className={`groups-filter-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat
          </button>
          <button
            className={`groups-filter-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            👥 Members ({memberCount})
          </button>
        </div>

        {/* Two-panel layout */}
        <div className="group-detail-layout">
          {/* Members panel */}
          <div className={`group-members-panel glass-card ${activeTab === 'members' ? '' : 'hide-mobile'}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 className="font-display" style={{ fontWeight: 700, margin: 0, fontSize: 'var(--text-base)' }}>
                Members ({memberCount})
              </h3>
              {isMember && !isFull && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 10px', fontSize: 'var(--text-xs)' }}
                  onClick={() => setShowAddModal(true)}
                >
                  + Add
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {group.members?.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    className="avatar-placeholder"
                    style={{ width: 36, height: 36, fontSize: '0.65rem', flexShrink: 0 }}
                  >
                    {getInitials(m.user?.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 'var(--text-sm)',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {m.user?.name || 'Student'}
                      {m.user?.id === user.id && (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> (you)</span>
                      )}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', margin: 0 }}>
                      {[m.user?.branch, m.user?.year ? `Year ${m.user.year}` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>

                  {m.role === 'admin' ? (
                    <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 7px' }}>
                      admin
                    </span>
                  ) : (
                    isAdmin &&
                    m.user?.id !== user.id && (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--danger)', padding: '2px 6px', fontSize: '11px', lineHeight: 1 }}
                        title="Remove member"
                        onClick={() => handleRemoveMember(m.user?.id, m.user?.name)}
                        disabled={removeMember.isPending}
                      >
                        ✕
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>

            {/* Quick Share Link in sidebar */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
              <button
                className="btn btn-ghost btn-sm w-full"
                onClick={handleCopyLink}
                style={{ fontSize: 'var(--text-xs)', justifyContent: 'center' }}
              >
                {copiedLink ? '✓ Link Copied' : '🔗 Copy Group Link'}
              </button>
            </div>
          </div>

          {/* Chat panel */}
          <div className={`group-chat-panel ${activeTab === 'chat' ? '' : 'hide-mobile'}`}>
            {!isMember ? (
              <div className="glass-card empty-state" style={{ padding: 48 }}>
                <div className="empty-state-icon">🔒</div>
                <p className="empty-state-title">Members only</p>
                <p className="empty-state-desc">Join the group to participate in the discussion.</p>
                {group.is_open && !isFull && (
                  <button className="btn btn-primary" onClick={() => joinGroup.mutate(id)}>
                    Join Group
                  </button>
                )}
              </div>
            ) : (
              <div className="group-chat-wrap">
                <div className="group-chat-messages glass-card">
                  {messages.length === 0 && (
                    <div className="empty-state" style={{ padding: '32px 16px' }}>
                      <p style={{ color: 'var(--text-muted)' }}>No messages yet. Start the conversation! 👋</p>
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`chat-bubble-wrap ${isMe ? 'chat-bubble-right' : 'chat-bubble-left'}`}
                      >
                        {!isMe && (
                          <div
                            className="avatar-placeholder"
                            style={{ width: 28, height: 28, fontSize: '0.6rem', flexShrink: 0 }}
                            title={msg.sender?.name}
                          >
                            {getInitials(msg.sender?.name)}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '70%' }}>
                          {!isMe && (
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>
                              {msg.sender?.name || 'Student'}
                            </span>
                          )}
                          <div className={`chat-bubble ${isMe ? 'chat-bubble-me' : 'chat-bubble-them'}`}>
                            {msg.content}
                          </div>
                          <span className={`chat-time ${isMe ? 'text-right' : ''} text-muted`}>
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {send.error && <p className="error-message">{send.error.message}</p>}

                <div className="chat-reply-bar glass-card">
                  <textarea
                    className="form-input chat-reply-input"
                    placeholder="Message the group…"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={2}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSend}
                    disabled={send.isPending || !reply.trim()}
                  >
                    {send.isPending ? <span className="spinner" /> : 'Send ↑'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Members Modal */}
      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
        >
          <div className="modal-box" style={{ maxWidth: 520, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 className="font-display" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>
                  Add Members
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: 4 }}>
                  Invite peers to <span className="text-gradient">{group.name}</span>
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            {/* Quick Link Share */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 16,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>Group Link</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {window.location.href}
                </p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleCopyLink}>
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            {/* Student Search */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <input
                className="form-input"
                placeholder="Search students by name, branch, or year…"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                autoFocus
              />
            </div>

            {/* Student List */}
            <div
              data-lenis-prevent
              style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4, minHeight: 200, maxHeight: 300 }}
            >              {availableStudents.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px 8px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                  {searchStudent.trim()
                    ? 'No matching students found.'
                    : 'All registered students are already in this group!'}
                </p>
              </div>
            ) : (
              availableStudents.map((student) => {
                const alreadyInvited = invitedIds.has(student.id);
                return (
                  <div
                    key={student.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '10px 14px',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div
                        className="avatar-placeholder"
                        style={{ width: 34, height: 34, fontSize: '0.65rem', flexShrink: 0 }}
                      >
                        {getInitials(student.name)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {student.name}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', margin: 0 }}>
                          {[student.branch, student.year ? `Year ${student.year}` : null].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddStudent(student)}
                      disabled={invite.isPending || alreadyInvited}
                    >
                      {alreadyInvited
                        ? 'Invited'
                        : invite.isPending && invite.variables?.userId === student.id
                          ? <span className="spinner" />
                          : 'Invite'}
                    </button>
                  </div>
                );
              })
            )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}