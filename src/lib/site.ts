export const site = {
  name: "Natã Santos",
  email: "contato@nsantos.dev",
  github: "https://github.com/dollyzn",
  linkedin: "https://linkedin.com/in/natasantos",
  // defina NEXT_PUBLIC_SITE_URL na Vercel para o domínio final
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nsantos.dev",
} as const;

/** Âncoras estáveis (PT) - labels vêm das messages. */
export const navLinks = [
  { key: "about" as const, href: "#sobre", index: "01" },
  { key: "stack" as const, href: "#stack", index: "02" },
  { key: "experience" as const, href: "#experiencia", index: "03" },
  { key: "projects" as const, href: "#projetos", index: "04" },
  { key: "contact" as const, href: "#contato", index: "07" },
] as const;

export type NavLinkKey = (typeof navLinks)[number]["key"];
