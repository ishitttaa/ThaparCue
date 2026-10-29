import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRequests, useRespondToRequest } from '../../hooks/useRequests';
import RequestCard from '../../components/RequestCard';

const TABS = ['all', 'pending', 'accepted', 'rejected'];

export default function InboxPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const { data: requests = [], isPending, error, refetch } = useRequests();
  const respond = useRespondToRequest();

  if (isPending) {
    return <div className="page-container"><p>Loading inbox...</p></div>;
  }

  const visible = requests.filter(
    (r) => activeTab === 'all' || r.status === activeTab
  );
  const errorMessage = error?.message || respond.error?.message;
  const busyId = respond.isPending ? respond.variables?.requestId : null;

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

      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
          <button type="button" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="empty-state">
          <h3>No {activeTab === 'all' ? '' : activeTab} requests yet</h3>
          <p>Your sent and received requests will appear here.</p>
          <Link to="/explore">Explore students</Link>
        </div>
      ) : (
        <div className="request-list">
          {visible.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              userId={user.id}
              busy={busyId === request.id}
              onRespond={(requestId, status) =>
                respond.mutate({ requestId, status })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}