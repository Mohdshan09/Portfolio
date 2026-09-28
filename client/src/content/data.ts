import type {
  Certificate,
  EducationEntry,
  Experience,
  Profile,
  Project,
  Publication,
  SkillGroup,
} from './types';

export const profile: Profile = {
  name: 'Mohammad Shan',
  headline: 'Full-Stack Developer · MERN & Next.js',
  summary:
    'Full-stack developer with hands-on experience building scalable web applications and ' +
    'AI-powered platforms — including content generation systems and machine-learning-based ' +
    'tools — using the MERN stack and Next.js. Strong in RESTful APIs, authentication systems, ' +
    'and production-ready ERP, SaaS, and e-commerce platforms, backed by a solid foundation in ' +
    'Data Structures.',
  location: 'Raipur, IN',
  email: 'mohdshan1024@gmail.com',
  phone: '+91 91094 62934',
  socials: {
    linkedin: 'https://www.linkedin.com/in/mohdshan09',
  },
  resumeUrl: '/resume.pdf',
  availableForWork: true,
};

export const skills: SkillGroup[] = [
  {
    category: 'language',
    items: ['Java', 'Python', 'C', 'C++', 'HTML', 'CSS', 'JavaScript', 'TypeScript'],
  },
  {
    category: 'framework',
    items: ['React.js', 'Node.js', 'Express.js', 'Next.js', 'Tailwind CSS'],
  },
  { category: 'database', items: ['MongoDB', 'PostgreSQL'] },
  { category: 'tool', items: ['NumPy', 'Pandas', 'Matplotlib'] },
  {
    category: 'concept',
    items: ['OOP', 'DBMS', 'Operating Systems', 'Data Structures & Algorithms'],
  },
];

export const experience: Experience[] = [
  {
    company: 'BHN System and Solution Pvt. Ltd.',
    role: 'Full-Stack Developer Intern',
    type: 'internship',
    startDate: '2025-10',
    endDate: null,
    bullets: [
      'Developing a full-stack School ERP system using Next.js, PostgreSQL, Prisma, and Tailwind CSS',
      'Implementing secure authentication and role-based access control for admins, teachers, and parents',
      'Designing responsive UI components ensuring a seamless experience across devices',
    ],
    techStack: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
    liveUrl: 'https://eduerp.net/',
  },
  {
    company: 'Zidio Development',
    role: 'Full-Stack Developer Intern',
    type: 'internship',
    startDate: '2025-03',
    endDate: '2025-05',
    bullets: [
      'Designed and developed a full-stack e-commerce website with responsive UI components using JavaScript and React.js',
      'Integrated backend services using Node.js and Express.js',
      'Implemented product listings, cart system, and user authentication',
    ],
    techStack: ['React.js', 'Node.js', 'Express.js', 'JavaScript'],
    liveUrl: 'https://forever-frontendv3.vercel.app',
  },
];

export const projects: Project[] = [
  {
    slug: 'examlyst',
    title: 'ExamLyst',
    shortDescription: 'B2B online assessment platform with AI-resistant integrity monitoring.',
    role: 'Backend Developer',
    techStack: [
      'Next.js',
      'TypeScript',
      'PostgreSQL',
      'Prisma',
      'Zustand',
      'NextAuth',
      'BullMQ',
      'Redis',
    ],
    highlights: [
      'Managed the PostgreSQL database layer with Prisma for a multi-tenant B2B platform spanning organization, admin, client, user, and candidate roles',
      'Built a demo-request and onboarding workflow with approve/reject lifecycle management',
      'Designed secure, role-based and organization-scoped APIs with approval gates across question banks, assessments, and candidate attempts',
      'Built a question bank and assessment system with CSV import, reusable repositories, scheduling, and integrity/audit tracking',
      'Built a PDF content repository on Supabase Storage with text chunking, linked to question banks; async processing via BullMQ + Redis',
    ],
    startDate: '2025-11',
    endDate: '2026-02',
    liveUrl: 'https://examlyst.vercel.app/',
    featured: true,
    order: 1,
  },
  {
    slug: 'eduerp',
    title: 'EduERP',
    shortDescription: 'School management system for admins, teachers, and parents.',
    role: 'Frontend Developer',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'NextAuth'],
    highlights: [
      'Developing and maintaining user-facing features, integrating with backend APIs',
      'Delivering production-ready web and mobile features for educational institutions',
      'Implemented a secure, role-based system with NextAuth for admins, teachers, and parents',
    ],
    startDate: '2025-10',
    endDate: null,
    liveUrl: 'https://eduerp.net/',
    featured: true,
    order: 2,
  },
  {
    slug: 'zidio-ecommerce',
    title: 'Zidio E-Commerce',
    shortDescription:
      'Full-stack e-commerce site themed around Starry Night and comic superheroes.',
    role: 'Backend Developer',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    highlights: [
      'Built the backend and MongoDB schema for users, products, carts, and orders',
      'Integrated APIs with the React frontend, resolving data-flow issues',
      'Shipped product browsing, cart management, authentication, and an admin dashboard',
    ],
    startDate: '2025-03',
    endDate: '2025-05',
    liveUrl: 'https://forever-frontendv3.vercel.app/',
    featured: true,
    order: 3,
  },
  {
    slug: 'quickai',
    title: 'QuickAI',
    shortDescription:
      'AI-powered SaaS platform for content generation, resume analysis, and image tools.',
    role: 'Full-Stack Developer',
    techStack: ['React.js', 'Node.js', 'PostgreSQL', 'NeonDB', 'Clerk', 'Gemini API'],
    highlights: [
      'Designed and developed a cloud-based SaaS platform integrating multiple AI services',
      'Built AI-powered features including content generation, object removal, resume analysis, and background removal',
      'Integrated Clerk for authentication and Gemini APIs for AI-driven functionality',
    ],
    startDate: '2024-12',
    endDate: '2024-12',
    liveUrl: 'https://quick-ai-frontend-zeta.vercel.app/',
    featured: true,
    order: 4,
  },
  {
    slug: 'email-spam-classifier',
    title: 'Email Spam Classifier',
    shortDescription: 'Machine-learning spam classifier using NLP and Naive Bayes.',
    role: 'ML Developer',
    techStack: ['Python', 'NLP', 'Naive Bayes', 'Streamlit'],
    highlights: [
      'Developed a machine-learning-based email spam classifier using Python',
      'Implemented NLP preprocessing and trained classification models using the Naive Bayes algorithm',
    ],
    startDate: '2024-07',
    endDate: '2024-07',
    liveUrl: 'https://esc-shan10.streamlit.app/',
    featured: true,
    order: 5,
  },
  {
    slug: 'ai-blog-forge',
    title: 'AIBlogForge',
    shortDescription:
      'Full-stack AI-powered blog platform for instant, personalized content generation.',
    role: 'Full-Stack Developer',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    highlights: [
      'Built a full-stack AI-powered blog platform enabling users to generate personalized, high-quality content instantly',
      'Implemented RESTful backend APIs using Node.js and Express.js',
      'Optimized the frontend layout and experience using React.js',
    ],
    startDate: '2025-02',
    endDate: '2025-02',
    liveUrl: 'https://ai-blog-forge.vercel.app/',
    featured: true,
    order: 6,
  },
];

export const publication: Publication = {
  title:
    'ExamLyst B2B Online Assessment Platform: Architecture, Integrity Monitoring, and Evaluation',
  venue:
    'International Journal of Progressive Research in Engineering Management and Science (IJPREMS)',
  volume: '06',
  issue: '04',
  date: '2026-04',
  summary:
    'Designed and researched an AI-resistant B2B online assessment platform focused on ' +
    'maintaining examination integrity in AI-assisted environments, proposing a secure ' +
    'architecture with monitoring and evaluation techniques.',
  bullets: [
    'Proposed a secure system architecture incorporating monitoring mechanisms and evaluation techniques to improve reliability and integrity of online assessments',
    'Explored approaches for reducing the misuse of AI tools during examinations while maintaining a reliable, scalable assessment experience',
  ],
  certificateUrl: 'https://go.fliplink.me/view/B6CF4683-FFD2-495B-B217-44D2F63FFC73',
};

export const certificates: Certificate[] = [
  {
    title: 'Machine Learning and Artificial Intelligence (AI)',
    issuer: 'Udemy',
    date: '2024-09',
    credentialUrl: 'https://www.udemy.com/certificate/UC-68cf2430-0c87-444d-972a-0565608c0452/',
  },
  {
    title: 'Data Structures & Algorithms using C and C++',
    issuer: 'Udemy',
    date: '2024-06',
    credentialUrl: 'https://www.udemy.com/certificate/UC-7e2500ee-cf3e-4ae2-aedf-a0e66c25fba4/',
  },
  {
    title: 'Full Stack Web Development',
    issuer: 'Udemy',
    date: '2025-01',
  },
];

export const education: EducationEntry[] = [
  {
    institution: 'Bhilai Institute of Technology, Raipur',
    degree: 'B.Tech in Computer Science Engineering',
    startYear: 2022,
    endYear: 2026,
    score: 'CGPA 7.37 / 10',
  },
  {
    institution: 'Saraswati Shishu Mandir Higher Secondary School, Abhanpur',
    degree: 'XII (CGBSE)',
    startYear: 2014,
    endYear: 2021,
    score: '84.2%',
  },
];
