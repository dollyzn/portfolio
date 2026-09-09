#!/usr/bin/env bash
#
# Deploy do portfólio em Ubuntu (Hetzner / qualquer VPS).
#
# Por padrão sobe só o Next em 127.0.0.1:3000 — ideal quando nginx/Caddy
# do host (Chatwoot etc.) já ocupa 80/443.
#
# Uso:
#   sudo ./scripts/deploy.sh
#   WITH_EDGE=1 sudo ./scripts/deploy.sh   # inclui Caddy nas portas 80/443
#
# Variáveis opcionais:
#   SITE_DOMAIN=nsantos.dev
#   ACME_EMAIL=contato@nsantos.dev
#   NEXT_PUBLIC_SITE_URL=https://nsantos.dev
#   APP_PORT=3000
#   REPO_URL=git@github.com:dollyzn/portfolio.git
#   APP_DIR=/opt/portfolio
#   BRANCH=main
#   WITH_EDGE=1
#
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { printf "${CYAN}→${NC} %s\n" "$*"; }
ok()   { printf "${GREEN}✓${NC} %s\n" "$*"; }
warn() { printf "${YELLOW}!${NC} %s\n" "$*"; }
die()  { printf "${RED}✗${NC} %s\n" "$*" >&2; exit 1; }
 

SITE_DOMAIN="${SITE_DOMAIN:-nsantos.dev}"
ACME_EMAIL="${ACME_EMAIL:-contato@nsantos.dev}"
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://${SITE_DOMAIN}}"
APP_PORT="${APP_PORT:-3000}"
REPO_URL="${REPO_URL:-}"
APP_DIR="${APP_DIR:-/opt/portfolio}"
BRANCH="${BRANCH:-main}"
WITH_EDGE="${WITH_EDGE:-0}"
# alias antigo
if [[ "${HTTP_ONLY:-0}" == "1" ]]; then
  WITH_EDGE=0
fi

install_docker() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    ok "Docker e Compose já instalados"
    return
  fi

  log "instalando Docker Engine + Compose plugin…"
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl gnupg git ufw rsync

  install -m 0755 -d /etc/apt/keyrings
  if [[ ! -f /etc/apt/keyrings/docker.asc ]]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
  fi

  local arch codename
  arch="$(dpkg --print-architecture)"
  codename="$(. /etc/os-release && echo "${VERSION_CODENAME}")"

  cat >/etc/apt/sources.list.d/docker.list <<EOF
deb [arch=${arch} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${codename} stable
EOF

  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
  ok "Docker instalado"
}

configure_firewall() {
  if ! command -v ufw >/dev/null 2>&1; then
    apt-get install -y -qq ufw
  fi

  log "configurando UFW (OpenSSH + HTTP/HTTPS)…"
  ufw allow OpenSSH >/dev/null
  ufw allow 80/tcp >/dev/null
  ufw allow 443/tcp >/dev/null
  ufw allow 443/udp >/dev/null
  ufw --force enable >/dev/null
  ok "firewall ativo"
}

sync_repo() {
  if [[ -f "${APP_DIR}/docker-compose.yml" ]]; then
    log "atualizando código em ${APP_DIR}…"
    if [[ -d "${APP_DIR}/.git" ]]; then
      git -C "${APP_DIR}" fetch --all --prune
      git -C "${APP_DIR}" checkout "${BRANCH}"
      git -C "${APP_DIR}" pull --ff-only origin "${BRANCH}"
    else
      warn "pasta existe sem git — usando arquivos locais"
    fi
    return
  fi

  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local repo_root
  repo_root="$(cd "${script_dir}/.." && pwd)"

  if [[ -f "${repo_root}/docker-compose.yml" ]]; then
    if [[ "${repo_root}" != "${APP_DIR}" ]]; then
      log "copiando projeto de ${repo_root} → ${APP_DIR}"
      mkdir -p "${APP_DIR}"
      rsync -a --delete \
        --exclude '.git' \
        --exclude 'node_modules' \
        --exclude '.next' \
        --exclude '.env' \
        "${repo_root}/" "${APP_DIR}/"
      if [[ -d "${repo_root}/.git" ]]; then
        rsync -a "${repo_root}/.git/" "${APP_DIR}/.git/"
      fi
    fi
    return
  fi

  [[ -n "${REPO_URL}" ]] || die "defina REPO_URL ou rode o script de dentro do repositório"

  log "clonando ${REPO_URL} → ${APP_DIR}"
  mkdir -p "$(dirname "${APP_DIR}")"
  git clone --branch "${BRANCH}" --depth 1 "${REPO_URL}" "${APP_DIR}"
}

write_env() {
  local env_file="${APP_DIR}/.env"
  if [[ -f "${env_file}" ]]; then
    ok ".env já existe — mantendo"
    return
  fi

  log "criando .env"
  cat >"${env_file}" <<EOF
SITE_DOMAIN=${SITE_DOMAIN}
ACME_EMAIL=${ACME_EMAIL}
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
APP_PORT=${APP_PORT}
EOF
  chmod 600 "${env_file}"
  ok ".env criado"
}

deploy_stack() {
  cd "${APP_DIR}"

  # remove tentativa anterior do Caddy preso na :80
  docker compose --profile edge stop caddy >/dev/null 2>&1 || true
  docker compose --profile edge rm -f caddy >/dev/null 2>&1 || true

  if [[ "${WITH_EDGE}" == "1" ]]; then
    log "build + up (web + Caddy nas portas 80/443)…"
    docker compose --profile edge up -d --build --remove-orphans
  else
    log "build + up (web em 127.0.0.1:${APP_PORT})…"
    docker compose up -d --build --remove-orphans
  fi

  ok "containers no ar"
  docker compose ps
}

print_next_steps() {
  echo
  ok "deploy concluído"
  echo
  if [[ "${WITH_EDGE}" == "1" ]]; then
    printf "  Site: https://${SITE_DOMAIN}\n"
    printf "\n  Confirme: DNS A/AAAA + portas 80/443 livres no host.\n"
  else
    printf "  App local: http://127.0.0.1:${APP_PORT}\n"
    printf "\n  A porta 80/443 já deve estar com nginx/Caddy do host.\n"
    printf "  Aponte o domínio para este backend:\n"
    printf "    nginx → deploy/nginx.nsantos.dev.conf\n"
    printf "    Caddy → deploy/caddy.nsantos.dev.conf\n"
    printf "\n  Exemplo rápido (nginx + certbot):\n"
    printf "    sudo cp deploy/nginx.nsantos.dev.conf /etc/nginx/sites-available/nsantos.dev\n"
    printf "    sudo ln -sf /etc/nginx/sites-available/nsantos.dev /etc/nginx/sites-enabled/\n"
    printf "    sudo nginx -t && sudo systemctl reload nginx\n"
    printf "    sudo certbot --nginx -d ${SITE_DOMAIN} -d www.${SITE_DOMAIN}\n"
  fi
  echo
  printf "  Logs:    cd ${APP_DIR} && docker compose logs -f web\n"
  printf "  Rebuild: cd ${APP_DIR} && docker compose up -d --build\n"
  printf "  Status:  cd ${APP_DIR} && docker compose ps\n"
  echo
}

main() { 
  log "deploy · ${SITE_DOMAIN} → ${APP_DIR}"
  install_docker
  configure_firewall
  sync_repo
  write_env
  deploy_stack
  print_next_steps
}

main "$@"
