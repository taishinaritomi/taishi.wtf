# terraform
# terraform init
# terraform plan -var-file=variables.tfvars
# terraform apply -var-file=variables.tfvars

# setup variables.secret.tfvars
# https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
# cf_api_token = ""

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

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.gcp_project
}

provider "cloudflare" {
  api_token = var.cf_api_token
}
