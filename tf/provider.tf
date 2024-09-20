terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.3.0"
    }
  }
}

variable "project" {
  type = string
}

variable "region" {
  type = string
}

variable "zone" {
  type = string
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