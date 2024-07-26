terraform {
  backend "gcs" {
    # gcloud storage buckets create gs://taishi-wtf-deploy-terraform-state --location=ASIA-NORTHEAST1
    bucket = "taishi-wtf-deploy-terraform-state"
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
