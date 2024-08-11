# setup gcloud
# gcloud init
# gcloud auth application-default login
# gcloud config set project {project_id}

# terraform
# terraform init
# terraform plan -var-file=variables.tfvars
# terraform apply -var-file=variables.tfvars

terraform {
  backend "gcs" {
    # gcloud storage buckets create gs://taishi-wtf-terraform-state --location=ASIA-NORTHEAST1
    bucket = "taishi-wtf-terraform-state"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0.0"
    }
  }
}

provider "google" {
  project = var.gcp_project
}
