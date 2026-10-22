// ============================================================
// MOCK COURSES — Thapar University
// Structured as if returned from a REST API
// ============================================================

export const COURSES = [
  {
    id: 'CS301',
    code: 'UCS301',
    name: 'Database Management Systems',
    shortName: 'DBMS',
    branch: ['CSE', 'IT', 'COE'],
    year: 3,
    semester: 5,
    credits: 4,
    workload: 'Medium-High',   // Low | Medium | Medium-High | High
    assessmentPattern: 'MST (30) + EST (50) + Quizzes (20)',
    prerequisites: ['CS201', 'CS101'],
    description: 'Covers relational model, SQL, ER diagrams, normalization, transactions, concurrency control, and indexing. Heavy SQL practicals.',
    tags: ['SQL', 'Normalization', 'Transactions', 'Indexing', 'ER Model'],
    aggregatedExperience: {
      avgRating: 4.1,
      totalResponses: 38,
      keyInsights: [
        'SQL practicals carry significant weight — start early',
        'Normalization questions are almost guaranteed in MST',
        'Professor usually gives past-year pattern in tutorials',
        'Project component matters more than many expect',
      ],
    },
    gradeCutData: [
      { year: 2024, semester: 'Even', O: 88, Ap: 78, A: 68, Bp: 58, B: 48, C: 38, isFresh: true },
      { year: 2023, semester: 'Odd',  O: 85, Ap: 75, A: 65, Bp: 55, B: 45, C: 35, isFresh: false },
      { year: 2022, semester: 'Even', O: 90, Ap: 80, A: 70, Bp: 60, B: 50, C: 40, isFresh: false },
    ],
    topSeniorIds: ['sen-002', 'sen-005', 'sen-009'],
  },
  {
    id: 'CS302',
    code: 'UCS302',
    name: 'Operating Systems',
    shortName: 'OS',
    branch: ['CSE', 'COE', 'IT'],
    year: 3,
    semester: 5,
    credits: 4,
    workload: 'High',
    assessmentPattern: 'MST (30) + EST (50) + Lab (20)',
    prerequisites: ['CS201'],
    description: 'Process management, memory management, file systems, deadlock, scheduling algorithms, virtual memory, and OS internals.',
    tags: ['Processes', 'Memory', 'Deadlock', 'Scheduling', 'File Systems'],
    aggregatedExperience: {
      avgRating: 3.8,
      totalResponses: 42,
      keyInsights: [
        'Heavy theory — do not underestimate the EST',
        'Scheduling algorithm numericals are always in exams',
        'Lab sessions require actual coding in C',
        'Deadlock and memory management are highest-weightage topics',
      ],
    },
    gradeCutData: [
      { year: 2024, semester: 'Odd',  O: 82, Ap: 72, A: 62, Bp: 52, B: 42, C: 32, isFresh: true },
      { year: 2023, semester: 'Even', O: 80, Ap: 70, A: 60, Bp: 50, B: 40, C: 30, isFresh: false },
      { year: 2022, semester: 'Odd',  O: 84, Ap: 74, A: 64, Bp: 54, B: 44, C: 34, isFresh: false },
    ],
    topSeniorIds: ['sen-001', 'sen-006', 'sen-010'],
  },
  {
    id: 'CS201',
    code: 'UCS201',
    name: 'Data Structures & Algorithms',
    shortName: 'DSA',
    branch: ['CSE', 'COE', 'IT', 'ECE'],
    year: 2,
    semester: 3,
    credits: 4,
    workload: 'High',
    assessmentPattern: 'MST (30) + EST (50) + Lab (20)',
    prerequisites: ['CS101'],
    description: 'Arrays, linked lists, trees, graphs, sorting, searching, dynamic programming, and algorithmic complexity analysis.',
    tags: ['Trees', 'Graphs', 'DP', 'Sorting', 'Complexity'],
    aggregatedExperience: {
      avgRating: 4.3,
      totalResponses: 65,
      keyInsights: [
        'DSA is the single most important course for placements',
        'Practice on LeetCode alongside coursework',
        'Lab exams are live coding — practice under time pressure',
        'Trees and graphs together form ~40% of the EST',
      ],
    },
    gradeCutData: [
      { year: 2024, semester: 'Odd',  O: 86, Ap: 76, A: 66, Bp: 56, B: 46, C: 36, isFresh: true },
      { year: 2023, semester: 'Even', O: 84, Ap: 74, A: 64, Bp: 54, B: 44, C: 34, isFresh: false },
    ],
    topSeniorIds: ['sen-003', 'sen-007', 'sen-011'],
  },
  {
    id: 'CS401',
    code: 'UCS401',
    name: 'Machine Learning',
    shortName: 'ML',
    branch: ['CSE', 'IT'],
    year: 4,
    semester: 7,
    credits: 3,
    workload: 'Medium-High',
    assessmentPattern: 'MST (30) + EST (40) + Project (30)',
    prerequisites: ['MA201', 'CS301'],
    description: 'Supervised and unsupervised learning, regression, classification, clustering, neural networks, model evaluation.',
    tags: ['Regression', 'Classification', 'Neural Networks', 'sklearn', 'Python'],
    aggregatedExperience: {
      avgRating: 4.5,
      totalResponses: 28,
      keyInsights: [
        'Project is 30% — choose a unique dataset early',
        'Strong Python and numpy skills are essential',
        'Theory questions on bias-variance trade-off always appear',
        'Most satisfying course in the curriculum — worth the effort',
      ],
    },
    gradeCutData: [
      { year: 2024, semester: 'Odd',  O: 88, Ap: 79, A: 70, Bp: 60, B: 50, C: 40, isFresh: true },
      { year: 2023, semester: 'Odd',  O: 85, Ap: 76, A: 67, Bp: 57, B: 47, C: 37, isFresh: false },
    ],
    topSeniorIds: ['sen-004', 'sen-008', 'sen-012'],
  },
  {
    id: 'CS303',
    code: 'UCS303',
    name: 'Computer Networks',
    shortName: 'CN',
    branch: ['CSE', 'COE', 'IT'],
    year: 3,
    semester: 6,
    credits: 4,
    workload: 'Medium',
    assessmentPattern: 'MST (30) + EST (50) + Lab (20)',
    prerequisites: ['CS201'],
    description: 'OSI model, TCP/IP, routing protocols, transport layer, application layer protocols, network security basics.',
    tags: ['TCP/IP', 'Routing', 'OSI', 'HTTP', 'Network Security'],
    aggregatedExperience: {
      avgRating: 3.9,
      totalResponses: 35,
      keyInsights: [
        'Subnetting numericals are always in both MST and EST',
        'OSI vs TCP/IP layers — know every layer cold',
        'Lab needs Cisco Packet Tracer — set it up week 1',
        'Relatively fair grading compared to other CS core subjects',
      ],
    },
    gradeCutData: [
      { year: 2024, semester: 'Even', O: 84, Ap: 74, A: 64, Bp: 54, B: 44, C: 34, isFresh: true },
      { year: 2023, semester: 'Even', O: 82, Ap: 72, A: 62, Bp: 52, B: 42, C: 32, isFresh: false },
    ],
    topSeniorIds: ['sen-005', 'sen-009', 'sen-013'],
  },
  {
    id: 'MA101',
    code: 'UMA101',
    name: 'Engineering Mathematics I',
    shortName: 'Maths I',
    branch: ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'COE', 'IT'],
    year: 1,
    semester: 1,
    credits: 5,
    workload: 'Medium',
    assessmentPattern: 'MST (30) + EST (50) + Tutorials (20)',
    prerequisites: [],
    description: 'Calculus, linear algebra, differential equations. Foundation math for all engineering disciplines.',
    tags: ['Calculus', 'Linear Algebra', 'Differential Equations', 'Matrices'],
    aggregatedExperience: {
      avgRating: 3.5,
      totalResponses: 90,
      keyInsights: [
        'Tutorials count — attend them and submit on time',
        'Differential equations are consistently high-weightage in EST',
        'Eigen values and vectors appear every year',
        'Use previous year papers — question style is very predictable',
      ],
    },
    gradeCutData: [
      { year: 2024, semester: 'Odd',  O: 80, Ap: 70, A: 60, Bp: 50, B: 40, C: 30, isFresh: true },
      { year: 2023, semester: 'Odd',  O: 78, Ap: 68, A: 58, Bp: 48, B: 38, C: 28, isFresh: false },
      { year: 2022, semester: 'Odd',  O: 82, Ap: 72, A: 62, Bp: 52, B: 42, C: 32, isFresh: false },
    ],
    topSeniorIds: ['sen-006', 'sen-010', 'sen-014'],
  },
  {
    id: 'CS304',
    code: 'UCS304',
    name: 'Software Engineering',
    shortName: 'SE',
    branch: ['CSE', 'IT', 'COE'],
    year: 3,
    semester: 6,
    credits: 3,
    workload: 'Low',
    assessmentPattern: 'MST (30) + EST (40) + Project (30)',
    prerequisites: ['CS201'],
    description: 'SDLC models, requirements engineering, design patterns, testing strategies, project management, and documentation.',
    tags: ['SDLC', 'Agile', 'UML', 'Design Patterns', 'Testing'],
    aggregatedExperience: {
      avgRating: 3.6,
      totalResponses: 30,
      keyInsights: [
        'Project is 30% — form a good team in week 1',
        'UML diagrams always appear in MST — know all 9 types',
        'Relatively light reading-based subject, good for CGPA recovery',
        'Agile and Waterfall comparison is a guaranteed MST question',
      ],
    },
    gradeCutData: [
      { year: 2024, semester: 'Even', O: 87, Ap: 77, A: 67, Bp: 57, B: 47, C: 37, isFresh: true },
    ],
    topSeniorIds: ['sen-001', 'sen-004', 'sen-008'],
  },
  {
    id: 'EC301',
    code: 'UEC301',
    name: 'Digital Signal Processing',
    shortName: 'DSP',
    branch: ['ECE', 'EEE'],
    year: 3,
    semester: 5,
    credits: 4,
    workload: 'High',
    assessmentPattern: 'MST (30) + EST (50) + Lab (20)',
    prerequisites: ['EC201'],
    description: 'Z-transforms, DFT, FFT, FIR/IIR filters, signal flow graphs, digital filter design.',
    tags: ['Z-Transform', 'DFT', 'FFT', 'Filters', 'MATLAB'],
    aggregatedExperience: {
      avgRating: 3.4,
      totalResponses: 22,
      keyInsights: [
        'Z-transform and inverse Z-transform: must master early',
        'MATLAB lab is significant — do not skip practicals',
        'FFT derivation from DFT is always in EST',
        'One of the harder ECE core subjects — start revision early',
      ],
    },
    gradeCutData: [
      { year: 2024, semester: 'Odd',  O: 78, Ap: 68, A: 58, Bp: 48, B: 38, C: 28, isFresh: true },
      { year: 2023, semester: 'Odd',  O: 75, Ap: 65, A: 55, Bp: 45, B: 35, C: 25, isFresh: false },
    ],
    topSeniorIds: ['sen-015', 'sen-016', 'sen-017'],
  },
];

export function getCourseById(id) {
  return COURSES.find(c => c.id === id) || null;
}

export function searchCourses(query, filters = {}) {
  let results = [...COURSES];
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (filters.branch) {
    results = results.filter(c => c.branch.includes(filters.branch));
  }
  if (filters.year) {
    results = results.filter(c => c.year === Number(filters.year));
  }
  if (filters.workload) {
    results = results.filter(c => c.workload === filters.workload);
  }
  return results;
}
