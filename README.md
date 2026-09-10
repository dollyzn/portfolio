# Meu portfólio

Meu site pessoal - sou desenvolvedor full stack em Brasília.
One-page com dark/light mode, globo 3D interativo, intro animada e seções de experiência, stack, projetos e contato.

**Site:** [nsantos.dev](https://nsantos.dev) · **Contato:** [contato@nsantos.dev](mailto:contato@nsantos.dev)

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Motion · Three.js · `next-themes`

## Como rodar

Pré-requisitos: Node.js 20+ e [pnpm](https://pnpm.io) 9+.

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

| Comando      | Descrição          |
| ------------ | ------------------ |
| `pnpm dev`   | desenvolvimento    |
| `pnpm build` | build de produção  |
| `pnpm start` | sobe o build local |
| `pnpm lint`  | ESLint             |

### Variáveis de ambiente

```bash
cp .env.example .env
```

`NEXT_PUBLIC_SITE_URL` entra no build (canonical, sitemap, Open Graph).

## Conteúdo

| Arquivo              | O quê                                              |
| -------------------- | -------------------------------------------------- |
| `src/lib/site.ts`    | nome, e-mail, GitHub, URL, navbar                  |
| `src/lib/content.ts` | experiência, stack, projetos, princípios, formação |

## Licença

MIT - veja [LICENSE](./LICENSE).
