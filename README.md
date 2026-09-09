# Portfólio - Natã Santos

Portfólio pessoal de um desenvolvedor full stack. Estética dark azul-marinho / azul
elétrico, tipografia editorial e microinterações discretas.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Lucide ·
primitivos no estilo shadcn/ui (cva + Radix Slot).

## Rodando localmente

```bash
pnpm install
pnpm dev
```

## Onde editar o conteúdo

Todo o texto e os dados ficam fora dos componentes:

| Arquivo              | O que contém                                                 |
| -------------------- | ------------------------------------------------------------ |
| `src/lib/site.ts`    | nome, e-mail, GitHub, localização, links da navbar           |
| `src/lib/content.ts` | experiências, stack, projetos, princípios, formação, idiomas |

### Publicar um projeto real

Em `src/lib/content.ts`, cada projeto tem `repo` e `demo`. Basta trocar pelas URLs
finais - `demo: null` faz o card exibir "Demo em breve" automaticamente. Os projetos
atuais estão marcados como `Projeto pessoal / conceito`; ajuste o campo `kind` quando
substituir por trabalhos reais.

Os mockups são desenhados em HTML/SVG em `src/components/ui/project-mockup.tsx`,
indexados por `slug`. Para um projeto novo, adicione um bloco lá ou aponte o `slug`
para um mockup existente.

## Deploy na Vercel

Importe o repositório na Vercel — não há configuração extra. Defina a variável
`NEXT_PUBLIC_SITE_URL` com o domínio final para que canonical, sitemap e OpenGraph
apontem para o endereço correto.

A imagem OpenGraph e o favicon são gerados em build por `src/app/opengraph-image.tsx`
e `src/app/icon.tsx`.

## Deploy em VPS (Hetzner / Ubuntu)

Por padrão o Compose sobe **só o Next.js em `127.0.0.1:3000`**. O HTTPS fica
com o nginx/Caddy que já estiver no host — o caso típico quando Chatwoot (ou
outro app) já ocupa as portas 80/443.

### Arquivos

| Arquivo                         | Função                                                |
| ------------------------------- | ----------------------------------------------------- |
| `Dockerfile`                    | build multi-stage → imagem mínima                     |
| `docker-compose.yml`            | serviço `web` (+ `caddy` opcional via profile `edge`) |
| `deploy/nginx.nsantos.dev.conf` | site nginx apontando para `:3000`                     |
| `deploy/caddy.nsantos.dev.conf` | bloco Caddy do host apontando para `:3000`            |
| `deploy/Caddyfile`              | Caddy **dentro** do Compose (só com `--profile edge`) |
| `.env.example`                  | domínio / porta / URL pública                         |
| `scripts/deploy.sh`             | provisiona Docker e sobe o stack                      |
| `scripts/update.sh`             | `git pull` + rebuild                                  |

### 1. DNS

- `A` de `nsantos.dev` → IP do VPS
- `A` de `www.nsantos.dev` → mesmo IP

### 2. Subir a app (sem brigar pela :80)

```bash
cd /home/chatwoot/nsantos   # ou /opt/portfolio
git pull
docker compose down
docker compose up -d --build
curl -I http://127.0.0.1:3000
```

### 3. Ligar o domínio no proxy que já existe

**Nginx** (mais comum com Chatwoot):

```bash
sudo cp deploy/nginx.nsantos.dev.conf /etc/nginx/sites-available/nsantos.dev
sudo ln -sf /etc/nginx/sites-available/nsantos.dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d nsantos.dev -d www.nsantos.dev
```

**Caddy no host**: importe `deploy/caddy.nsantos.dev.conf` no Caddyfile principal
e recarregue o Caddy.

### 4. VPS “limpo” (sem nada nas portas 80/443)

```bash
WITH_EDGE=1 sudo ./scripts/deploy.sh
# ou:
docker compose --profile edge up -d --build
```

Aí o Caddy do Compose assume HTTPS sozinho.

### 5. Atualizar depois de um push

```bash
sudo ./scripts/update.sh
# ou:
git pull && docker compose up -d --build
```

### Variáveis de ambiente

```bash
SITE_DOMAIN=nsantos.dev
ACME_EMAIL=contato@nsantos.dev
NEXT_PUBLIC_SITE_URL=https://nsantos.dev
APP_PORT=3000
```

`NEXT_PUBLIC_SITE_URL` entra no **build** da imagem. Se mudar o domínio, faça
rebuild (`docker compose up -d --build`).

### Logs

```bash
docker compose logs -f web
docker compose ps
```

### Erro `address already in use` na :80

Significa que nginx/Caddy/outro container já usa a 80. **Não** use
`--profile edge`. Suba só o `web` e faça o proxy no host (passos 2–3).

## Design system

Os tokens de cor, tipografia e utilitários (malha técnica, grão, gradientes de texto)
estão em `src/app/globals.css`, dentro do bloco `@theme`. A paleta foi amostrada da
imagem de referência: `#02040A`, `#050C3A`, `#061E6D`, `#4CB1FC`, `#72DEFE`.

Toda animação passa por `useReducedMotion` e há um fallback em CSS, então
`prefers-reduced-motion: reduce` desliga o movimento sem esconder conteúdo.
