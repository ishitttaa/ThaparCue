import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../services/profiles';

export function useMyProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getMyProfile(user.id),
    enabled: !!user?.id,
  });
}