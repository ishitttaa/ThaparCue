import { describe, expect, it } from 'vitest';
import { courseMatch, matchScore, recencyScore } from './matchScore';

describe('matchScore', () => {
  it('gives full course match for 3+ overlapping courses', () => {
    expect(courseMatch(['a', 'b', 'c', 'x'], ['a', 'b', 'c', 'd'])).toBe(1);
  });
  it('ignores the course part when no target courses are known', () => {
    expect(courseMatch(['a'], [])).toBeNull();
  });
  it('halves recency every 30 days', () => {
    const now = Date.now();
    const ago = new Date(now - 30 * 86_400_000).toISOString();
    expect(recencyScore(ago, now)).toBeCloseTo(0.5, 2);
  });
  it('ranks a reliable course match above an unreliable stranger', () => {
    const viewer = { branch: 'X', year: 2 };
    const good = { branch: 'X', currentYear: 4, courseIds: ['a'], reliability01: 0.9, responseRate01: 0.9, lastActiveAt: new Date().toISOString() };
    const bad = { branch: 'Y', currentYear: 1, courseIds: [], reliability01: 0.2, responseRate01: 0.1, lastActiveAt: null };
    const a = matchScore({ viewer, candidate: good, targetCourseIds: ['a'] }).score;
    const b = matchScore({ viewer, candidate: bad, targetCourseIds: ['a'] }).score;
    expect(a).toBeGreaterThan(b);
  });
});