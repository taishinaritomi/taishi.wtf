# provider = "projects/{project_number}/locations/global/workloadIdentityPools/github-actions-workload-pool/providers/github-actions"
# service_account = "github-actions@{project_id}.iam.gserviceaccount.com"

resource "google_iam_workload_identity_pool" "github_actions_workload_pool" {
  workload_identity_pool_id = "github-actions-workload-pool"
  description               = "Workload Identity Pool for GitHub Actions"
  display_name              = "GitHub Actions"
}

resource "google_iam_workload_identity_pool_provider" "github_actions" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_actions_workload_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-actions"
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
  attribute_mapping = {
    "google.subject"        = "assertion.sub"
    "attribute.actor"       = "assertion.actor"
    "attribute.repository"  = "assertion.repository"
    "attribute.environment" = "assertion.environment"
  }
  attribute_condition = "assertion.repository == 'taishinaritomi/taishi.wtf'"
}

resource "google_service_account" "github_actions" {
  account_id   = "github-actions"
  display_name = "Service account for GitHub Actions"
}

resource "google_project_iam_member" "github_actions_iam_owner" {
  project = var.gcp_project
  role    = "roles/owner"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

resource "google_service_account_iam_member" "github_actions_iam_workload_identity_user" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_actions_workload_pool.name}/*"
}
