export const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export function levelRank(level) {
  return LEVELS.indexOf(level);
}