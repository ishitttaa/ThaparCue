export const WEIGHTS = {
  course: 0.3,
  recency: 0.1,
  context: 0.15,
  reliability: 0.3,
  response: 0.15,
};

const clamp01 = (x) => Math.max(0, Math.min(1, x));

// Is student ne kitne chahiye wale courses kiye hain (3 ya zyada = full marks)
export function courseMatch(candidateIds = [], targetIds = []) {
  if (targetIds.length === 0) return null; // pata nahi kya chahiye, to is hisse ko ginna nahi
  const wanted = new Set(targetIds);
  const overlap = candidateIds.filter((id) => wanted.has(id)).length;
  return clamp01(overlap / Math.min(3, targetIds.length));
}


export function recencyScore(lastActiveAt, now = Date.now()) {
  if (!lastActiveAt) return 0.2;
  const days = Math.max(0, (now - new Date(lastActiveAt).getTime()) / 86_400_000);
  return clamp01(0.5 ** (days / 30));
}

// Same branch (60%) aur senior hone ka bonus (40%)
export function contextScore(viewer, candidate) {
  const sameBranch = viewer?.branch && candidate.branch === viewer.branch ? 1 : 0;
  let seniority = 0.5;
  if (viewer?.year && candidate.currentYear) {
    seniority =
      candidate.currentYear > viewer.year ? 1 : candidate.currentYear === viewer.year ? 0.5 : 0.1;
  }
  return 0.6 * sameBranch + 0.4 * seniority;
}

export function matchScore({
  viewer,
  candidate,
  targetCourseIds = [],
  now = Date.now(),
  weights = WEIGHTS,
}) {
  const parts = {
    course: courseMatch(candidate.courseIds, targetCourseIds),
    recency: recencyScore(candidate.lastActiveAt, now),
    context: contextScore(viewer, candidate),
    reliability: candidate.reliability01 ?? 0.5,
    response: candidate.responseRate01 ?? 0.5,
  };
  let total = 0;
  let used = 0;
  for (const [key, weight] of Object.entries(weights)) {
    if (parts[key] == null) continue;
    total += weight * parts[key];
    used += weight;
  }
  return { score: used ? clamp01(total / used) : 0, parts };
}

export function rankStudents(students, viewer, targetCourseIds = [], now = Date.now()) {
  return students
    .map((s) => {
      const { score, parts } = matchScore({ viewer, candidate: s, targetCourseIds, now });
      return { ...s, matchScore: score, matchParts: parts };
    })
    .sort((a, b) => b.matchScore - a.matchScore || a.name.localeCompare(b.name));
}

// Viewer ki branch ke is aur agle year ke courses jo usne abhi nahi kiye
export function targetCoursesFor(viewer, allCourses = [], myCourseIds = []) {
  if (!viewer?.branch || !viewer?.year) return [];
  const mine = new Set(myCourseIds);
  return allCourses
    .filter(
      (c) =>
        c.groups.includes(viewer.branch) &&
        c.year >= viewer.year &&
        c.year <= viewer.year + 1 &&
        !mine.has(c.id)
    )
    .map((c) => c.id);
}