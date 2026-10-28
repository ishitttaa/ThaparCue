
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const TABS = ['all', 'pending', 'accepted', 'rejected'];

function parseRequestMessage(rawMessage = '') {
  const result = {
    topic: '',
    courseId: '',
    message: rawMessage.trim(),
  };

  const topicMatch = rawMessage.match(/^Topic:\s*(.+)$/m);
  const courseMatch = rawMessage.match(/^Course ID:\s*(.+)$/m);

  if (topicMatch) result.topic = topicMatch[1].trim();
  if (courseMatch) result.courseId = courseMatch[1].trim();

  if (topicMatch || courseMatch) {
    result.message = rawMessage
      .replace(/^Topic:\s*.+\n?/m, '')
      .replace(/^Course ID:\s*.+\n?/m, '')
      .trim();
  }

  return result;
}

export default function InboxPage() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadRequests = useCallback(async () => {
    if (!user?.id) {
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('requests')
        .select(`
          id,
          from_user,
          to_user,
          message,
          status,
          created_at,
          sender:profiles!requests_from_user_fkey(id, name, branch),
          receiver:profiles!requests_to_user_fkey(id, name, branch)
        `)
        .or(`from_user.eq.${user.id},to_user.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setRequests(data || []);
    } catch (err) {
      console.error('Inbox load error:', err);
      setError(err.message || 'Requests load nahi ho paayi.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const respondToRequest = async (requestId, newStatus) => {
    if (!user?.id) return;

    setUpdatingId(requestId);
    setError('');

    try {
      const { data, error: updateError } = await supabase
        .from('requests')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .eq('to_user', user.id)
        .eq('status', 'pending')
        .select('id, status')
        .maybeSingle();

      if (updateError) throw updateError;

      if (!data) {
        throw new Error(
          'Request update nahi hui. Ho sakta hai request pehle hi respond ho chuki ho.'
        );
      }

      setRequests((previous) =>
        previous.map((request) =>
          request.id === requestId
            ? { ...request, status: data.status }
            : request
        )
      );
    } catch (err) {
      console.error('Request response error:', err);
      setError(err.message || 'Request update nahi ho paayi.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      activeTab === 'all' || request.status === activeTab
  );

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading inbox...</p>
      </div>
    );
  }

  return (
    <div className="page-container inbox-page">
      <div className="page-header">
        <h1>Inbox</h1>
        <p>Manage your skill-sharing requests.</p>
      </div>

      <div className="inbox-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`inbox-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'all' && requests.length > 0 && (
              <span className="tab-count">{requests.length}</span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
          <button type="button" onClick={loadRequests}>
            Retry
          </button>
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <h3>
            No {activeTab === 'all' ? '' : activeTab} requests yet
          </h3>
          <p>Your sent and received requests will appear here.</p>
          <Link to="/explore">Explore students</Link>
        </div>
      ) : (
        <div className="request-list">
          {filteredRequests.map((request) => {
            const sentByMe = request.from_user === user?.id;

            const otherPerson = sentByMe
              ? request.receiver
              : request.sender;

            const details = parseRequestMessage(
              request.message || ''
            );

            return (
              <article className="request-card" key={request.id}>
                <div className="request-card-header">
                  <div className="request-avatar">
                    {(otherPerson?.name || '?')
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="request-person">
                    <h3>{otherPerson?.name || 'Student'}</h3>

                    <p>
                      {sentByMe ? 'Sent by you' : 'Received by you'}
                      {' · '}
                      {new Date(request.created_at).toLocaleDateString(
                        'en-IN',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                        }
                      )}
                    </p>

                    {otherPerson?.branch && (
                      <p>{otherPerson.branch}</p>
                    )}
                  </div>

                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </div>

                <div className="request-details">
                  {details.topic && (
                    <p>
                      <strong>Topic:</strong> {details.topic}
                    </p>
                  )}

                  {details.courseId && (
                    <p>
                      <strong>Course ID:</strong> {details.courseId}
                    </p>
                  )}

                  {details.message && (
                    <p className="request-message">
                      {details.message}
                    </p>
                  )}
                </div>

                {!sentByMe && request.status === 'pending' && (
                  <div className="request-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={updatingId === request.id}
                      onClick={() =>
                        respondToRequest(request.id, 'accepted')
                      }
                    >
                      {updatingId === request.id
                        ? 'Updating...'
                        : 'Accept'}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={updatingId === request.id}
                      onClick={() =>
                        respondToRequest(request.id, 'rejected')
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}

                {request.status === 'accepted' && (
                  <div className="request-actions">
                    <Link
                      to={`/inbox/${request.id}`}
                      className="btn btn-primary"
                    >
                      Open Chat →
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
