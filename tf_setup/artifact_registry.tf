
# base_id = "{gcp_artifact_registry_location}-docker.pkg.dev/{project_id}/registry/api"

resource "google_artifact_registry_repository" "registry" {
  location      = var.gcp_artifact_registry_location
  repository_id = "registry"
  format        = "DOCKER"
  docker_config {
    immutable_tags = false
  }

  # cleanup_policy_dry_run = false

  # cleanup_policies {
  #   id     = "clean-untagged"
  #   action = "DELETE"
  #   condition {
  #     tag_state = "UNTAGGED"
  #   }
  # }

  # cleanup_policies {
  #   id     = "keep-latest-versions"
  #   action = "DELETE"
  #   condition {
  #     tag_state = "TAGGED"
  #     older_than = "5d"
  #   }
  # }

  # cleanup_policies {
  #   id     = "keep-minimum-versions"
  #   action = "KEEP"
  #   most_recent_versions {
  #     keep_count = 5
  #   }
  # }
}

output "registry_repository_url" {
  value = "${google_artifact_registry_repository.registry.location}-docker.pkg.dev/${google_artifact_registry_repository.registry.project}/${google_artifact_registry_repository.registry.name}"
}
