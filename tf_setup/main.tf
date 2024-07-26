# setup gcloud
# gcloud init
# gcloud auth application-default login
# gcloud config set project {project_id}

# setup variables.secret.tfvars
# https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
# cf_api_token = ""

# terraform
# terraform init
# terraform plan -var-file=variables.tfvars -var-file=variables.secret.tfvars
# terraform apply -var-file=variables.tfvars -var-file=variables.secret.tfvars

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

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cf_api_token
}

provider "google" {
  project = var.gcp_project
}
