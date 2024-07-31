data "google_iam_policy" "cloud_run_public" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "policy" {
  location = google_cloud_run_v2_service.taishi_wtf_api.location
  project  = google_cloud_run_v2_service.taishi_wtf_api.project
  service  = google_cloud_run_v2_service.taishi_wtf_api.name

  policy_data = data.google_iam_policy.cloud_run_public.policy_data
}

resource "google_cloud_run_v2_service" "taishi_wtf_api" {
  name     = "taishi-wtf-api"
  location = var.gcp_cloud_run_location
  client   = "terraform"

  template {
    service_account = var.gcp_cloud_run_service_account

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    max_instance_request_concurrency = 200

    containers {
      image = var.gcp_cloud_run_api_image_id

      resources {
        limits = {
          cpu    = "2"
          memory = "4Gi"
        }
      }
    }
  }
}
