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
    'applications — using the MERN stack and Next.js. Proficient in React.js, Node.js, ' +
    'PostgreSQL, and MongoDB, with strong expertise in RESTful APIs and authentication systems. ' +
    'Experienced in developing production-ready ERP systems, SaaS platforms, and e-commerce ' +
    'applications, with a strong foundation in Data Structures.',
  location: 'Raipur, IN',
  email: 'mohdshan1024@gmail.com',
  socials: {
    linkedin: 'https://www.linkedin.com/in/mohdshan09',
  },
  resumeUrl: '/resume.pdf',
  availableForWork: true,
};

export const skills: SkillGroup[] = [
  {
    category: 'language',
    items: ['C', 'C++', 'HTML', 'CSS', 'JavaScript', 'TypeScript'],
  },
  {
    category: 'framework',
    items: ['React.js', 'Node.js', 'Express.js', 'Next.js'],
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
    role: 'Jr. Software Developer Intern',
    type: 'internship',
    startDate: '2025-10',
    endDate: null,
    bullets: [
      'Develop a full-stack School ERP system using Next.js, PostgreSQL, Prisma, and Tailwind CSS',
      'Build Student Management, Transport Management, session migration (student promotion), and a reporting module with 10+ reports',
      'Migrate legacy data by cleaning raw Excel files into SQL for PostgreSQL, and implement role-based access with NextAuth for admins, teachers, and parents',
    ],
    techStack: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'NextAuth'],
    liveUrl: 'https://eduerp.net/',
  },
  {
    company: 'Zidio Development',
    role: 'Full-Stack Developer Intern',
    type: 'internship',
    startDate: '2025-03',
    endDate: '2025-05',
    bullets: [
      "Built the product database from scratch for the company's e-commerce website using MongoDB",
      "Designed RESTful APIs with Node.js and Express.js for the website's backend and integrated them with the React frontend",
      'Implemented product listings, cart system, and user authentication',
    ],
    techStack: ['MongoDB', 'Node.js', 'Express.js', 'React.js'],
    liveUrl: 'https://forever-frontendv3.vercel.app',
  },
];

export const projects: Project[] = [
  {
    slug: 'eduerp',
    title: 'EduERP',
    shortDescription:
      'School ERP serving 6+ schools in Gariaband district — reports, session rollover, and legacy data import.',
    role: 'Full-Stack Developer',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
    highlights: [
      'Develop and maintain a full-stack School ERP serving 6+ schools in Gariaband district, working with the backend team to integrate APIs and deliver complete features',
      'Migrate legacy school data by cleaning and transforming raw, inconsistent Excel files into SQL queries for bulk import into PostgreSQL, keeping the data accurate for each onboarded school',
      'Build and maintain a reporting module with 10+ school reports, letting administrators generate academic and administrative records from a single interface',
      'Design ERP-style dashboard interfaces with Next.js, TypeScript, and Tailwind CSS, optimized for data-heavy workflows and responsive across devices',
      'Develop a session migration feature that promotes students to the next academic session, automating the year-end rollover for each school',
    ],
    startDate: '2025-10',
    endDate: null,
    liveUrl: 'https://eduerp.net/',
    featured: true,
    order: 1,
  },
  {
    slug: 'examlyst',
    title: 'ExamLyst',
    shortDescription:
      'Multi-tenant B2B online assessment platform with integrity monitoring — B.Tech major project.',
    role: 'Full-Stack Developer',
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
      'Built a multi-tenant B2B assessment platform in a team as Full Stack Developer, owning the PostgreSQL database layer with Prisma across organization, admin, client, and candidate workflows',
      'Implemented an organization onboarding workflow in which companies request demos and admins approve or reject access, backed by role-based, organization-scoped APIs',
      'Designed and implemented secure role-based and organization-scoped APIs, enforcing authentication, approval gates, and access boundaries across question banks, assessments, candidate attempts, and content management',
      'Built a question bank and assessment management system with CSV-based question import, reusable question repositories, assessment scheduling, candidate attempts, responses, and integrity/audit tracking',
      'Developed a PDF content repository using Supabase Storage, with document extraction, text chunking, and reusable linking of source documents to question banks; asynchronous processing handled with BullMQ + Redis',
    ],
    startDate: '2025-11',
    endDate: '2026-02',
    liveUrl: 'https://examlyst.vercel.app/',
    featured: true,
    order: 2,
  },
  {
    slug: 'zidio-ecommerce',
    title: 'Zidio E-Commerce',
    shortDescription:
      'Full-stack e-commerce site themed around Starry Night and comic superheroes.',
    role: 'Backend Developer',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Tailwind CSS'],
    highlights: [
      'Contributed backend development and the MongoDB database for core e-commerce workflows, including users, products, carts, and orders',
      'Collaborated with the frontend developers to integrate APIs with the React application, resolve data-flow issues, and align backend responses with frontend requirements',
      'Themed around Starry Night aesthetics and comic superheroes, with product browsing, cart management, user authentication, and an admin dashboard',
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
    techStack: ['React.js', 'Node.js', 'PostgreSQL', 'NeonDB', 'Clerk', 'REST APIs'],
    highlights: [
      'Designed and developed a cloud-based SaaS platform integrating Artificial Intelligence (AI)',
      'Built an AI-powered SaaS platform integrating multiple AI services including content generation, object removal, resume analysis, and background removal',
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
