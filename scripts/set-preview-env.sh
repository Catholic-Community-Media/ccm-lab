#!/usr/bin/env bash
# Point Netlify deploy previews and branch deploys at the Neon `preview` branch,
# with their own app secrets, so previews can never migrate or write production.
# Production context values are not touched. Prints no secrets.
set -euo pipefail
cd "$(dirname "$0")/.."

PREVIEW_DB="$(npx -y neon@8.23.1 connection-string preview --project-id empty-unit-52498631 --pooled)"
case "$PREVIEW_DB" in postgres*) ;; *) echo "Could not get preview connection string" >&2; exit 1 ;; esac

set_preview() {
  npx -y netlify-cli env:set "$1" "$2" --secret --context deploy-preview branch-deploy --force >/dev/null
  echo "$1 set for deploy-preview + branch-deploy"
}

set_preview DATABASE_URI "$PREVIEW_DB"
set_preview PAYLOAD_SECRET "$(openssl rand -hex 32)"
set_preview JOBS_SECRET "$(openssl rand -hex 32)"
echo "preview contexts updated"
