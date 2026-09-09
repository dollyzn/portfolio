import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

const facts = [
  { key: "Experiência", value: "3+ anos" },
  { key: "Base", value: "Brasília, DF" },
  { key: "Atuação", value: "Full Stack" },
  { key: "Formação", value: "Eng. de Software" },
  { key: "Idiomas", value: "PT · EN" },
];

const curious = [
  "Arquitetura de software",
  "Backend e modelagem de dados",
  "Visão computacional",
  "Sistemas embarcados",
];

export function About() {
  return (
    <Section id="sobre" label="Sobre mim">
      <SectionHeader
        index="01"
        eyebrow="Sobre"
        title={
          <>
            Desenvolvedor full stack, <br className="hidden sm:block" />
            <span className="text-slate-blue">
              curioso pelos dois lados da aplicação.
            </span>
          </>
        }
      />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
        <div>
          <Reveal>
            <p className="max-w-2xl text-xl font-normal leading-[1.55] tracking-[-0.015em] text-paper sm:text-[1.6rem]">
              Eu gosto de entender como as coisas funcionam dos dois lados da
              aplicação. Posso estar ajustando uma interface em React e, pouco
              depois, modelando uma regra de negócio ou uma integração no
              backend.
            </p>
          </Reveal>

          <div className="mt-10 max-w-xl space-y-5 text-[15.5px] leading-[1.8] text-slate-blue">
            <Reveal delay={0.06}>
              <p>
                São mais de três anos construindo para a web. Nesse tempo
                trabalhei com{" "}
                <Highlight>React, Node.js, TypeScript e SQL</Highlight> em
                aplicações que precisavam funcionar de verdade: autenticação,
                integrações com serviços externos, APIs REST e interfaces
                responsivas que aguentam uso real.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Já toquei sistemas de gestão de eventos, gateways de pagamento,
                fluxos de reserva, inscrição e check-in. Aprendi que a parte
                difícil quase nunca é escrever o código - é entender o problema
                bem o suficiente para não escrever código demais.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p>
                Comecei em suporte e infraestrutura, e acho que isso deixou
                marca: gosto de saber o que acontece embaixo da abstração. Hoje
                estou cursando Engenharia de Software e puxando esse fio em
                direção a arquitetura, backend e sistemas mais próximos do
                hardware.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.18}>
            <div className="mt-12 border-l border-electric/25 pl-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-electric">
                Estudando agora
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist">
                {curious.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-1 rounded-full bg-cyan-bright/70"
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* ficha técnica - hairlines, sem card */}
        <Stagger className="lg:pt-2" gap={0.06}>
          <StaggerItem>
            <p className="mb-5 font-mono text-[10.5px] uppercase tracking-[0.24em] text-dim">
              Resumo
            </p>
          </StaggerItem>
          <dl>
            {facts.map((f) => (
              <StaggerItem key={f.key}>
                <div className="group flex items-baseline justify-between gap-4 border-t border-white/[0.06] py-3.5 transition-colors duration-300 hover:border-electric/25">
                  <dt className="text-[13px] text-dim">{f.key}</dt>
                  <dd className="text-[13.5px] text-mist transition-colors duration-300 group-hover:text-paper">
                    {f.value}
                  </dd>
                </div>
              </StaggerItem>
            ))}
          </dl>
        </Stagger>
      </div>
    </Section>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-mist decoration-electric/40 underline-offset-4 [text-decoration-line:underline] [text-decoration-thickness:1px]">
      {children}
    </span>
  );
}
