import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getMyRating, rateHelper } from '../services/ratings';

export function useMyRating(requestId, enabled = true) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-rating', requestId],
    queryFn: () => getMyRating(requestId, user.id),
    enabled: !!requestId && !!user?.id && enabled,
  });
}

export function useRateHelper(requestId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stars) => rateHelper(requestId, stars),
    onSuccess: (_, stars) => {
      queryClient.setQueryData(['my-rating', requestId], stars);
      ['students', 'student', 'skill-students', 'course-students'].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
    },
  });
}