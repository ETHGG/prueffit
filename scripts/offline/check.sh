#!/bin/sh
# Offline checks for cloud sessions without npm registry access (since 2.21.25).
# Usage: sh scripts/offline/check.sh [unit|lint|e2e|pdfs|all]   (default: unit + lint)
# - unit: node:test with a small Vitest replacement (scripts/offline/vitest.mjs)
# - lint: global ESLint with scripts/offline/eslint.config.mjs (CI runs the full config)
# - e2e/pdfs: Playwright from the environment image (/opt/npm-tools), browsers in /opt/pw-browsers
set -e
cd "$(dirname "$0")/../.."
MODE="${1:-default}"
link_playwright() {
  if [ ! -e node_modules/playwright ] && [ -d /opt/npm-tools/node_modules/playwright ]; then
    mkdir -p node_modules && ln -s /opt/npm-tools/node_modules/playwright node_modules/playwright
  fi
  export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
}
unit() { node --import ./scripts/offline/register.mjs --test tests/*.test.js; }
lint() {
  ESLINT_BIN="$(command -v eslint || true)"
  if [ -z "$ESLINT_BIN" ]; then echo "ESLint nicht gefunden – Lint läuft nur in der CI"; return 0; fi
  ESLINT_PKG="$(cd "$(dirname "$(readlink -f "$ESLINT_BIN")")/.." && pwd)"
  export ESLINT_PKG
  eslint --config scripts/offline/eslint.config.mjs .
}
e2e() { link_playwright; node node_modules/playwright/cli.js test --project=desktop-chromium --project=iphone-se-chromium --project=iphone-13-dark-chromium --reporter=line; }
pdfs() { link_playwright; node scripts/build-pdfs.mjs; }
case "$MODE" in
  unit) unit ;;
  lint) lint ;;
  e2e) e2e ;;
  pdfs) pdfs ;;
  all) unit; lint; e2e ;;
  *) unit; lint ;;
esac
