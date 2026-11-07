// Tag slugs MUST match the database CHECK on course_reviews.tags exactly.
export const REVIEW_TAGS = [
  { value: 'practicals_heavy', label: 'Practicals heavy' },
  { value: 'tutorials_matter', label: 'Tutorials matter' },
  { value: 'scoring', label: 'Scoring' },
  { value: 'theory_heavy', label: 'Theory heavy' },
  { value: 'assignments_heavy', label: 'Assignments heavy' },
  { value: 'project_based', label: 'Project based' },
  { value: 'attendance_strict', label: 'Attendance strict' },
  { value: 'needs_prior_knowledge', label: 'Needs prior knowledge' },
  { value: 'good_for_placements', label: 'Good for placements' },
];
export const MAX_REVIEW_TAGS = 4;

// odd = Jul-Dec, even = Jan-Jun
export const SEMESTERS = [
  { value: 'odd', label: 'Odd semester (Jul-Dec)' },
  { value: 'even', label: 'Even semester (Jan-Jun)' },
];

export const GRADES = [
  { key: 'o_min', label: 'O' },
  { key: 'aplus_min', label: 'A+' },
  { key: 'a_min', label: 'A' },
  { key: 'bplus_min', label: 'B+' },
  { key: 'b_min', label: 'B' },
  { key: 'c_min', label: 'C' },
];

export function yearChoices(count = 8) {
  const now = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => now - i);
}

export function defaultSemester(date = new Date()) {
  return date.getMonth() >= 6 ? 'odd' : 'even';
}

export const tagLabel = (slug) => REVIEW_TAGS.find((t) => t.value === slug)?.label ?? slug;
export const semesterLabel = (value) => (value === 'odd' ? 'Odd' : 'Even');

export function insightErrorMessage(error) {
  switch (error?.code) {
    case '42501':
      return 'You can only add this for a course you have marked as taken, and your account must be active.';
    case '23514':
      return 'Some values are not allowed. Please check your answers.';
    case '23505':
      return 'You already added an entry for this batch.';
    default:
      return error?.message || 'Something went wrong. Please try again.';
  }
}
