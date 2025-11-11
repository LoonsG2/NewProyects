variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "frontend_image" {
  description = "Frontend Docker image URL"
  type        = string
}

variable "backend_image" {
  description = "Backend Docker image URL"
  type        = string
}

variable "database_username" {
  description = "Database master username"
  type        = string
  default     = "hoteladmin"
}

variable "database_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for authentication"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "hotel-dev.example.com"
}

variable "create_route53_zone" {
  description = "Whether to create Route53 zone"
  type        = bool
  default     = false
}