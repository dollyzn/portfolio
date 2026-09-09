export type Experience = {
  company: string;
  role: string;
  period: string;
  stage: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    company: "Quaestum Consultoria Empresarial",
    role: "Web Developer",
    period: "Out 2023 - Atual",
    stage: "Full Stack",
    summary:
      "Desenvolvimento e manutenção de aplicações web full stack, atuando da interface até as regras de negócio e integrações com serviços externos.",
    highlights: [
      "Funcionalidades para um sistema de gestão de eventos: reservas, inscrições e check-in.",
      "Integração com gateway de pagamentos e outros serviços externos.",
      "Desenvolvimento e consumo de APIs REST, com autenticação e controle de acesso.",
      "Modelagem de regras de negócio e camadas de validação no backend.",
      "Interfaces responsivas e acessíveis, pensadas para uso real em campo.",
      "Correção de bugs, refatoração e otimização de trechos críticos.",
      "Colaboração próxima com designers, desenvolvedores e stakeholders.",
    ],
    stack: ["Node.js", "React", "TypeScript", "JavaScript", "REST", "SQL"],
  },
  {
    company: "Fale Alto",
    role: "Web Developer",
    period: "Nov 2022 - Out 2023",
    stage: "Web",
    summary:
      "Construção de sites responsivos e landing pages, do levantamento de requisitos com o cliente até a entrega e manutenção.",
    highlights: [
      "Sites responsivos e landing pages com HTML5, CSS3, JavaScript e React.",
      "Desenvolvimento e manutenção de temas e páginas em WordPress.",
      "Ajustes de performance e correções em projetos já publicados.",
      "Levantamento de requisitos direto com clientes.",
      "Automações internas para reduzir trabalho repetitivo do time.",
    ],
    stack: ["JavaScript", "React", "Bootstrap", "WordPress", "CSS3"],
  },
  {
    company: "CERO Imagem Digital",
    role: "Estagiário de TI",
    period: "Set 2021 - Set 2022",
    stage: "Infraestrutura",
    summary:
      "Primeiro contato profissional com tecnologia: suporte, infraestrutura e a curiosidade de automatizar o que dava para automatizar.",
    highlights: [
      "Suporte técnico a usuários, hardware e software.",
      "Manutenção de redes, servidores e sistemas operacionais.",
      "Apoio em aplicações corporativas e infraestrutura de TI.",
      "Automação de tarefas repetitivas do dia a dia da equipe.",
    ],
    stack: ["Redes", "Servidores", "Windows / Linux", "Automação"],
  },
];

export type TechCategory = "Frontend" | "Backend" | "Ferramentas";

export type Tech = {
  name: string;
  icon: string;
  category: TechCategory;
  note: string;
};

/** As nove que eu uso no dia a dia - ocupam a grade principal. */
export const primaryTech: Tech[] = [
  {
    name: "React",
    icon: "react",
    category: "Frontend",
    note: "Interfaces e estado",
  },
  {
    name: "TypeScript",
    icon: "typescript",
    category: "Frontend",
    note: "Tipagem em tudo",
  },
  {
    name: "JavaScript",
    icon: "javascript",
    category: "Frontend",
    note: "A base de sempre",
  },
  {
    name: "Node.js",
    icon: "node",
    category: "Backend",
    note: "Serviços e APIs",
  },
  {
    name: "SQL",
    icon: "sql",
    category: "Backend",
    note: "Modelagem e queries",
  },
  {
    name: "REST APIs",
    icon: "rest",
    category: "Backend",
    note: "Contratos e integrações",
  },
  {
    name: "HTML5",
    icon: "html",
    category: "Frontend",
    note: "Semântica primeiro",
  },
  {
    name: "CSS3",
    icon: "css",
    category: "Frontend",
    note: "Layout e responsivo",
  },
  {
    name: "Git",
    icon: "git",
    category: "Ferramentas",
    note: "Histórico limpo",
  },
];

/** Uso com frequência menor, mas sei me virar. */
export const secondaryTech: Tech[] = [
  {
    name: "GitHub",
    icon: "github",
    category: "Ferramentas",
    note: "Colaboração e CI",
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
    note: "Entregas rápidas",
  },
  {
    name: "WordPress",
    icon: "wordpress",
    category: "Ferramentas",
    note: "Sites e temas",
  },
  {
    name: "Python",
    icon: "python",
    category: "Backend",
    note: "Scripts e estudos",
  },
  { name: "Vercel", icon: "vercel", category: "Ferramentas", note: "Deploy" },
];

/** Assuntos, não ferramentas - entram como texto no rodapé da seção. */
export const stackTopics = [
  "Autenticação",
  "Integrações com serviços externos",
  "Regras de negócio",
  "Validações",
  "Design responsivo",
  "Acessibilidade",
  "Arquitetura de software",
  "Visão computacional",
  "Sistemas embarcados",
];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  kind: string;
  features: string[];
  stack: string[];
  repo: string;
  demo: string | null;
  accent: "blue" | "cyan" | "navy";
};

/**
 * Projetos conceituais - rotulados como tal em toda a interface.
 * Para publicar um projeto real, troque `repo` / `demo` pelas URLs finais.
 */
export const featuredProject: Project = {
  slug: "eventflow",
  name: "EventFlow",
  tagline: "Plataforma conceitual de gestão de eventos, de ponta a ponta.",
  description:
    "Um exercício de arquitetura completa: inscrições, reservas e check-in em tempo real, com painel administrativo, controle de acesso por papéis e um fluxo de pagamento desenhado para falhar de forma previsível.",
  kind: "Projeto pessoal / conceito",
  features: [
    "Inscrições e reservas",
    "Check-in em tempo real",
    "Dashboard administrativo",
    "Autenticação por papéis",
    "Fluxo de pagamento",
    "API REST documentada",
  ],
  stack: ["React", "TypeScript", "Node.js", "REST API", "SQL"],
  repo: "https://github.com/dollyzn",
  demo: null,
  accent: "blue",
};

export const projects: Project[] = [
  {
    slug: "nexus-api",
    name: "Nexus API",
    tagline: "Backend conceitual com foco em organização e previsibilidade.",
    description:
      "Uma base de API pensada para crescer sem virar bagunça: camadas separadas, validação na borda, logs estruturados e erros que dizem o que aconteceu.",
    kind: "Projeto pessoal / conceito",
    features: [
      "Auth e sessões",
      "Controle de usuários",
      "Validação de entrada",
      "Logs estruturados",
      "Integrações externas",
    ],
    stack: ["Node.js", "TypeScript", "SQL"],
    repo: "https://github.com/dollyzn",
    demo: null,
    accent: "cyan",
  },
  {
    slug: "devboard",
    name: "DevBoard",
    tagline: "Painel para acompanhar o que está de fato em andamento.",
    description:
      "Interface enxuta para visualizar progresso de projetos: estados claros, densidade de informação alta e nenhuma decoração que atrapalhe a leitura.",
    kind: "Projeto pessoal / conceito",
    features: ["Board por status", "Métricas de progresso", "Tema dark nativo"],
    stack: ["React", "TypeScript", "Tailwind CSS"],
    repo: "https://github.com/dollyzn",
    demo: null,
    accent: "navy",
  },
  {
    slug: "checkpoint",
    name: "Checkpoint",
    tagline: "Leitor de credenciais para eventos, pensado para o offline.",
    description:
      "Estudo de PWA que valida credenciais por QR Code mesmo sem rede, guarda os registros localmente e sincroniza assim que a conexão volta.",
    kind: "Projeto pessoal / conceito",
    features: ["Leitura de QR Code", "Fila offline", "Sincronização"],
    stack: ["React", "TypeScript", "IndexedDB"],
    repo: "https://github.com/dollyzn",
    demo: null,
    accent: "cyan",
  },
];

export const principles = [
  {
    index: "01",
    title: "Entender o problema antes de escolher a solução.",
    body: "Boa parte da complexidade que a gente escreve existe porque pulamos essa etapa. Pergunto mais no começo para reescrever menos depois.",
  },
  {
    index: "02",
    title: "Código bom continua legível depois que a feature foi entregue.",
    body: "O commit é o começo da vida do código, não o fim. Escrevo pensando em quem vai abrir esse arquivo daqui a seis meses - geralmente eu mesmo.",
  },
  {
    index: "03",
    title:
      "Frontend e backend precisam conversar tão bem quanto a interface conversa com o usuário.",
    body: "Contratos claros, erros que explicam o que aconteceu e estados previsíveis. É o que separa um sistema que funciona de um que só funciona no happy path.",
  },
];

export const education = [
  {
    institution: "Universidade Cruzeiro do Sul",
    course: "Bacharelado em Engenharia de Software",
    period: "2025 - 2029",
    status: "Em andamento",
  },
  {
    institution: "Instituto Federal Fluminense",
    course: "Técnico em Informática",
    period: "2021 - 2023",
    status: "Concluído",
  },
];

export const languages = [
  { name: "Português", level: "Nativo", value: 100 },
  { name: "Inglês", level: "Intermediário / Avançado", value: 75 },
];
