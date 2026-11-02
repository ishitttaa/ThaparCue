import { useMemo } from 'react';
import { useMyProfile } from './useMyProfile';
import { useCourses, useMyCourseIds } from './useCourses';
import { targetCoursesFor } from '../lib/matchScore';

export function useMatchContext() {
  const { data: viewer } = useMyProfile();
  const { data: courses = [] } = useCourses();
  const { data: myCourseIds = [] } = useMyCourseIds();
  const targetCourseIds = useMemo(
    () => targetCoursesFor(viewer, courses, myCourseIds),
    [viewer, courses, myCourseIds]
  );
  return { viewer, targetCourseIds };
}