import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  addMyCustomSkill,
  addMySkill,
  getAllSkills,
  getMyCustomSkills,
  getMySkillIds,
  getSkillCounts,
  removeMyCustomSkill,
  removeMySkill,
} from '../services/skills';

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: getAllSkills,
    staleTime: 30 * 60_000,
  });
}

export function useMySkillIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-skill-ids', user?.id],
    queryFn: () => getMySkillIds(user.id),
    enabled: !!user?.id,
  });
}

export function useMyCustomSkills() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-custom-skills', user?.id],
    queryFn: () => getMyCustomSkills(user.id),
    enabled: !!user?.id,
  });
}

function useRefreshStudentCards() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['students'] });
    queryClient.invalidateQueries({ queryKey: ['student', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['skill-counts'] });
    queryClient.invalidateQueries({ queryKey: ['skill-students'] });
  };
}

export function useToggleMySkill() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const refreshCards = useRefreshStudentCards();

  return useMutation({
    mutationFn: ({ skillId, add }) =>
      add ? addMySkill(user.id, skillId) : removeMySkill(user.id, skillId),
    onSuccess: (_, { skillId, add }) => {
      queryClient.setQueryData(['my-skill-ids', user.id], (old = []) =>
        add
          ? old.includes(skillId) ? old : [...old, skillId]
          : old.filter((id) => id !== skillId)
      );
      refreshCards();
    },
  });
}

export function useAddCustomSkill() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const refreshCards = useRefreshStudentCards();

  return useMutation({
    mutationFn: (name) => addMyCustomSkill(user.id, name),
    onSuccess: (created) => {
      queryClient.setQueryData(['my-custom-skills', user.id], (old = []) => [
        ...old,
        created,
      ]);
      refreshCards();
    },
  });
}

export function useRemoveCustomSkill() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const refreshCards = useRefreshStudentCards();

  return useMutation({
    mutationFn: (id) => removeMyCustomSkill(user.id, id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['my-custom-skills', user.id], (old = []) =>
        old.filter((s) => s.id !== id)
      );
      refreshCards();
    },
  });
}
export function useSkillCounts() {
  return useQuery({
    queryKey: ['skill-counts'],
    queryFn: getSkillCounts,
    staleTime: 60_000,
  });
}