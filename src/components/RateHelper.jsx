import StarRating from './StarRating';
import { useMyRating, useRateHelper } from '../hooks/useRatings';

export default function RateHelper({ request, messages, userId }) {
  const isRequester = request.from_user === userId;
  const { data: myStars = null } = useMyRating(request.id, isRequester);
  const rate = useRateHelper(request.id);

  if (!isRequester) return null;

  const helperName = request.receiver?.name || 'this student';
  const helperReplied = messages.some((m) => m.sender_id === request.to_user);
  const canRate = messages.length >= 2 && helperReplied;

  return (
    <div className="glass-card" style={{ padding: 'var(--space-3) var(--space-4)', margin: 'var(--space-3) 0' }}>
      {canRate ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600 }}>
          {myStars? `Your rating for ${helperName}`: `You asked ${helperName} for help. How helpful were they?`}
          </span>
          <StarRating
            value={myStars ?? 0}
            disabled={rate.isPending}
            onChange={(stars) => rate.mutate(stars)}
          />
          {myStars && (
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
              Thanks! You can change it anytime.
            </span>
          )}
        </div>
      ) : (
        <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
          You can rate {helperName} after you have exchanged a couple of messages.
        </span>
      )}
      {rate.error && (
        <p role="alert" style={{ color: '#f87171', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
          {rate.error.message || 'Could not save your rating.'}
        </p>
      )}
    </div>
  );
}