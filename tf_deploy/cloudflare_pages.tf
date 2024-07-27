
resource "cloudflare_pages_project" "taishi_wtf" {
  account_id        = var.cf_account_id
  name              = "taishi-wtf"
  production_branch = "main"

  build_config {
    build_command   = "pnpm run build"
    destination_dir = "dist"
    root_dir        = "frontend"
  }

  source {
    type = "github"
    config {
      owner               = var.cf_pages_repo_owner
      repo_name           = var.cf_pages_repo_name
      production_branch   = "main"
      deployments_enabled = true
    }
  }

  deployment_configs {
    production {
      secrets = {
        API_URL = google_cloud_run_v2_service.taishi_wtf_api.uri
      }
    }
  }
}

resource "cloudflare_pages_domain" "taishi_wtf_domain" {
  account_id   = var.cf_account_id
  project_name = cloudflare_pages_project.taishi_wtf.name
  domain       = var.cf_pages_domain
}

resource "cloudflare_record" "cloudflare_pages" {
  zone_id = var.cf_zone_id
  name    = "taishi.wtf"
  value   = cloudflare_pages_project.taishi_wtf.subdomain
  type    = "CNAME"
  proxied = true
}
