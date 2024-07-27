
# base_id = "{gcp_artifact_registry_location}-docker.pkg.dev/{project_id}/registry/api"

resource "google_artifact_registry_repository" "registry" {
  location      = var.gcp_artifact_registry_location
  repository_id = "registry"
  format        = "DOCKER"
  docker_config {
    immutable_tags = false
  }
}

output "registry_repository_url" {
  value = "${google_artifact_registry_repository.registry.location}-docker.pkg.dev/${google_artifact_registry_repository.registry.project}/${google_artifact_registry_repository.registry.name}"
}
