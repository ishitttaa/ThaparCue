import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getMyRequests, respondToRequest } from '../services/requests';

export function useRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['requests', user?.id],
    queryFn: () => getMyRequests(user.id),
    enabled: !!user?.id,
  });
}

export function useRespondToRequest() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, status }) =>
      respondToRequest({ requestId, userId: user.id, status }),
    onSuccess: (data) => {
      queryClient.setQueryData(['requests', user.id], (old = []) =>
        old.map((r) => (r.id === data.id ? { ...r, status: data.status } : r))
      );
    },
  });
}