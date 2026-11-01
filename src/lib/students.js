function hueFromId(id = '') {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

export function toStudent(profile) {
  const name = profile.name?.trim() || 'Student';
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
        proficiency: null,
      })),
    ],
    rating: null,
    reliabilityScore: null,
    responseRate: null,
    avgResponseTime: null,
    totalInteractions: null,
  };
}