#!/usr/bin/env bash
# Atualiza o site a partir do git e reconstrói os containers.
# Uso (na pasta do app): sudo ./scripts/update.sh
# Override opcional: sudo APP_DIR=/caminho/custom ./scripts/update.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${APP_DIR:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
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
echo "✓ atualizado"
