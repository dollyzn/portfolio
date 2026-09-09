#!/usr/bin/env bash
# Atualiza o site a partir do git e reconstrói os containers.
# Uso: sudo APP_DIR=/home/chatwoot/nsantos ./scripts/update.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/portfolio}"
BRANCH="${BRANCH:-main}"

cd "${APP_DIR}"

git_as_owner() {
  local owner
  owner="$(stat -c '%U' "${APP_DIR}" 2>/dev/null || echo root)"
  if [[ "${EUID}" -eq 0 && "${owner}" != "root" ]]; then
    sudo -u "${owner}" -H git -C "${APP_DIR}" "$@"
  else
    git -C "${APP_DIR}" "$@"
  fi
}

if [[ -d .git ]]; then
  git config --global --add safe.directory "${APP_DIR}" 2>/dev/null || true
  if ! git_as_owner fetch --all --prune \
    || ! git_as_owner checkout "${BRANCH}" \
    || ! git_as_owner pull --ff-only origin "${BRANCH}"; then
    echo "! git pull falhou — rebuild com o código local"
  fi
fi

docker compose up -d --build --remove-orphans
docker compose ps
docker image prune -f >/dev/null
echo "✓ atualizado"
