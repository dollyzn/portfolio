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

## Deploy em VPS (Hetzner / Ubuntu + nginx)

O Compose sobe **só o Next.js em `127.0.0.1:3000`**. O HTTPS fica com o
**nginx do host** (o mesmo que já serve o Chatwoot).

### Arquivos

| Arquivo | Função |
| --- | --- |
| `Dockerfile` | build multi-stage → imagem mínima |
| `docker-compose.yml` | serviço `web` em `127.0.0.1:3000` |
| `deploy/nginx.nsantos.dev.conf` | site nginx → `:3000` |
| `.env.example` | domínio / porta / URL pública |
| `scripts/deploy.sh` | provisiona Docker e sobe o stack |
| `scripts/update.sh` | `git pull` + rebuild |

### 1. DNS

- `A` de `nsantos.dev` → IP do VPS
- `A` de `www.nsantos.dev` → mesmo IP

### 2. Subir a app

```bash
cd /home/chatwoot/nsantos
docker compose down
docker rm -f portfolio-caddy-1 2>/dev/null
docker compose up -d --build
curl -I http://127.0.0.1:3000
```

### 3. Nginx (HTTP primeiro — sem SSL no arquivo)

```bash
sudo cp deploy/nginx.nsantos.dev.conf /etc/nginx/sites-available/nsantos.dev
sudo ln -sf /etc/nginx/sites-available/nsantos.dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4. HTTPS com certbot

```bash
sudo certbot --nginx -d nsantos.dev -d www.nsantos.dev
```

### 5. Atualizar depois

```bash
cd /home/chatwoot/nsantos
git pull
docker compose up -d --build
```

### Variáveis

```bash
SITE_DOMAIN=nsantos.dev
NEXT_PUBLIC_SITE_URL=https://nsantos.dev
APP_PORT=3000
```

`NEXT_PUBLIC_SITE_URL` entra no **build**. Se mudar o domínio, faça rebuild.

### Logs

```bash
docker compose logs -f web
docker compose ps
```

## Design system

Os tokens de cor, tipografia e utilitários (malha técnica, grão, gradientes de texto)
estão em `src/app/globals.css`, dentro do bloco `@theme`. A paleta foi amostrada da
imagem de referência: `#02040A`, `#050C3A`, `#061E6D`, `#4CB1FC`, `#72DEFE`.

Toda animação passa por `useReducedMotion` e há um fallback em CSS, então
`prefers-reduced-motion: reduce` desliga o movimento sem esconder conteúdo.
