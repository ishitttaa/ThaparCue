import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile } from '../services/profiles';

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => updateMyProfile(user.id, values),
    onSuccess: (saved) => {
      queryClient.setQueryData(['profile', user.id], saved);
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', user.id] });
    },
  });
}