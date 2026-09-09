# Portfólio - Natã Santos

Portfólio pessoal de um desenvolvedor full stack. Estética dark azul-marinho / azul
elétrico, tipografia editorial e microinterações discretas.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Lucide ·
primitivos no estilo shadcn/ui (cva + Radix Slot).

## Rodando localmente

```bash
npm install
npm run dev
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

O projeto sobe com **Docker Compose**: Next.js (standalone) atrás do **Caddy**,
com HTTPS automático via Let's Encrypt.

### Arquivos

| Arquivo | Função |
| --- | --- |
| `Dockerfile` | build multi-stage → imagem mínima |
| `docker-compose.yml` | serviços `web` + `caddy` |
| `deploy/Caddyfile` | proxy reverso + TLS |
| `deploy/docker-compose.http.yml` | override sem HTTPS (teste na :3000) |
| `.env.example` | domínio e e-mail do certificado |
| `scripts/deploy.sh` | provisiona Docker, firewall e sobe o stack |
| `scripts/update.sh` | `git pull` + rebuild |

### 1. DNS e firewall da Hetzner

No painel da Hetzner Cloud, aponte:

- `A` de `nsantos.dev` → IP do VPS
- `A` de `www.nsantos.dev` → mesmo IP
- (opcional) `AAAA` se o servidor tiver IPv6

No **Cloud Firewall** (ou Security Group), libere `22`, `80` e `443` (TCP; UDP 443 também ajuda no HTTP/3).

### 2. Primeiro deploy

No VPS Ubuntu 22.04/24.04:

```bash
# clone o repositório
git clone https://github.com/dollyzn/SEU_REPO.git /opt/portfolio
cd /opt/portfolio

# ajuste domínio / e-mail
cp .env.example .env
nano .env

# sobe tudo (instala Docker se precisar)
sudo ./scripts/deploy.sh
```

Ou, sem clonar antes:

```bash
sudo SITE_DOMAIN=nsantos.dev \
  ACME_EMAIL=contato@nsantos.dev \
  REPO_URL=https://github.com/dollyzn/SEU_REPO.git \
  ./scripts/deploy.sh
```

O script:

1. instala Docker Engine + Compose
2. libera UFW (`22`, `80`, `443`)
3. sincroniza o código em `/opt/portfolio`
4. cria `.env` se ainda não existir
5. faz `docker compose up -d --build`

Em alguns segundos o Caddy emite o certificado e o site fica em `https://nsantos.dev`.

### 3. Atualizar depois de um push

```bash
sudo ./scripts/update.sh
# ou:
cd /opt/portfolio && git pull && sudo docker compose up -d --build
```

### 4. Teste sem domínio / sem HTTPS

```bash
HTTP_ONLY=1 sudo ./scripts/deploy.sh
# → http://IP_DO_VPS:3000
```

### Variáveis de ambiente

```bash
SITE_DOMAIN=nsantos.dev
ACME_EMAIL=contato@nsantos.dev
NEXT_PUBLIC_SITE_URL=https://nsantos.dev
```

`NEXT_PUBLIC_SITE_URL` entra no **build** da imagem (sitemap, OpenGraph, JSON-LD).
Se mudar o domínio, rode um rebuild (`docker compose up -d --build`).

### Logs úteis

```bash
cd /opt/portfolio
docker compose logs -f web      # Next.js
docker compose logs -f caddy    # TLS / proxy
docker compose ps
```


## Design system

Os tokens de cor, tipografia e utilitários (malha técnica, grão, gradientes de texto)
estão em `src/app/globals.css`, dentro do bloco `@theme`. A paleta foi amostrada da
imagem de referência: `#02040A`, `#050C3A`, `#061E6D`, `#4CB1FC`, `#72DEFE`.

Toda animação passa por `useReducedMotion` e há um fallback em CSS, então
`prefers-reduced-motion: reduce` desliga o movimento sem esconder conteúdo.
