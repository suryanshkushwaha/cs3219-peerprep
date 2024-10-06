resource "google_storage_bucket" "frontend" {
  name          = "${var.project}-${terraform.workspace}-frontend"
  location      = "US"
  force_destroy = true

  website {
    main_page_suffix = "index.html"
  }
  cors { # TODO: yes, yes. Incredibly insecure. I'ms sorry.
    origin          = [""]
    method          = ["*"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket_access_control" "public_read" {
  bucket = google_storage_bucket.frontend.name
    role   = "READER"
    entity = "allUsers"
}

resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.frontend.name
    role   = "roles/storage.objectViewer"
    member = "allUsers"
}

output "frontend_bucket_url" {
    value = google_storage_bucket.frontend.url
}

output "frontend_bucket_website_url" {
    value = "https://storage.googleapis.com/${google_storage_bucket.frontend.name}/index.html"
}