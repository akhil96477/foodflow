# Terraform Configuration for Foodiefy (AWS)

This directory contains the Infrastructure as Code (IaC) required to provision a production-ready Kubernetes cluster (Amazon EKS), a Virtual Private Cloud (VPC), and a private Elastic Container Registry (ECR) on AWS for the Foodiefy application.

## Prerequisites
1. [Terraform](https://developer.hashicorp.com/terraform/downloads) installed on your local machine.
2. An AWS account.
3. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed on your local machine.

## Instructions

1. **Configure the AWS CLI:**
   You must securely authenticate your local environment with AWS. Run the following command and enter your `AWS Access Key ID`, `AWS Secret Access Key`, and set your default region to `us-east-1`:
   ```bash
   aws configure
   ```

2. **Initialize Terraform:**
   Run this to download the required AWS provider plugins:
   ```bash
   terraform init
   ```

3. **Preview Changes:**
   Run `terraform plan` to see what resources will be created. This will provision an entire VPC network, an EKS cluster with 2 `t3.medium` instances, and ECR repositories:
   ```bash
   terraform plan
   ```

4. **Apply Changes:**
   Execute the plan to provision the resources in AWS (this may take 15-20 minutes, EKS clusters take a while to provision):
   ```bash
   terraform apply
   ```

5. **Connect to your new EKS cluster:**
   Once the cluster is ready, download the kubeconfig file so you can interact with it using `kubectl`:
   ```bash
   aws eks update-kubeconfig --name foodiefy-eks-cluster --region us-east-1
   ```

6. **Log in to the ECR Registry:**
   Authenticate Docker with your new Amazon ECR so you can push images:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com
   ```

7. **Next Steps:**
   Now that the infrastructure is up, simply push code to the `main` branch of your GitHub repository, and GitHub Actions will take care of building the containers and deploying them to EKS!
