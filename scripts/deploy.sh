#!/usr/bin/env bash
#
# Deploy do portfólio em Ubuntu com nginx no host.
# Sobe o Next em 127.0.0.1:3000 — o nginx do servidor faz o HTTPS.
#
#   sudo ./scripts/deploy.sh
#   sudo APP_DIR=/caminho/custom ./scripts/deploy.sh
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
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://${SITE_DOMAIN}}"
APP_PORT="${APP_PORT:-3000}"
REPO_URL="${REPO_URL:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${APP_DIR:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
BRANCH="${BRANCH:-main}"

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
  ufw --force enable >/dev/null
  ok "firewall ativo"
}

git_as_owner() {
  local owner
  owner="$(stat -c '%U' "${APP_DIR}" 2>/dev/null || echo root)"
  if [[ "${EUID}" -eq 0 && "${owner}" != "root" ]]; then
    sudo -u "${owner}" -H git -C "${APP_DIR}" "$@"
  else
    git -C "${APP_DIR}" "$@"
  fi
}

sync_repo() {
  if [[ -f "${APP_DIR}/docker-compose.yml" ]]; then
    log "atualizando código em ${APP_DIR}…"
    if [[ -d "${APP_DIR}/.git" ]]; then
      # evita "dubious ownership" e usa a chave SSH do dono do diretório
      git config --global --add safe.directory "${APP_DIR}" 2>/dev/null || true
      if ! git_as_owner fetch --all --prune \
        || ! git_as_owner checkout "${BRANCH}" \
        || ! git_as_owner pull --ff-only origin "${BRANCH}"; then
        warn "git pull falhou — seguindo com o código já presente em ${APP_DIR}"
      else
        ok "código atualizado"
      fi
    else
      warn "pasta existe sem git — usando arquivos locais"
    fi
    return
  fi

  local repo_root
  repo_root="$(cd "${SCRIPT_DIR}/.." && pwd)"

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
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
APP_PORT=${APP_PORT}
EOF
  chmod 600 "${env_file}"
  ok ".env criado"
}

deploy_stack() {
  cd "${APP_DIR}"

  # limpa resíduos do Caddy antigo, se existirem
  docker rm -f portfolio-caddy-1 2>/dev/null || true

  log "build + up (web em 127.0.0.1:${APP_PORT})…"
  docker compose up -d --build --remove-orphans

  ok "containers no ar"
  docker compose ps
}

print_next_steps() {
  echo
  ok "app no ar em http://127.0.0.1:${APP_PORT}"
  echo
  printf "  Próximo passo — nginx + certbot:\n"
  printf "    sudo cp ${APP_DIR}/deploy/nginx.nsantos.dev.conf /etc/nginx/sites-available/${SITE_DOMAIN}\n"
  printf "    sudo ln -sf /etc/nginx/sites-available/${SITE_DOMAIN} /etc/nginx/sites-enabled/\n"
  printf "    sudo nginx -t && sudo systemctl reload nginx\n"
  printf "    sudo certbot --nginx -d ${SITE_DOMAIN} -d www.${SITE_DOMAIN}\n"
  echo
  printf "  Logs:    cd ${APP_DIR} && docker compose logs -f web\n"
  printf "  Rebuild: cd ${APP_DIR} && docker compose up -d --build\n"
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
