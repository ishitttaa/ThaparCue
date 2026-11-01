import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  addMyCourse,
  getAllCourses,
  getCourseByCode,
  getCourseStudents,
  getMyCourseIds,
  removeMyCourse,
} from '../services/courses';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
    staleTime: 30 * 60_000,
  });
}

export function useCourse(code) {
  return useQuery({
    queryKey: ['course', code],
    queryFn: () => getCourseByCode(code),
    enabled: !!code,
  });
}

export function useMyCourseIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-course-ids', user?.id],
    queryFn: () => getMyCourseIds(user.id),
    enabled: !!user?.id,
  });
}

export function useToggleMyCourse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, add }) =>
      add ? addMyCourse(user.id, courseId) : removeMyCourse(user.id, courseId),
    onSuccess: (_, { courseId, add }) => {
      queryClient.setQueryData(['my-course-ids', user.id], (old = []) =>
        add
          ? old.includes(courseId) ? old : [...old, courseId]
          : old.filter((id) => id !== courseId)
      );
      queryClient.invalidateQueries({ queryKey: ['course-students'] });
    },
  });
}

export function useCourseStudents(courseId) {
  return useQuery({
    queryKey: ['course-students', courseId],
    queryFn: () => getCourseStudents(courseId),
    enabled: !!courseId,
  });
}