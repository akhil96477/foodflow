terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# 1. Elastic Container Registries (ECR)
resource "aws_ecr_repository" "frontend" {
  name                 = var.ecr_repository_frontend
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "backend" {
  name                 = var.ecr_repository_backend
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

# 2. EKS Cluster Module
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "~> 20.0"
  cluster_name    = var.cluster_name
  cluster_version = "1.30"

  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true

  # Worker Nodes
  eks_managed_node_groups = {
    foodiefy-workers = {
      min_size       = 1
      max_size       = 3
      desired_size   = var.node_desired_capacity
      instance_types = [var.node_instance_type]
      ami_type       = "AL2023_x86_64_STANDARD"
    }
  }
}
