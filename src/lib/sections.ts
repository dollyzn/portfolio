/** Âncoras estáveis (PT) - labels vêm das messages. */
export const pageSections = [
  { key: "home" as const, id: "top", href: "#top", index: "00" },
  { key: "about" as const, id: "sobre", href: "#sobre", index: "01" },
  { key: "stack" as const, id: "stack", href: "#stack", index: "02" },
  {
    key: "experience" as const,
    id: "experiencia",
    href: "#experiencia",
    index: "03",
  },
  { key: "projects" as const, id: "projetos", href: "#projetos", index: "04" },
  {
    key: "principles" as const,
    id: "principios",
    href: "#principios",
    index: "05",
  },
  { key: "education" as const, id: "formacao", href: "#formacao", index: "06" },
  { key: "contact" as const, id: "contato", href: "#contato", index: "07" },
] as const;

export type PageSectionKey = (typeof pageSections)[number]["key"];
