function hueFromId(id = '') {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

export function toStudent(profile) {
  const name = profile.name?.trim() || 'Student';
  const stats = profile.stats ?? {};
  const ratingCount = Number(stats.rating_count ?? 0);
  const received = Number(stats.received_count ?? 0);
  const isNew = ratingCount === 0 && received < 2;

  return {
    id: profile.id,
    name,
    branch: profile.branch || 'Branch not added',
    currentYear: profile.year ?? null,
    isAlumni: false,
    bio: profile.bio?.trim() || 'No bio added yet.',
    initials: name
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    colorHue: hueFromId(profile.id),
    skills: [
      ...(profile.profile_skills ?? [])
        .filter((row) => row.skill?.name)
        .map((row) => ({ name: row.skill.name, proficiency: row.level })),
      ...(profile.profile_custom_skills ?? []).map((row) => ({
        name: row.name,
        proficiency: row.level,
      })),
    ],
    courseIds: (profile.profile_courses ?? []).map((row) => row.course_id),

    // Reputation (asli data)
    rating: ratingCount > 0 ? Number(stats.rating_avg) : null,
    ratingCount,
    responseRate:
      stats.response_rate != null ? Math.round(Number(stats.response_rate) * 100) : null,
    reliabilityScore:
      !isNew && stats.reliability != null ? Math.round(Number(stats.reliability)) : null,
    isNew,

    // Match score ke liye (0 se 1)
    reliability01: stats.reliability != null ? Number(stats.reliability) / 100 : null,
    responseRate01: stats.response_rate != null ? Number(stats.response_rate) : null,
    lastActiveAt: stats.last_active_at ?? null,
  };
}