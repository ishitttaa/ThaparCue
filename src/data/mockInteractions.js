// ============================================================
// MOCK INTERACTIONS — Sample requests and threads
// ============================================================

export const TOPIC_OPTIONS = [
  { value: 'course-selection', label: 'Course Selection', icon: '📚', desc: 'Help deciding whether to take this course' },
  { value: 'course-prep', label: 'Course Preparation', icon: '📖', desc: 'Tips on how to study / do well in this course' },
  { value: 'exam-strategy', label: 'Exam Strategy', icon: '🎯', desc: 'How to approach MST / EST for this course' },
  { value: 'skill-guidance', label: 'Skill Guidance', icon: '⚡', desc: 'How to learn this skill and what resources to use' },
  { value: 'placement-prep', label: 'Placement / Internship', icon: '💼', desc: 'Internship prep, resume advice, interview experience' },
  { value: 'project-help', label: 'Project Guidance', icon: '🛠️', desc: 'Help with a course project or independent project' },
];

// Sample interactions in the inbox
export let INTERACTIONS = [
  {
    id: 'int-001',
    requestId: 'req-001',
    senderId: 'stu-001',
    receiverId: 'sen-002',
    seniorName: 'Priya Sharma',
    seniorInitials: 'PS',
    seniorColorHue: 280,
    topic: 'course-prep',
    topicLabel: 'Course Preparation',
    courseId: 'CS301',
    courseName: 'DBMS',
    purpose: 'I want to understand what topics to prioritise for DBMS MST. Specifically asking about normalization and SQL.',
    status: 'responded',    // pending | responded | closed | flagged
    createdAt: '2026-09-01T09:30:00Z',
    messages: [
      {
        id: 'msg-001',
        senderId: 'stu-001',
        text: 'Hi Priya! I have my DBMS MST in 2 weeks. Could you tell me what topics to prioritize? I\'m confused between spending time on SQL vs normalization.',
        sentAt: '2026-09-01T09:30:00Z',
      },
      {
        id: 'msg-002',
        senderId: 'sen-002',
        text: 'Hey! Great question. For DBMS MST, normalization (1NF through BCNF) is almost always 15-20 marks. SQL is more EST-heavy but don\'t ignore joins and subqueries. I\'d say spend 40% on normalization, 35% SQL, and 25% on ER diagrams for MST.',
        sentAt: '2026-09-01T11:45:00Z',
      },
      {
        id: 'msg-003',
        senderId: 'stu-001',
        text: 'That\'s super helpful! Do practice questions from the textbook cover what they actually ask, or should I look at past papers?',
        sentAt: '2026-09-01T12:00:00Z',
      },
      {
        id: 'msg-004',
        senderId: 'sen-002',
        text: 'Past papers are 10x more useful than textbook questions. The professor tends to reuse question patterns. I\'ll share some tips — do the 2023 and 2024 MST papers, they cover normalization in a very specific way that\'s worth recognising.',
        sentAt: '2026-09-01T14:30:00Z',
      },
    ],
    rating: null,
    isRated: false,
  },
  {
    id: 'int-002',
    requestId: 'req-002',
    senderId: 'stu-001',
    receiverId: 'sen-003',
    seniorName: 'Rohan Gupta',
    seniorInitials: 'RG',
    seniorColorHue: 150,
    topic: 'placement-prep',
    topicLabel: 'Placement / Internship',
    courseId: 'CS201',
    courseName: 'DSA',
    purpose: 'Asking about your placement experience — how many months of DSA prep, which platforms, and what the interview rounds looked like.',
    status: 'responded',
    createdAt: '2026-08-28T16:00:00Z',
    messages: [
      {
        id: 'msg-005',
        senderId: 'stu-001',
        text: 'Hey Rohan! I know you got placed at Flipkart. How did you structure your DSA prep? I\'m starting now (3rd year, 8 months to campus placements).',
        sentAt: '2026-08-28T16:00:00Z',
      },
      {
        id: 'msg-006',
        senderId: 'sen-003',
        text: 'Hey! 8 months is actually very comfortable. Here\'s what I\'d do: Month 1-2: LeetCode easy, solidify all data structures. Month 3-4: Medium problems by topic. Month 5-6: Mixed mediums + some hards. Month 7: Mock interviews + contests. Month 8: Review weak areas. Striver\'s sheet is your bible.',
        sentAt: '2026-08-28T18:30:00Z',
      },
    ],
    rating: { relevanceScore: 5, appropriate: true },
    isRated: true,
  },
  {
    id: 'int-003',
    requestId: 'req-003',
    senderId: 'stu-001',
    receiverId: 'sen-011',
    seniorName: 'Siddharth Roy',
    seniorInitials: 'SR',
    seniorColorHue: 190,
    topic: 'skill-guidance',
    topicLabel: 'Skill Guidance',
    courseId: null,
    courseName: null,
    purpose: 'Want to start competitive programming seriously. Need a roadmap from scratch — what to learn, in what order, which platforms.',
    status: 'pending',
    createdAt: '2026-09-03T08:00:00Z',
    messages: [
      {
        id: 'msg-007',
        senderId: 'stu-001',
        text: 'Hi Siddharth! I\'ve seen you\'re an ICPC qualifier. I want to start CP from scratch (comfortable with DSA basics). Where do I start?',
        sentAt: '2026-09-03T08:00:00Z',
      },
    ],
    rating: null,
    isRated: false,
  },
];

// Add a new interaction (mock mutation)
export function addInteraction(interaction) {
  INTERACTIONS.push(interaction);
}

// Add a message to an existing interaction
export function addMessage(interactionId, message) {
  const interaction = INTERACTIONS.find(i => i.id === interactionId);
  if (interaction) {
    interaction.messages.push(message);
    interaction.status = 'responded';
  }
}

// Submit a rating
export function submitRating(interactionId, rating) {
  const interaction = INTERACTIONS.find(i => i.id === interactionId);
  if (interaction) {
    interaction.rating = rating;
    interaction.isRated = true;
    interaction.status = 'closed';
  }
}

export function getInteractionById(id) {
  return INTERACTIONS.find(i => i.id === id) || null;
}
