variable "project" {
  type = string
}

variable "region" {
  type = string
}

variable "zone" {
  type = string
}

variable "backend_gcs_bucket" {
  type = string
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.3.0"
    }
  }

  backend "gcs" {
    bucket  = var.backend_gcs_bucket
    prefix  = "terraform/state/global"
  }
}

provider "google" {
  # Configuration options
  project = var.project
  region  = var.region
  zone    = var.zone

  default_labels = {
    "managed-by"  = "opentofu"
    "project"     = var.project
    "environment" = "terraform"
  }
}