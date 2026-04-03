#!/usr/bin/env bash
# =============================================================================
# deploy.sh - Initial GCP setup and deployment for AI Academy B2B
#
# Usage: ./scripts/deploy.sh <PROJECT_ID>
#
# This script is idempotent - safe to run multiple times.
# It will skip resources that already exist.
# =============================================================================
set -e

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
PROJECT_ID="${1:?Usage: ./scripts/deploy.sh <PROJECT_ID>}"
REGION="us-central1"
SERVICE_NAME="ai-academy-b2b"
REPO_NAME="ai-academy"
SQL_INSTANCE_NAME="ai-academy-db"
DB_NAME="ai_academy_b2b"
DB_USER="ai_academy_user"
CUSTOM_DOMAIN="corp.aiacademy.my"

echo "============================================="
echo "  AI Academy B2B - GCP Deployment"
echo "============================================="
echo "Project:  ${PROJECT_ID}"
echo "Region:   ${REGION}"
echo "Service:  ${SERVICE_NAME}"
echo "============================================="
echo ""

# ---------------------------------------------------------------------------
# Set active project
# ---------------------------------------------------------------------------
echo ">>> Setting active project to ${PROJECT_ID}..."
gcloud config set project "${PROJECT_ID}" --quiet

# ---------------------------------------------------------------------------
# Enable required APIs
# ---------------------------------------------------------------------------
echo ""
echo ">>> Enabling required GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  --quiet
echo "    APIs enabled."

# ---------------------------------------------------------------------------
# Create Artifact Registry repository
# ---------------------------------------------------------------------------
echo ""
echo ">>> Creating Artifact Registry repository '${REPO_NAME}'..."
gcloud artifacts repositories create "${REPO_NAME}" \
  --repository-format=docker \
  --location="${REGION}" \
  --description="AI Academy Docker images" \
  --quiet 2>/dev/null || echo "    Repository already exists, skipping."

# ---------------------------------------------------------------------------
# Create Cloud SQL PostgreSQL instance
# ---------------------------------------------------------------------------
echo ""
echo ">>> Creating Cloud SQL instance '${SQL_INSTANCE_NAME}'..."
if gcloud sql instances describe "${SQL_INSTANCE_NAME}" --quiet 2>/dev/null; then
  echo "    Instance already exists, skipping."
else
  gcloud sql instances create "${SQL_INSTANCE_NAME}" \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region="${REGION}" \
    --storage-auto-increase \
    --quiet
  echo "    Instance created."
fi

# ---------------------------------------------------------------------------
# Create database
# ---------------------------------------------------------------------------
echo ""
echo ">>> Creating database '${DB_NAME}'..."
gcloud sql databases create "${DB_NAME}" \
  --instance="${SQL_INSTANCE_NAME}" \
  --quiet 2>/dev/null || echo "    Database already exists, skipping."

# ---------------------------------------------------------------------------
# Create database user
# ---------------------------------------------------------------------------
echo ""
echo ">>> Creating database user '${DB_USER}'..."
DB_PASSWORD="$(openssl rand -base64 24)"
if gcloud sql users list --instance="${SQL_INSTANCE_NAME}" --quiet 2>/dev/null | grep -q "${DB_USER}"; then
  echo "    User already exists, skipping. (Password unchanged.)"
else
  gcloud sql users create "${DB_USER}" \
    --instance="${SQL_INSTANCE_NAME}" \
    --password="${DB_PASSWORD}" \
    --quiet
  echo "    User created."
fi

# ---------------------------------------------------------------------------
# Build DATABASE_URL (Cloud SQL Unix socket format)
# ---------------------------------------------------------------------------
CLOUD_SQL_CONNECTION="${PROJECT_ID}:${REGION}:${SQL_INSTANCE_NAME}"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost/${DB_NAME}?host=/cloudsql/${CLOUD_SQL_CONNECTION}"

# ---------------------------------------------------------------------------
# Store secrets in Secret Manager
# ---------------------------------------------------------------------------
echo ""
echo ">>> Storing DATABASE_URL in Secret Manager..."
if gcloud secrets describe DATABASE_URL --quiet 2>/dev/null; then
  echo "    Secret 'DATABASE_URL' exists. Adding new version..."
  printf "%s" "${DATABASE_URL}" | gcloud secrets versions add DATABASE_URL --data-file=- --quiet
else
  printf "%s" "${DATABASE_URL}" | gcloud secrets create DATABASE_URL \
    --data-file=- \
    --replication-policy=automatic \
    --quiet
fi
echo "    DATABASE_URL stored."

echo ""
echo ">>> Storing JWT_SECRET in Secret Manager..."
JWT_SECRET="$(openssl rand -base64 48)"
if gcloud secrets describe JWT_SECRET --quiet 2>/dev/null; then
  echo "    Secret 'JWT_SECRET' already exists, skipping."
else
  printf "%s" "${JWT_SECRET}" | gcloud secrets create JWT_SECRET \
    --data-file=- \
    --replication-policy=automatic \
    --quiet
  echo "    JWT_SECRET stored."
fi

# ---------------------------------------------------------------------------
# Grant Cloud Build service account permissions
# ---------------------------------------------------------------------------
echo ""
echo ">>> Granting permissions to Cloud Build service account..."
PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
CB_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

declare -a ROLES=(
  "roles/run.admin"
  "roles/iam.serviceAccountUser"
  "roles/secretmanager.secretAccessor"
)

for ROLE in "${ROLES[@]}"; do
  echo "    Granting ${ROLE}..."
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${CB_SA}" \
    --role="${ROLE}" \
    --quiet > /dev/null
done
echo "    Permissions granted."

# ---------------------------------------------------------------------------
# Build and deploy to Cloud Run
# ---------------------------------------------------------------------------
echo ""
echo ">>> Building and deploying to Cloud Run..."
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions="_REGION=${REGION},_REPO_NAME=${REPO_NAME},_SERVICE_NAME=${SERVICE_NAME},_CLOUD_SQL_INSTANCE=${CLOUD_SQL_CONNECTION},SHORT_SHA=initial" \
  --quiet

echo "    Deployment complete."

# ---------------------------------------------------------------------------
# Map custom domain
# ---------------------------------------------------------------------------
echo ""
echo ">>> Mapping custom domain '${CUSTOM_DOMAIN}'..."
gcloud run domain-mappings create \
  --service="${SERVICE_NAME}" \
  --domain="${CUSTOM_DOMAIN}" \
  --region="${REGION}" \
  --quiet 2>/dev/null || echo "    Domain mapping already exists, skipping."

echo ""
echo ">>> Domain mapping DNS records:"
gcloud run domain-mappings describe \
  --domain="${CUSTOM_DOMAIN}" \
  --region="${REGION}" \
  --format="table(spec.routeName, status.resourceRecords.type, status.resourceRecords.rrdata)" \
  --quiet 2>/dev/null || echo "    (Run this command again later to see DNS records.)"

# ---------------------------------------------------------------------------
# Set up Cloud Build GitHub trigger
# ---------------------------------------------------------------------------
echo ""
echo ">>> Setting up Cloud Build trigger..."
echo "    NOTE: You must first connect your GitHub repository in the Cloud Build console:"
echo "    https://console.cloud.google.com/cloud-build/triggers/connect?project=${PROJECT_ID}"
echo ""
echo "    After connecting, create the trigger with:"
echo ""
echo "    gcloud builds triggers create github \\"
echo "      --name='${SERVICE_NAME}-deploy' \\"
echo "      --repo-name='ai-academy-b2b' \\"
echo "      --repo-owner='aiacademy808' \\"
echo "      --branch-pattern='^main$' \\"
echo "      --build-config='cloudbuild.yaml' \\"
echo "      --substitutions='_CLOUD_SQL_INSTANCE=${CLOUD_SQL_CONNECTION}' \\"
echo "      --region='${REGION}' \\"
echo "      --quiet"

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo "============================================="
echo "  Deployment complete!"
echo "============================================="
echo ""
echo "Service URL:"
gcloud run services describe "${SERVICE_NAME}" \
  --region="${REGION}" \
  --format="value(status.url)" \
  --quiet 2>/dev/null || echo "  (Service URL will be available after first deploy.)"
echo ""
echo "Next steps:"
echo "  1. Configure DNS for ${CUSTOM_DOMAIN} with the records shown above."
echo "  2. Connect your GitHub repo in Cloud Build console."
echo "  3. Create the Cloud Build trigger (command shown above)."
echo "  4. Run ./scripts/seed-remote.sh to seed the database."
echo ""
