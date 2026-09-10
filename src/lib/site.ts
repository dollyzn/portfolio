export const site = {
  name: "Natã Santos",
  role: "Desenvolvedor Full Stack",
  location: "Brasília, DF - Brasil",
  email: "contato@nsantos.dev",
  github: "https://github.com/dollyzn",
  linkedin: "https://linkedin.com/in/natasantos",
  // defina NEXT_PUBLIC_SITE_URL na Vercel para o domínio final
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nsantos.dev",
  description:
    "Desenvolvedor Full Stack com 3+ anos construindo aplicações web com React, Node.js e TypeScript - da interface às regras de negócio e integrações.",
} as const;

export const navLinks = [
  { label: "Sobre", href: "#sobre", index: "01" },
  { label: "Stack", href: "#stack", index: "02" },
  { label: "Experiência", href: "#experiencia", index: "03" },
  { label: "Projetos", href: "#projetos", index: "04" },
  { label: "Contato", href: "#contato", index: "07" },
] as const;
