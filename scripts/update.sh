#!/usr/bin/env bash
# Atualiza o site a partir do git e reconstrói os containers.
# Uso: sudo ./scripts/update.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/portfolio}"
BRANCH="${BRANCH:-main}"

cd "${APP_DIR}"

if [[ -d .git ]]; then
  git fetch --all --prune
  git checkout "${BRANCH}"
  git pull --ff-only origin "${BRANCH}"
fi

docker compose up -d --build --remove-orphans
docker compose ps
docker image prune -f >/dev/null
echo "✓ atualizado"
