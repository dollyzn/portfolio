#!/usr/bin/env bash
#
# Deploy do portfólio em Ubuntu (Hetzner / qualquer VPS).
#
# Uso no servidor:
#   curl -fsSL https://raw.githubusercontent.com/SEU_USER/SEU_REPO/main/scripts/deploy.sh | bash
#   # ou, com o repo já clonado:
#   ./scripts/deploy.sh
#
# Variáveis opcionais:
#   SITE_DOMAIN=nsantos.dev
#   ACME_EMAIL=contato@nsantos.dev
#   NEXT_PUBLIC_SITE_URL=https://nsantos.dev
#   REPO_URL=git@github.com:dollyzn/portfolio.git
#   APP_DIR=/opt/portfolio
#   BRANCH=main
#   HTTP_ONLY=1          # sobe só a app na :3000, sem Caddy/HTTPS
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

need_root() {
  if [[ "${EUID}" -ne 0 ]]; then
    die "rode como root (sudo ./scripts/deploy.sh)"
  fi
}

SITE_DOMAIN="${SITE_DOMAIN:-nsantos.dev}"
ACME_EMAIL="${ACME_EMAIL:-contato@nsantos.dev}"
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://${SITE_DOMAIN}}"
REPO_URL="${REPO_URL:-}"
APP_DIR="${APP_DIR:-/opt/portfolio}"
BRANCH="${BRANCH:-main}"
HTTP_ONLY="${HTTP_ONLY:-0}"

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
  if [[ "${HTTP_ONLY}" == "1" ]]; then
    ufw allow 3000/tcp >/dev/null
  else
    ufw allow 80/tcp >/dev/null
    ufw allow 443/tcp >/dev/null
    ufw allow 443/udp >/dev/null
  fi
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

  # script rodando de dentro do clone
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
        # mantém .git para próximos deploys via pull
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
EOF
  chmod 600 "${env_file}"
  ok ".env criado"
}

deploy_stack() {
  cd "${APP_DIR}"

  if [[ "${HTTP_ONLY}" == "1" ]]; then
    log "subindo só a app (HTTP_ONLY) na porta 3000…"
    docker compose -f docker-compose.yml -f deploy/docker-compose.http.yml up -d --build --remove-orphans
  else
    log "build + up (web + Caddy)…"
    docker compose up -d --build --remove-orphans
  fi

  ok "containers no ar"
  docker compose ps
}

print_next_steps() {
  echo
  ok "deploy concluído"
  echo
  if [[ "${HTTP_ONLY}" == "1" ]]; then
    printf "  App:  http://$(hostname -I | awk '{print $1}'):3000\n"
  else
    printf "  Site: https://${SITE_DOMAIN}\n"
    printf "\n  Confirme antes do HTTPS:\n"
    printf "  1. DNS A (e AAAA se tiver) de ${SITE_DOMAIN} e www → IP deste VPS\n"
    printf "  2. Portas 80/443 liberadas no firewall da Hetzner Cloud\n"
    printf "  3. Aguarde a emissão do certificado Let's Encrypt (alguns segundos)\n"
  fi
  echo
  printf "  Logs:    cd ${APP_DIR} && docker compose logs -f\n"
  printf "  Rebuild: cd ${APP_DIR} && docker compose up -d --build\n"
  printf "  Status:  cd ${APP_DIR} && docker compose ps\n"
  echo
}

main() {
  need_root
  log "deploy · ${SITE_DOMAIN} → ${APP_DIR}"
  install_docker
  configure_firewall
  sync_repo
  write_env
  deploy_stack
  print_next_steps
}

main "$@"
