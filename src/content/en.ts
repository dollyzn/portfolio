import type { LocaleContent } from "./types";

export const contentEn: LocaleContent = {
  experiences: [
    {
      company: "Quaestum Consultoria Empresarial",
      role: "Web Developer",
      period: "Oct 2023 - Present",
      stage: "Full Stack",
      summary:
        "Building and maintaining full stack web applications, from the interface to business rules and third-party integrations.",
      highlights: [
        "Features for an event management system: bookings, registrations and check-in.",
        "Payment gateway integration and other external services.",
        "Building and consuming REST APIs with authentication and access control.",
        "Modeling business rules and validation layers on the backend.",
        "Responsive, accessible interfaces designed for real field use.",
        "Bug fixes, refactors and optimization of critical paths.",
        "Close collaboration with designers, developers and stakeholders.",
      ],
      stack: ["Node.js", "React", "TypeScript", "JavaScript", "REST", "SQL"],
    },
    {
      company: "Fale Alto",
      role: "Web Developer",
      period: "Nov 2022 - Oct 2023",
      stage: "Web",
      summary:
        "Building responsive sites and landing pages, from gathering requirements with the client through delivery and maintenance.",
      highlights: [
        "Responsive sites and landing pages with HTML5, CSS3, JavaScript and React.",
        "Developing and maintaining WordPress themes and pages.",
        "Performance tweaks and fixes on already published projects.",
        "Requirements gathering directly with clients.",
        "Internal automations to cut repetitive work for the team.",
      ],
      stack: ["JavaScript", "React", "Bootstrap", "WordPress", "CSS3"],
    },
    {
      company: "CERO Imagem Digital",
      role: "IT Intern",
      period: "Sep 2021 - Sep 2022",
      stage: "Infrastructure",
      summary:
        "First professional contact with technology: support, infrastructure and the curiosity to automate whatever could be automated.",
      highlights: [
        "Technical support for users, hardware and software.",
        "Maintaining networks, servers and operating systems.",
        "Supporting corporate applications and IT infrastructure.",
        "Automating repetitive day-to-day tasks for the team.",
      ],
      stack: ["Networks", "Servers", "Windows / Linux", "Automation"],
    },
  ],
  primaryTech: [
    {
      name: "React",
      icon: "react",
      category: "Frontend",
      note: "UI and state",
    },
    {
      name: "TypeScript",
      icon: "typescript",
      category: "Frontend",
      note: "Types everywhere",
    },
    {
      name: "JavaScript",
      icon: "javascript",
      category: "Frontend",
      note: "The lasting foundation",
    },
    {
      name: "Node.js",
      icon: "node",
      category: "Backend",
      note: "Services and APIs",
    },
    {
      name: "SQL",
      icon: "sql",
      category: "Backend",
      note: "Modeling and queries",
    },
    {
      name: "REST APIs",
      icon: "rest",
      category: "Backend",
      note: "Contracts and integrations",
    },
    {
      name: "HTML5",
      icon: "html",
      category: "Frontend",
      note: "Semantics first",
    },
    {
      name: "CSS3",
      icon: "css",
      category: "Frontend",
      note: "Layout and responsive",
    },
    {
      name: "Git",
      icon: "git",
      category: "Ferramentas",
      note: "Clean history",
    },
  ],
  secondaryTech: [
    {
      name: "GitHub",
      icon: "github",
      category: "Ferramentas",
      note: "Collaboration and CI",
    },
    {
      name: "Tailwind CSS",
      icon: "tailwind",
      category: "Frontend",
      note: "Design system",
    },
    {
      name: "Bootstrap",
      icon: "bootstrap",
      category: "Frontend",
      note: "Fast delivery",
    },
    {
      name: "WordPress",
      icon: "wordpress",
      category: "Ferramentas",
      note: "Sites and themes",
    },
    {
      name: "Python",
      icon: "python",
      category: "Backend",
      note: "Scripts and study",
    },
    { name: "Vercel", icon: "vercel", category: "Ferramentas", note: "Deploy" },
  ],
  stackTopics: [
    "Authentication",
    "Third-party integrations",
    "Business rules",
    "Validation",
    "Responsive design",
    "Accessibility",
    "Software architecture",
    "Computer vision",
    "Embedded systems",
  ],
  featuredProject: {
    slug: "eventflow",
    name: "EventFlow",
    tagline: "A conceptual end-to-end event management platform.",
    description:
      "A full architecture exercise: registrations, bookings and real-time check-in, with an admin dashboard, role-based access control and a payment flow designed to fail in predictable ways.",
    kind: "Personal / concept project",
    features: [
      "Registrations and bookings",
      "Real-time check-in",
      "Admin dashboard",
      "Role-based auth",
      "Payment flow",
      "Documented REST API",
    ],
    stack: ["React", "TypeScript", "Node.js", "REST API", "SQL"],
    repo: "https://github.com/dollyzn",
    demo: null,
    accent: "blue",
  },
  projects: [
    {
      slug: "nexus-api",
      name: "Nexus API",
      tagline: "A conceptual backend focused on structure and predictability.",
      description:
        "An API foundation meant to grow without turning into a mess: separated layers, edge validation, structured logs and errors that say what happened.",
      kind: "Personal / concept project",
      features: [
        "Auth and sessions",
        "User management",
        "Input validation",
        "Structured logs",
        "External integrations",
      ],
      stack: ["Node.js", "TypeScript", "SQL"],
      repo: "https://github.com/dollyzn",
      demo: null,
      accent: "cyan",
    },
    {
      slug: "devboard",
      name: "DevBoard",
      tagline: "A board to track what is actually in progress.",
      description:
        "A lean interface for project progress: clear states, high information density and no decoration that gets in the way of reading.",
      kind: "Personal / concept project",
      features: ["Status board", "Progress metrics", "Native dark theme"],
      stack: ["React", "TypeScript", "Tailwind CSS"],
      repo: "https://github.com/dollyzn",
      demo: null,
      accent: "navy",
    },
    {
      slug: "checkpoint",
      name: "Checkpoint",
      tagline: "An event credential reader designed for offline use.",
      description:
        "A PWA study that validates credentials via QR Code without a network, stores records locally and syncs as soon as connectivity returns.",
      kind: "Personal / concept project",
      features: ["QR Code reading", "Offline queue", "Sync"],
      stack: ["React", "TypeScript", "IndexedDB"],
      repo: "https://github.com/dollyzn",
      demo: null,
      accent: "cyan",
    },
  ],
  principles: [
    {
      index: "01",
      title: "Understand the problem before picking a solution.",
      body: "A lot of the complexity we write exists because we skip this step. I ask more up front so I rewrite less later.",
    },
    {
      index: "02",
      title: "Good code stays readable after the feature ships.",
      body: "The commit is the beginning of the code's life, not the end. I write for whoever opens that file in six months - usually me.",
    },
    {
      index: "03",
      title:
        "Frontend and backend need to talk as well as the UI talks to the user.",
      body: "Clear contracts, errors that explain what happened and predictable states. That's what separates a system that works from one that only works on the happy path.",
    },
  ],
  education: [
    {
      institution: "Universidade Cruzeiro do Sul",
      course: "Bachelor's in Software Engineering",
      period: "2025 - 2029",
      status: "In progress",
    },
    {
      institution: "Instituto Federal Fluminense",
      course: "Technical Degree in Computing",
      period: "2021 - 2023",
      status: "Completed",
    },
  ],
  languages: [
    { name: "Portuguese", level: "Native", value: 100 },
    { name: "English", level: "Intermediate / Advanced", value: 75 },
  ],
};
