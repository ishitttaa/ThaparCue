import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useRequests } from './useRequests';
import { getUnreadCounts, markChatRead } from '../services/unread';

export function useUnreadCounts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['unread', user?.id],
    queryFn: getUnreadCounts,
    enabled: !!user?.id,
    staleTime: 15_000,
  });
}

// Navbar ke badge ke liye: naye messages + jawab ka intezaar karti requests
export function useInboxBadgeCount() {
  const { user } = useAuth();
  const { data: unread = {} } = useUnreadCounts();
  const { data: requests = [] } = useRequests();

  const messages = Object.values(unread).reduce((sum, n) => sum + n, 0);
  const pending = requests.filter(
    (r) => r.status === 'pending' && r.to_user === user?.id
  ).length;

  return { total: messages + pending, messages, pending };
}

// Chat khuli ho to har naye message par "padh liya" mark karo
export function useMarkChatRead(requestId, messageCount, enabled) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!requestId || !user?.id || !enabled) return;
    markChatRead(requestId)
      .then(() => {
        queryClient.setQueryData(['unread', user.id], (old = {}) => ({
          ...old,
          [requestId]: 0,
        }));
      })
      .catch(() => {});
  }, [requestId, messageCount, enabled, user?.id, queryClient]);
}