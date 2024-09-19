variable "bucket_name" {
  type        = string
  description = "The name of the bucket for storing Terraform state"
}

resource "google_storage_bucket" "tf_state" {
  name     = var.bucket_name
  location = "US"

  versioning {
    enabled = true
  }
}

