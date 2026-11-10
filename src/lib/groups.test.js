import { describe, expect, it } from 'vitest';

// Test category validation and icon mappings
const CATEGORIES = ['all', 'hackathon', 'competition', 'event', 'general'];
const CATEGORY_ICONS = { hackathon: '🚀', competition: '🏆', event: '📅', general: '💬', all: '🌐' };

describe('Groups feature configuration', () => {
  it('has all expected categories defined', () => {
    expect(CATEGORIES).toContain('hackathon');
    expect(CATEGORIES).toContain('competition');
    expect(CATEGORIES).toContain('event');
    expect(CATEGORIES).toContain('general');
  });

  it('has valid emoji icons for all categories', () => {
    CATEGORIES.forEach((cat) => {
      expect(CATEGORY_ICONS[cat]).toBeDefined();
      expect(typeof CATEGORY_ICONS[cat]).toBe('string');
    });
  });

  it('properly determines member status from my_membership or created_by', () => {
    const isMember = (group, userId) =>
      group.my_membership?.some((m) => m.user_id === userId) ||
      group.created_by === userId;

    const groupA = { created_by: 'user-1', my_membership: [] };
    const groupB = { created_by: 'user-2', my_membership: [{ user_id: 'user-1' }] };
    const groupC = { created_by: 'user-2', my_membership: [{ user_id: 'user-3' }] };

    expect(isMember(groupA, 'user-1')).toBe(true);  // creator
    expect(isMember(groupB, 'user-1')).toBe(true);  // joined member
    expect(isMember(groupC, 'user-1')).toBe(false); // not joined
  });

  it('enforces group capacity logic', () => {
    const isFull = (group) => {
      const count = group.members?.[0]?.count ?? 0;
      return Boolean(group.max_members && count >= group.max_members);
    };

    expect(isFull({ max_members: 5, members: [{ count: 5 }] })).toBe(true);
    expect(isFull({ max_members: 5, members: [{ count: 4 }] })).toBe(false);
    expect(isFull({ max_members: null, members: [{ count: 100 }] })).toBe(false);
  });
});

