import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { toStudent } from '../lib/students';
import { getOtherProfiles, getProfileById, getStudentsWithSkill } from '../services/profiles';

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
export function useStudentsWithSkill(skillId) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['skill-students', skillId],
    queryFn: () => getStudentsWithSkill(skillId, user.id),
    enabled: !!skillId && !!user?.id,
    select: (rows) => rows.map(toStudent),
  });
}