import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  addMyCustomSkill,
  addMySkill,
  getAllSkills,
  getMyCustomSkills,
  getMySkills,
  getSkillCounts,
  removeMyCustomSkill,
  removeMySkill,
  setMyCustomSkillLevel,
  setMySkillLevel,
} from '../services/skills';

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: getAllSkills,
    staleTime: 30 * 60_000,
  });
}

// Rows: [{ skill_id, level }]
export function useMySkills() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-skills', user?.id],
    queryFn: () => getMySkills(user.id),
    enabled: !!user?.id,
  });
}

// Sirf ids chahiye ho (jaise "kya mere paas ye skill hai?")
export function useMySkillIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-skills', user?.id],
    queryFn: () => getMySkills(user.id),
    enabled: !!user?.id,
    select: (rows) => rows.map((row) => row.skill_id),
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
      queryClient.setQueryData(['my-skills', user.id], (old = []) => {
        if (!add) return old.filter((row) => row.skill_id !== skillId);
        return old.some((row) => row.skill_id === skillId)
          ? old
          : [...old, { skill_id: skillId, level: 'Intermediate' }];
      });
      refreshCards();
    },
  });
}

export function useSetSkillLevel() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const refreshCards = useRefreshStudentCards();

  return useMutation({
    mutationFn: ({ skillId, level }) => setMySkillLevel(user.id, skillId, level),
    onSuccess: (_, { skillId, level }) => {
      queryClient.setQueryData(['my-skills', user.id], (old = []) =>
        old.map((row) => (row.skill_id === skillId ? { ...row, level } : row))
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
        old.filter((row) => row.id !== id)
      );
      refreshCards();
    },
  });
}

export function useSetCustomSkillLevel() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const refreshCards = useRefreshStudentCards();

  return useMutation({
    mutationFn: ({ id, level }) => setMyCustomSkillLevel(user.id, id, level),
    onSuccess: (_, { id, level }) => {
      queryClient.setQueryData(['my-custom-skills', user.id], (old = []) =>
        old.map((row) => (row.id === id ? { ...row, level } : row))
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