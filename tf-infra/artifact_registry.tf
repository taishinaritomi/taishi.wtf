
# base_id = "{gcp_artifact_registry_location}-docker.pkg.dev/{project_id}/registry/api"

resource "google_artifact_registry_repository" "registry" {
  location      = var.gcp_artifact_registry_location
  repository_id = "registry"
  format        = "DOCKER"
  docker_config {
    immutable_tags = false
  }
}


resource "google_service_account" "registry_reader" {
  account_id   = "registry-reader"
  display_name = "Service account for Artifact Registry Reader"
}

resource "google_artifact_registry_repository_iam_member" "registry_reader" {
  location   = google_artifact_registry_repository.registry.location
  project    = google_artifact_registry_repository.registry.project
  repository = google_artifact_registry_repository.registry.name
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.registry_reader.email}"
}

output "registry_repository_url" {
  value = "${google_artifact_registry_repository.registry.location}-docker.pkg.dev/${google_artifact_registry_repository.registry.project}/${google_artifact_registry_repository.registry.name}"
}
