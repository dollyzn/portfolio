# Meu portfólio

Meu site pessoal — sou desenvolvedor full stack em Brasília.
One-page com dark/light mode, globo 3D interativo, intro animada e seções de experiência, stack, projetos e contato.

**Site:** [nsantos.dev](https://nsantos.dev) · **Contato:** [contato@nsantos.dev](mailto:contato@nsantos.dev)

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | React 19 · TypeScript · Tailwind CSS v4 |
| Animação | Motion · Animate UI (switch / theme toggler) |
| Tema | `next-themes` (light / dark / system) + View Transitions |
| 3D | Three.js · React Three Fiber · three-globe |
| Ícones | Lucide · Simple Icons |
| Estilo de componentes | CVA · Radix Slot · Base UI |

## O que tem aqui

- Tema claro e escuro com transição circular (`tr-circle`) e switch animado
- Intro sincronizada com o warm-up do WebGL
- Globo 3D com órbita e arcos a partir de Brasília
- Conteúdo desacoplado dos componentes (`site.ts` / `content.ts`)
- SEO: metadata, sitemap, robots, Open Graph e JSON-LD
- Acessibilidade: `prefers-reduced-motion`, skip link, foco visível
- Deploy via Vercel ou VPS (Docker + nginx)

## Pré-requisitos

- Node.js 20+
- [pnpm](https://pnpm.io) 9+

## Como rodar

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando | Descrição |
| --- | --- |
| `pnpm dev` | servidor de desenvolvimento |
| `pnpm build` | build de produção |
| `pnpm start` | sobe o build localmente |
| `pnpm lint` | ESLint |

### Variáveis de ambiente

Copie `.env.example` e ajuste se necessário:

```bash
NEXT_PUBLIC_SITE_URL=https://nsantos.dev
```

`NEXT_PUBLIC_SITE_URL` entra no **build** (canonical, sitemap, Open Graph).

## Onde edito o conteúdo

| Arquivo | Conteúdo |
| --- | --- |
| `src/lib/site.ts` | nome, e-mail, GitHub, URL, navbar |
| `src/lib/content.ts` | experiência, stack, projetos, princípios, formação |
| `src/app/globals.css` | tokens de cor (light/dark), tipografia, utilitários |

### Projetos

Em `content.ts`, cada projeto tem `repo` e `demo`. Com `demo: null`, o card mostra “Demo em breve”.
Os mockups ficam em `src/components/ui/project-mockup.tsx`, indexados por `slug`.

## Deploy

### Vercel

Importe o repositório e defina `NEXT_PUBLIC_SITE_URL` com o domínio final.

### VPS (Docker + nginx)

O Compose sobe o Next.js em `127.0.0.1:3000`; o HTTPS fica no nginx do host.

| Arquivo | Função |
| --- | --- |
| `Dockerfile` | build multi-stage |
| `docker-compose.yml` | serviço `web` |
| `deploy/nginx.nsantos.dev.conf` | proxy nginx → `:3000` |
| `scripts/deploy.sh` / `scripts/update.sh` | provisionamento e update |

```bash
docker compose up -d --build
sudo cp deploy/nginx.nsantos.dev.conf /etc/nginx/sites-available/nsantos.dev
sudo ln -sf /etc/nginx/sites-available/nsantos.dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d nsantos.dev -d www.nsantos.dev
```

Atualizar depois:

```bash
git pull
docker compose up -d --build
```

## Estrutura

```
src/
  app/                 # rotas, layout, metadata, OG
  components/
    layout/            # navbar, footer, theme switch, cursor
    sections/          # hero, about, stack, projetos…
    animate-ui/        # primitivos animados (switch, toggler)
    ui/                # botões, mockups, globe…
  lib/                 # site, content, utils
  hooks/
public/                # logos e assets estáticos
```

## Licença

MIT — veja [LICENSE](./LICENSE).
