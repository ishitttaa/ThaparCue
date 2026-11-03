
export function weeklyHours(course) {
  if (course?.l == null || course?.t == null || course?.p == null) return null;
  return course.l + course.t + course.p;
}

export function workload(course) {
  const hours = weeklyHours(course);
  if (hours == null) return null;
  if (hours <= 4) return { label: 'Light', hours };
  if (hours <= 6) return { label: 'Moderate', hours };
  return { label: 'Heavy', hours };
}

export const WORKLOAD_BADGE = {
  Light: 'badge-success',
  Moderate: 'badge-accent',
  Heavy: 'badge-warning',
};