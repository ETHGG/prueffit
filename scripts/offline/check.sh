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
  IMG=/opt/npm-tools/node_modules/playwright
  # After `npm ci` node_modules/playwright is the locked version, whose browsers cannot be downloaded in the
  # cloud. If it differs from the image's version, park it (npm ci restores it) and use the image's Playwright.
  if [ -d "$IMG" ] && [ -d node_modules/playwright ] && [ ! -L node_modules/playwright ]; then
    V_NPM="$(node -p "require('./node_modules/playwright/package.json').version")"
    V_IMG="$(node -p "require('$IMG/package.json').version")"
    if [ "$V_NPM" != "$V_IMG" ]; then
      echo "Playwright $V_NPM (npm) ≠ $V_IMG (Image, Browser vorhanden) – nutze die Image-Version"
      rm -rf node_modules/.playwright-npm && mv node_modules/playwright node_modules/.playwright-npm
    fi
  fi
  if [ ! -e node_modules/playwright ] && [ -d "$IMG" ]; then
    mkdir -p node_modules && ln -s "$IMG" node_modules/playwright
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
