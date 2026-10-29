import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getOtherProfiles, getProfileById } from '../services/profiles';
import { toStudent } from '../lib/students';

export function useStudents() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['students', user?.id],
    queryFn: () => getOtherProfiles(user.id),
    enabled: !!user?.id,
    select: (rows) => rows.map(toStudent),
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => getProfileById(id),
    enabled: !!id,
    select: (row) => (row ? toStudent(row) : null),
  });
}