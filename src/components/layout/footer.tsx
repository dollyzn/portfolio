import { ArrowUp, Mail } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06] px-6 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[15px] font-medium text-paper">{site.name}</p>
          <p className="mt-1 text-[13.5px] text-slate-blue">
            Software Developer
          </p>
          <p className="mt-5 max-w-xs font-mono text-[11px] leading-relaxed text-dim">
            Feito com Next.js, TypeScript e uma quantidade de café que não cabe
            neste rodapé.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:items-end">
          <div className="flex items-center gap-1">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub (abre em nova aba)"
              className="grid size-10 place-items-center rounded-full text-slate-blue transition-colors duration-300 hover:bg-white/[0.04] hover:text-paper"
            >
              <GithubIcon className="size-[17px]" />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label={`Enviar e-mail para ${site.email}`}
              className="grid size-10 place-items-center rounded-full text-slate-blue transition-colors duration-300 hover:bg-white/[0.04] hover:text-paper"
            >
              <Mail className="size-[18px]" strokeWidth={1.6} />
            </a>
            <a
              href="#top"
              aria-label="Voltar ao topo"
              className="group ml-1 grid size-10 place-items-center rounded-full border border-white/[0.08] text-slate-blue transition-colors duration-300 hover:border-electric/35 hover:text-electric"
            >
              <ArrowUp
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                strokeWidth={1.7}
              />
            </a>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
            © {year} - Brasília, DF
          </p>
        </div>
      </div>
    </footer>
  );
}
