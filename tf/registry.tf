resource "google_artifact_registry_repository" "repo" {
  repository_id = terraform.workspace
  description   = "Docker Repository for project ${var.project}."
  format        = "DOCKER"

  docker_config {
    immutable_tags = true
  }

}

output "repository_url" {
  value = "${google_artifact_registry_repository.repo.location}-docker.pkg.dev/${google_artifact_registry_repository.repo.project}/${google_artifact_registry_repository.repo.repository_id}"
}