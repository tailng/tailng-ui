#!/usr/bin/env bash
set -euo pipefail

DOCS_DIST="${DOCS_DIST:-dist/apps/tailng-ui/docs/browser}"
DOCS_ASSETS_DIR="${DOCS_ASSETS_DIR:-${DOCS_DIST}/assets}"
DOCS_BUILD_SCRIPT="${DOCS_BUILD_SCRIPT:-build:docs}"
DOCS_PRERENDER_SCRIPT="${DOCS_PRERENDER_SCRIPT:-prerender:docs}"
DOCS_VERIFY_SCRIPT="${DOCS_VERIFY_SCRIPT:-verify:ownable-contracts}"
CF_PAGES_PROJECT_NAME="${CF_PAGES_PROJECT_NAME:-${CF_DOCS_PROJECT_NAME:-}}"
CF_PAGES_BRANCH="${CF_PAGES_BRANCH:-${GITHUB_REF_NAME:-}}"
REQUIRED_NODE_MAJOR="${REQUIRED_NODE_MAJOR:-22}"

export DOCS_DIST

ensure_node_version() {
  local node_version
  local node_major

  node_version="$(node -v 2>/dev/null || true)"
  node_major="${node_version#v}"
  node_major="${node_major%%.*}"

  if [ "${node_major}" = "${REQUIRED_NODE_MAJOR}" ]; then
    return
  fi

  if [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
    # shellcheck source=/dev/null
    . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
    nvm use "${REQUIRED_NODE_MAJOR}"

    node_version="$(node -v 2>/dev/null || true)"
    node_major="${node_version#v}"
    node_major="${node_major%%.*}"

    if [ "${node_major}" = "${REQUIRED_NODE_MAJOR}" ]; then
      return
    fi
  fi

  echo "Node.js ${REQUIRED_NODE_MAJOR}.x is required for Wrangler. Current version: ${node_version:-not found}."
  echo "Run: nvm use ${REQUIRED_NODE_MAJOR}"
  exit 1
}

if [ -z "${CF_PAGES_PROJECT_NAME}" ]; then
  echo "Missing Cloudflare Pages project name. Set CF_PAGES_PROJECT_NAME or CF_DOCS_PROJECT_NAME."
  exit 1
fi

if [ -z "${CF_PAGES_BRANCH}" ]; then
  CF_PAGES_BRANCH="$(git branch --show-current)"
fi

if [ -z "${CF_PAGES_BRANCH}" ]; then
  CF_PAGES_BRANCH="local"
fi

ensure_node_version

pnpm run "${DOCS_VERIFY_SCRIPT}"
pnpm exec puppeteer browsers install chrome
pnpm run "${DOCS_BUILD_SCRIPT}"
pnpm run "${DOCS_PRERENDER_SCRIPT}"

RELEASE_DATE_TIME="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

mkdir -p "${DOCS_ASSETS_DIR}"
{
  echo "release date and time = '${RELEASE_DATE_TIME}'"
  echo "branch=${CF_PAGES_BRANCH}"
  echo "commit=$(git rev-parse --short HEAD)"
  echo "time=${RELEASE_DATE_TIME}"
} > "${DOCS_ASSETS_DIR}/info.txt"

pnpm dlx wrangler pages deploy "${DOCS_DIST}" \
  --project-name "${CF_PAGES_PROJECT_NAME}" \
  --branch "${CF_PAGES_BRANCH}"
