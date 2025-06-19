# GitHub Secrets Setup for CI/CD

This document explains how to configure the required GitHub secrets for automated deployment to Google Cloud Run.

## Required Secrets

### 1. GCP_SA_KEY
**Purpose**: Google Cloud service account credentials for deployment

**Setup Steps**:
1. Create a service account in Google Cloud Console:
   ```bash
   gcloud iam service-accounts create github-actions \
     --description="Service account for GitHub Actions" \
     --display-name="GitHub Actions"
   ```

2. Grant necessary permissions:
   ```bash
   # Get your project ID
   PROJECT_ID=$(gcloud config get-value project)
   
   # Grant Cloud Run permissions
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   # Grant Cloud Build permissions (needed for source deployment)
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/cloudbuild.builds.editor"
   
   # Grant Storage permissions (for build artifacts)
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   
   # Grant IAM permissions (to manage service accounts)
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   ```

3. Create and download key:
   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com
   ```

4. Add to GitHub:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GCP_SA_KEY`
   - Value: Copy the entire contents of `key.json`

### 2. FASTAPI_URL
**Purpose**: URL of your FastAPI backend service

**Setup Steps**:
1. Deploy your FastAPI service (if not already deployed):
   ```bash
   # In your arrgh-fastapi directory
   gcloud run deploy arrgh-fastapi \
     --source . \
     --region us-central1 \
     --allow-unauthenticated
   ```

2. Get the service URL:
   ```bash
   gcloud run services describe arrgh-fastapi \
     --region=us-central1 \
     --format='value(status.url)'
   ```

3. Add to GitHub:
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `FASTAPI_URL`
   - Value: The full URL (e.g., `https://arrgh-fastapi-xyz.a.run.app`)

## Optional Secrets

### FASTAPI_TOKEN
If your FastAPI service requires authentication, add this secret with your bearer token.

## Verification

After setting up secrets, you can verify the setup by:

1. **Testing locally** (optional):
   ```bash
   # Export the service account key
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json"
   
   # Test gcloud access
   gcloud run services list --region=us-central1
   ```

2. **Trigger a deployment**:
   - Push to main branch or merge a PR
   - Check Actions tab for workflow execution
   - Verify deployment in Google Cloud Console

## Security Notes

- ✅ Service account has minimal required permissions
- ✅ Key is stored securely in GitHub secrets
- ✅ Key is never exposed in logs or code
- ⚠️ Rotate service account key periodically
- ⚠️ Monitor Cloud Run deployment logs for any issues

## Troubleshooting

### Common Issues

1. **Permission denied errors**:
   - Verify service account has all required roles
   - Check that the key.json is valid and complete

2. **Cloud Build failures**:
   - Ensure Cloud Build API is enabled
   - Verify storage permissions for build artifacts

3. **Service URL not accessible**:
   - Check Cloud Run service status
   - Verify --allow-unauthenticated flag was used

### Debug Commands

```bash
# List service accounts
gcloud iam service-accounts list

# Check service account permissions
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-actions@$PROJECT_ID.iam.gserviceaccount.com"

# Check Cloud Run status
gcloud run services describe excalidraw-nextjs --region=us-central1
```