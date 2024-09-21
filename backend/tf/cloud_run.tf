variable "cloud_run_service_name" {
  description = "The name of the Cloud Run service"
  type        = string
}

resource "google_cloud_run_v2_service" "service" {
  name     = var.cloud_run_service_name
  location = var.region
  deletion_protection = false

  template {
      containers {
        image = "nginx:alpine"
        ports {
          container_port = 80
        }
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "noauth" {
  location = google_cloud_run_v2_service.service.location
  name     = google_cloud_run_v2_service.service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}


output "service_url" {
  value = google_cloud_run_v2_service.service.uri
}