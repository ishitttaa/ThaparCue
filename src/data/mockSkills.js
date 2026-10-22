// ============================================================
// MOCK SKILLS — Searchable skill profiles
// ============================================================

export const SKILLS = [
  {
    id: 'sk-001',
    name: 'Python',
    category: 'Programming',
    icon: '🐍',
    description: 'Python for scripting, automation, data science, ML, and backend development.',
    seniorIds: ['sen-002', 'sen-004', 'sen-007', 'sen-008', 'sen-012'],
    demandLevel: 'Very High',
    useCases: ['Data Science', 'Machine Learning', 'Backend APIs', 'Automation', 'Research'],
  },
  {
    id: 'sk-002',
    name: 'DSA & Competitive Programming',
    category: 'Core CS',
    icon: '⚡',
    description: 'Data structures, algorithms, and competitive programming for placements and contests.',
    seniorIds: ['sen-003', 'sen-007', 'sen-011'],
    demandLevel: 'Very High',
    useCases: ['Placement Prep', 'ICPC', 'LeetCode', 'Interview Prep'],
  },
  {
    id: 'sk-003',
    name: 'Machine Learning',
    category: 'AI/ML',
    icon: '🤖',
    description: 'Supervised/unsupervised learning, model building, evaluation, and deployment.',
    seniorIds: ['sen-002', 'sen-004', 'sen-008', 'sen-012'],
    demandLevel: 'High',
    useCases: ['Research Projects', 'Kaggle', 'Final Year Projects', 'Internships'],
  },
  {
    id: 'sk-004',
    name: 'React',
    category: 'Frontend',
    icon: '⚛️',
    description: 'React.js for building modern web interfaces and single-page applications.',
    seniorIds: ['sen-007', 'sen-008', 'sen-001'],
    demandLevel: 'High',
    useCases: ['Web Projects', 'Hackathons', 'Internships', 'Portfolio'],
  },
  {
    id: 'sk-005',
    name: 'SQL & Databases',
    category: 'Data',
    icon: '🗄️',
    description: 'Relational databases, SQL queries, optimization, and database design.',
    seniorIds: ['sen-002', 'sen-005', 'sen-009'],
    demandLevel: 'High',
    useCases: ['Backend Development', 'DBMS Course', 'Data Engineering'],
  },
  {
    id: 'sk-006',
    name: 'Figma / UI Design',
    category: 'Design',
    icon: '🎨',
    description: 'UI/UX design, wireframing, prototyping, and design systems in Figma.',
    seniorIds: ['sen-008', 'sen-004'],
    demandLevel: 'Medium',
    useCases: ['Hackathons', 'Product Roles', 'Portfolio', 'Club Projects'],
  },
  {
    id: 'sk-007',
    name: 'System Design',
    category: 'Core CS',
    icon: '🏗️',
    description: 'Designing scalable distributed systems — for interviews and real-world applications.',
    seniorIds: ['sen-001', 'sen-003'],
    demandLevel: 'High',
    useCases: ['Senior Interviews', 'SDE Roles', 'System Architecture'],
  },
  {
    id: 'sk-008',
    name: 'C++',
    category: 'Programming',
    icon: '💻',
    description: 'C++ for competitive programming, systems programming, and core CS courses.',
    seniorIds: ['sen-001', 'sen-011', 'sen-003'],
    demandLevel: 'High',
    useCases: ['CP', 'OS Course', 'Systems', 'Placement Coding Rounds'],
  },
  {
    id: 'sk-009',
    name: 'MATLAB',
    category: 'Technical',
    icon: '📊',
    description: 'MATLAB for signal processing, numerical methods, and engineering simulation.',
    seniorIds: ['sen-006', 'sen-014', 'sen-015'],
    demandLevel: 'Medium',
    useCases: ['DSP Course', 'Research', 'ECE Lab', 'Simulation'],
  },
  {
    id: 'sk-010',
    name: 'Deep Learning',
    category: 'AI/ML',
    icon: '🧠',
    description: 'Neural networks, CNNs, RNNs, transformers — theory and implementation.',
    seniorIds: ['sen-004', 'sen-012'],
    demandLevel: 'High',
    useCases: ['Final Year Projects', 'Research', 'AI Competitions'],
  },
  {
    id: 'sk-011',
    name: 'Backend Development (Node/FastAPI)',
    category: 'Backend',
    icon: '🔧',
    description: 'Server-side development, REST APIs, authentication, and database integration.',
    seniorIds: ['sen-005', 'sen-001', 'sen-009'],
    demandLevel: 'Very High',
    useCases: ['Web Projects', 'Hackathons', 'Internships', 'Startup Projects'],
  },
  {
    id: 'sk-012',
    name: 'Cloud (AWS/GCP)',
    category: 'DevOps',
    icon: '☁️',
    description: 'Cloud platforms, deployment, serverless functions, and managed services.',
    seniorIds: ['sen-005', 'sen-010'],
    demandLevel: 'Medium-High',
    useCases: ['Deployment', 'Internships', 'Cloud Certifications'],
  },
  {
    id: 'sk-013',
    name: 'Embedded Systems',
    category: 'Hardware',
    icon: '🔌',
    description: 'Microcontrollers, Arduino, Raspberry Pi, and real-time embedded programming.',
    seniorIds: ['sen-006', 'sen-015'],
    demandLevel: 'Medium',
    useCases: ['ECE Projects', 'IoT', 'Robotics Club', 'Competitions'],
  },
  {
    id: 'sk-014',
    name: 'Data Analysis / pandas',
    category: 'Data',
    icon: '📈',
    description: 'Exploratory data analysis, visualization, and data wrangling with Python.',
    seniorIds: ['sen-002', 'sen-012', 'sen-004'],
    demandLevel: 'High',
    useCases: ['Research', 'Data Internships', 'Kaggle', 'Course Projects'],
  },
  {
    id: 'sk-015',
    name: 'Video Editing',
    category: 'Creative',
    icon: '🎬',
    description: 'Adobe Premiere Pro / DaVinci Resolve for video content, college events, and clubs.',
    seniorIds: [],
    demandLevel: 'Low',
    useCases: ['College Events', 'Content Creation', 'Club Projects'],
  },
  {
    id: 'sk-016',
    name: 'Linux / Unix',
    category: 'Systems',
    icon: '🐧',
    description: 'Shell scripting, process management, and Linux system administration.',
    seniorIds: ['sen-013', 'sen-010', 'sen-001'],
    demandLevel: 'Medium',
    useCases: ['OS Course', 'DevOps', 'Internships', 'Development Environment'],
  },
  {
    id: 'sk-017',
    name: 'Research & Paper Writing',
    category: 'Academic',
    icon: '📝',
    description: 'Research methodology, LaTeX, paper submission, and academic writing.',
    seniorIds: ['sen-004', 'sen-012'],
    demandLevel: 'Low-Medium',
    useCases: ['Conference Papers', 'Final Year Project Reports', 'Journal Submissions'],
  },
  {
    id: 'sk-018',
    name: 'CAD (SolidWorks/AutoCAD)',
    category: 'Design',
    icon: '📐',
    description: '3D modelling and mechanical design for engineering projects.',
    seniorIds: [],
    demandLevel: 'Low',
    useCases: ['ME Projects', 'Robotics', 'Product Design'],
  },
  {
    id: 'sk-019',
    name: 'Java / Spring Boot',
    category: 'Backend',
    icon: '☕',
    description: 'Java enterprise development, Spring Boot applications, and REST services.',
    seniorIds: ['sen-003', 'sen-010'],
    demandLevel: 'Medium-High',
    useCases: ['Placement Prep', 'Enterprise Internships', 'Backend Projects'],
  },
  {
    id: 'sk-020',
    name: 'Network Security',
    category: 'Security',
    icon: '🔒',
    description: 'Ethical hacking basics, cybersecurity concepts, CTF competitions.',
    seniorIds: ['sen-013'],
    demandLevel: 'Medium',
    useCases: ['CTF', 'Security Internships', 'CN Course Extension'],
  },
];

export function searchSkills(query, filter = '') {
  let results = [...SKILLS];
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.useCases.some(u => u.toLowerCase().includes(q))
    );
  }
  if (filter && filter !== 'All') {
    results = results.filter(s => s.category === filter);
  }
  return results;
}

export const SKILL_CATEGORIES = [
  'All', 'Programming', 'Core CS', 'AI/ML', 'Frontend', 'Backend',
  'Data', 'Design', 'DevOps', 'Hardware', 'Systems', 'Academic', 'Creative', 'Security', 'Technical',
];
