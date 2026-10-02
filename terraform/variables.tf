variable "region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "foodiefy-eks-cluster"
}

variable "ecr_repository_frontend" {
  description = "Name of the ECR repository for the frontend"
  type        = string
  default     = "foodiefy-frontend"
}

variable "ecr_repository_backend" {
  description = "Name of the ECR repository for the backend"
  type        = string
  default     = "foodiefy-backend"
}

variable "node_instance_type" {
  description = "EC2 instance type for EKS worker nodes"
  type        = string
  default     = "t3.micro"
}

variable "node_desired_capacity" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}
