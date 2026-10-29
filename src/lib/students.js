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
    // Abhi database mein nahi hain, isliye null (cards inhe chhupa dengi)
    skills: [],
    rating: null,
    reliabilityScore: null,
    responseRate: null,
    avgResponseTime: null,
    totalInteractions: null,
  };
}