#!/usr/bin/env bash
# =============================================================================
# seed-remote.sh - Seed the remote Cloud SQL database via Cloud SQL Auth Proxy
#
# Usage: ./scripts/seed-remote.sh <PROJECT_ID>
#
# Prerequisites:
#   1. Install Cloud SQL Auth Proxy:
#      - macOS:   brew install cloud-sql-proxy
#      - Linux:   curl -o cloud-sql-proxy \
#                   https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.14.1/cloud-sql-proxy.linux.amd64 \
#                   && chmod +x cloud-sql-proxy && sudo mv cloud-sql-proxy /usr/local/bin/
#      - Docker:  gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.14.1
#
#   2. Authenticate with GCP:
#      gcloud auth application-default login
#
#   3. Install project dependencies:
#      npm install
# =============================================================================
set -e

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
PROJECT_ID="${1:?Usage: ./scripts/seed-remote.sh <PROJECT_ID>}"
REGION="us-central1"
SQL_INSTANCE_NAME="ai-academy-db"
CLOUD_SQL_CONNECTION="${PROJECT_ID}:${REGION}:${SQL_INSTANCE_NAME}"
PROXY_PORT=5433

echo "============================================="
echo "  AI Academy B2B - Remote Database Seed"
echo "============================================="
echo "Project:    ${PROJECT_ID}"
echo "Instance:   ${CLOUD_SQL_CONNECTION}"
echo "Proxy port: ${PROXY_PORT}"
echo "============================================="
echo ""

# ---------------------------------------------------------------------------
# Check prerequisites
# ---------------------------------------------------------------------------
echo ">>> Checking prerequisites..."

if ! command -v cloud-sql-proxy &> /dev/null; then
  echo ""
  echo "ERROR: cloud-sql-proxy is not installed."
  echo ""
  echo "Install it with one of the following methods:"
  echo ""
  echo "  macOS (Homebrew):"
  echo "    brew install cloud-sql-proxy"
  echo ""
  echo "  Linux (direct download):"
  echo "    curl -o cloud-sql-proxy \\"
  echo "      https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.14.1/cloud-sql-proxy.linux.amd64"
  echo "    chmod +x cloud-sql-proxy"
  echo "    sudo mv cloud-sql-proxy /usr/local/bin/"
  echo ""
  exit 1
fi

if ! command -v npx &> /dev/null; then
  echo "ERROR: npx is not installed. Please install Node.js and npm first."
  exit 1
fi

echo "    All prerequisites met."

# ---------------------------------------------------------------------------
# Retrieve DATABASE_URL from Secret Manager
# ---------------------------------------------------------------------------
echo ""
echo ">>> Retrieving database credentials from Secret Manager..."
SECRET_DB_URL="$(gcloud secrets versions access latest --secret=DATABASE_URL --project="${PROJECT_ID}" --quiet)"

# Extract user, password, and database from the secret URL
DB_USER="$(echo "${SECRET_DB_URL}" | sed -n 's|postgresql://\([^:]*\):.*|\1|p')"
DB_PASSWORD="$(echo "${SECRET_DB_URL}" | sed -n 's|postgresql://[^:]*:\([^@]*\)@.*|\1|p')"
DB_NAME="$(echo "${SECRET_DB_URL}" | sed -n 's|.*/\([^?]*\).*|\1|p')"

echo "    Credentials retrieved. Database: ${DB_NAME}, User: ${DB_USER}"

# ---------------------------------------------------------------------------
# Start Cloud SQL Auth Proxy in background
# ---------------------------------------------------------------------------
echo ""
echo ">>> Starting Cloud SQL Auth Proxy on port ${PROXY_PORT}..."
cloud-sql-proxy "${CLOUD_SQL_CONNECTION}" \
  --port "${PROXY_PORT}" \
  --quiet &
PROXY_PID=$!

# Give the proxy a moment to start
sleep 3

# Ensure proxy is killed on script exit
cleanup() {
  echo ""
  echo ">>> Stopping Cloud SQL Auth Proxy (PID: ${PROXY_PID})..."
  kill "${PROXY_PID}" 2>/dev/null || true
  wait "${PROXY_PID}" 2>/dev/null || true
  echo "    Proxy stopped."
}
trap cleanup EXIT

# Check that the proxy is running
if ! kill -0 "${PROXY_PID}" 2>/dev/null; then
  echo "ERROR: Cloud SQL Auth Proxy failed to start."
  echo "Make sure you have authenticated: gcloud auth application-default login"
  exit 1
fi
echo "    Proxy running (PID: ${PROXY_PID})."

# ---------------------------------------------------------------------------
# Build DATABASE_URL for local proxy connection
# ---------------------------------------------------------------------------
PROXY_DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:${PROXY_PORT}/${DB_NAME}"
export DATABASE_URL="${PROXY_DATABASE_URL}"

# ---------------------------------------------------------------------------
# Run Prisma db push (sync schema)
# ---------------------------------------------------------------------------
echo ""
echo ">>> Running prisma db push..."
npx prisma db push --accept-data-loss --skip-generate
echo "    Schema pushed."

# ---------------------------------------------------------------------------
# Run Prisma seed
# ---------------------------------------------------------------------------
echo ""
echo ">>> Running prisma db seed..."
npx prisma db seed
echo "    Database seeded."

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo "============================================="
echo "  Remote database seed complete!"
echo "============================================="
echo ""
