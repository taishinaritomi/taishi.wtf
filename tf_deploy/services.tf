resource "google_project_service" "service_iam" {
  project            = var.gcp_project
  service            = "iam.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "service_run" {
  project            = var.gcp_project
  service            = "run.googleapis.com"
  disable_on_destroy = false
}
