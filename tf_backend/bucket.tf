variable "backend_gcs_bucket" {
  type        = string
  description = "The name of the bucket for storing Terraform state"
}

resource "google_storage_bucket" "tf_state" {
  name     = var.backend_gcs_bucket
  location = "US"

  versioning {
    enabled = true
  }

  lifecycle {
    prevent_destroy = true
  }
}

