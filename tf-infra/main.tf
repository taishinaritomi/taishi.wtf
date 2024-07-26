# setup gcloud
# gcloud init
# gcloud auth application-default login
# gcloud config set project {{project_id}}

terraform {
  backend "gcs" {
    # gcloud storage buckets create gs://taishi-wtf-terraform-state --location=ASIA-NORTHEAST1
    bucket = "taishi-wtf-terraform-state"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.0.0, < 5.0.0"
    }
  }
}

provider "google" {
  project = var.gcp_project
}
