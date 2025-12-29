#!/usr/bin/env bash
set -euo pipefail

# Script ini opsional, berguna untuk deploy manual via SSH.
PATH_PROJECT="/var/www/forum-api"

cd "$PATH_PROJECT"
git pull origin master || git pull origin main
npm ci --omit=dev

if [ -f config/database/prod.json ]; then
  npx node-pg-migrate up -f config/database/prod.json
fi

if command -v pm2 >/dev/null 2>&1; then
  pm2 restart forum-api || pm2 start src/app.js --name forum-api
else
  sudo systemctl restart forum-api
fi
